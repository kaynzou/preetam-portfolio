"use client";

import { useEffect, useRef } from "react";

export function ImageReveal({
  baseSrc,
  revealSrc,
  alt,
  brushSize = 0.16,
  fadeSpeed = 0.985,
  className,
}: {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  brushSize?: number; // fraction of canvas width
  fadeSpeed?: number; // per-frame retention factor (closer to 1 = slower fade)
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let maskCanvas = document.createElement("canvas");
    let maskCtx = maskCanvas.getContext("2d")!;
    let baseImg: HTMLImageElement;
    let revealImg: HTMLImageElement;
    let imagesReady = 0;
    let rafId = 0;
    let mouse = { x: -1, y: -1 };
    let hovering = false;
    let idleTimer = 0;
    let idleAngle = 0;
    let lastTime = performance.now();

    function loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      maskCanvas.width = width;
      maskCanvas.height = height;
    }

    function paintStamp(px: number, py: number) {
      const radius = width * brushSize;
      const gradient = maskCtx.createRadialGradient(px, py, 0, px, py, radius);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.9)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskCtx.globalCompositeOperation = "lighter";
      maskCtx.fillStyle = gradient;
      maskCtx.beginPath();
      maskCtx.arc(px, py, radius, 0, Math.PI * 2);
      maskCtx.fill();
    }

    function drawCover(context: CanvasRenderingContext2D, img: HTMLImageElement) {
      const imgRatio = img.width / img.height;
      const boxRatio = width / height;
      let drawW = width;
      let drawH = height;
      if (imgRatio > boxRatio) {
        drawH = height;
        drawW = height * imgRatio;
      } else {
        drawW = width;
        drawH = width / imgRatio;
      }
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;
      context.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (imagesReady < 2) {
        rafId = requestAnimationFrame(frame);
        return;
      }

      // fade the paint mask slightly each frame
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.fillStyle = `rgba(0,0,0,${1 - fadeSpeed})`;
      maskCtx.fillRect(0, 0, width, height);

      if (hovering && mouse.x >= 0) {
        paintStamp(mouse.x, mouse.y);
        idleTimer = 0;
      } else {
        idleTimer += dt;
        if (idleTimer > 2) {
          // idle hint: sine-wave stroke across the image
          idleAngle += dt * 1.4;
          const ix = width * (0.2 + 0.6 * ((Math.sin(idleAngle * 0.6) + 1) / 2));
          const iy = height * (0.35 + 0.25 * Math.sin(idleAngle * 2.2));
          paintStamp(ix, iy);
        }
      }

      // draw base image
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      drawCover(ctx!, baseImg);

      // draw reveal image clipped by mask
      ctx!.save();
      ctx!.globalCompositeOperation = "source-over";
      const temp = document.createElement("canvas");
      temp.width = width;
      temp.height = height;
      const tempCtx = temp.getContext("2d")!;
      drawCover(tempCtx, revealImg);
      tempCtx.globalCompositeOperation = "destination-in";
      tempCtx.drawImage(maskCanvas, 0, 0, width, height);
      ctx!.drawImage(temp, 0, 0, width, height);
      ctx!.restore();

      rafId = requestAnimationFrame(frame);
    }

    Promise.all([loadImage(baseSrc), loadImage(revealSrc)])
      .then(([b, r]) => {
        baseImg = b;
        revealImg = r;
        imagesReady = 2;
      })
      .catch(() => {
        imagesReady = 0;
      });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    rafId = requestAnimationFrame(frame);

    function toLocal(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      mouse = { x: clientX - rect.left, y: clientY - rect.top };
    }

    function onMove(e: MouseEvent) {
      hovering = true;
      toLocal(e.clientX, e.clientY);
    }
    function onLeave() {
      hovering = false;
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      hovering = true;
      toLocal(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchEnd() {
      hovering = false;
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [baseSrc, revealSrc, brushSize, fadeSpeed]);

  return (
    <div ref={containerRef} className={className} role="img" aria-label={alt}>
      <canvas ref={canvasRef} />
    </div>
  );
}
