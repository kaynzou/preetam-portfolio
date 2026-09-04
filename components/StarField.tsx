"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; phase: number; speed: number };
type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
};

export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let nextSpawn = 0;
    let rafId = 0;
    let lastTime = performance.now();

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }

    function seedStars() {
      // Stratified grid in the upper 60% of the canvas, not fully random
      const cols = 24;
      const rows = 14;
      const cellW = width / cols;
      const cellH = (height * 0.6) / rows;
      stars = [];
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          if (Math.random() > 0.55) continue;
          stars.push({
            x: cx * cellW + Math.random() * cellW,
            y: cy * cellH + Math.random() * cellH,
            r: 0.5 + Math.random() * 1.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.2,
          });
        }
      }
    }

    function spawnShootingStar() {
      const startX = width * (0.1 + Math.random() * 0.5);
      const startY = height * Math.random() * 0.25;
      const angle = Math.PI * 0.18;
      const speed = (width + height) * 0.35;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.5,
        trail: [],
      });
    }

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (visibleRef.current) {
        ctx!.clearRect(0, 0, width, height);

        // twinkling stars
        for (const s of stars) {
          const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * s.speed + s.phase);
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 248, 232, ${twinkle})`;
          ctx!.fill();
        }

        // shooting star spawn timer
        nextSpawn -= dt;
        if (nextSpawn <= 0) {
          spawnShootingStar();
          nextSpawn = 1.5 + Math.random() * 2.5;
        }

        // update + draw shooting stars with additive-style glow
        ctx!.globalCompositeOperation = "lighter";
        shootingStars = shootingStars.filter((star) => {
          star.life += dt;
          star.x += star.vx * dt;
          star.y += star.vy * dt;
          const headAlpha = Math.max(0, 1 - star.life / star.maxLife);
          star.trail.unshift({ x: star.x, y: star.y, alpha: headAlpha });
          if (star.trail.length > 40) star.trail.pop();
          for (let t = 1; t < star.trail.length; t++) {
            star.trail[t].alpha *= 0.88;
          }
          for (const point of star.trail) {
            if (point.alpha <= 0.01) continue;
            ctx!.beginPath();
            ctx!.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(255, 247, 230, ${point.alpha})`;
            ctx!.fill();
          }
          return star.life < star.maxLife && star.y < height + 50;
        });
        ctx!.globalCompositeOperation = "source-over";
      }

      rafId = requestAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    rafId = requestAnimationFrame(frame);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
}
