"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Paint pass: accumulate a brush stamp at the pointer, slowly fading old strokes.
const PAINT_FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_prev;
uniform vec2 u_mouse;
uniform vec2 u_lastMouse;
uniform float u_radius;
uniform float u_hover;
uniform float u_fade;
uniform float u_aspect;

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  float prev = texture2D(u_prev, v_uv).r;
  vec2 s = vec2(1.0, u_aspect);
  // distance to the segment since last frame, so fast strokes stay continuous
  float dist = segDist(v_uv * s, u_lastMouse * s, u_mouse * s);
  float brush = smoothstep(u_radius, u_radius * 0.3, dist) * u_hover;
  float mask = max(prev - u_fade, brush);
  gl_FragColor = vec4(mask, mask, mask, 1.0);
}`;

// Composite pass: blend base and reveal image by the mask.
const COMP_FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_base;
uniform sampler2D u_reveal;
uniform sampler2D u_mask;
uniform float u_stylize;

vec3 stylize(vec3 c, vec2 uv) {
  // "Golden hour adventure" look used when no alternate photo is provided
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  l = floor(l * 6.0 + 0.5) / 6.0;
  vec3 shadow = vec3(0.12, 0.08, 0.18);
  vec3 mid = vec3(0.85, 0.42, 0.18);
  vec3 hi = vec3(1.0, 0.86, 0.55);
  vec3 col = l < 0.5 ? mix(shadow, mid, l * 2.0) : mix(mid, hi, (l - 0.5) * 2.0);
  float v = smoothstep(0.95, 0.35, length(uv - 0.5));
  return col * (0.55 + 0.45 * v);
}

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  vec3 base = texture2D(u_base, uv).rgb;
  vec3 rev = u_stylize > 0.5 ? stylize(texture2D(u_base, uv).rgb, uv) : texture2D(u_reveal, uv).rgb;
  float m = texture2D(u_mask, v_uv).r;
  gl_FragColor = vec4(mix(base, rev, m), 1.0);
}`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function ImageReveal({
  baseSrc,
  revealSrc,
  alt,
  brushSize = 0.13,
  fadeSpeed = 0.006,
  className,
}: {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  brushSize?: number;
  fadeSpeed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    const program = (frag: string) => {
      const p = gl.createProgram()!;
      for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, frag]] as const) {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        gl.attachShader(p, s);
      }
      gl.linkProgram(p);
      return p;
    };
    const paintProg = program(PAINT_FRAG);
    const compProg = program(COMP_FRAG);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const drawQuad = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const texFrom = (img: HTMLImageElement | null, w = 1, h = 1) => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (img) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return t;
    };

    // Ping-pong FBOs for the paint mask, at half resolution
    const makeFbo = (w: number, h: number) => {
      const texture = texFrom(null, w, h);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fbo, texture };
    };
    let cur = makeFbo(2, 2);
    let prev = makeFbo(2, 2);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      cur = makeFbo(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
      prev = makeFbo(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    cleanups.push(() => ro.disconnect());

    // Pointer state (UV space, origin bottom-left to match GL)
    const mouse = { x: 0.5, y: 0.5 };
    const lastMouse = { x: 0.5, y: 0.5 };
    let hovering = false;
    let lastInteraction = performance.now();
    let hintStart = -1;

    const setPointer = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (clientX - r.left) / r.width;
      mouse.y = 1 - (clientY - r.top) / r.height;
      lastInteraction = performance.now();
      hintStart = -1;
    };
    const onMove = (e: PointerEvent) => {
      if (!hovering) {
        setPointer(e.clientX, e.clientY);
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        hovering = true;
      } else setPointer(e.clientX, e.clientY);
    };
    const onLeave = () => {
      hovering = false;
      lastInteraction = performance.now();
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      if (!hovering) {
        setPointer(t.clientX, t.clientY);
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        hovering = true;
      } else setPointer(t.clientX, t.clientY);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave);
    cleanups.push(() => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !disposed) raf = requestAnimationFrame(render);
    });
    io.observe(canvas);
    cleanups.push(() => io.disconnect());

    let baseTex: WebGLTexture, revealTex: WebGLTexture, stylizeFlag = 0;

    function render(now: number) {
      if (disposed) return;
      let paint = hovering ? 1 : 0;

      // Idle hint: after 2s without interaction, sweep a sine-wave stroke across the image
      if (!hovering && now - lastInteraction > 2000) {
        const starting = hintStart < 0;
        if (starting) hintStart = now;
        const t = (now - hintStart) / 1800;
        if (t <= 1) {
          mouse.x = 0.15 + t * 0.7;
          mouse.y = 0.55 + Math.sin(t * Math.PI * 3) * 0.15;
          if (starting) {
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;
          }
          paint = 1;
        } else if (t > 4) {
          hintStart = -1;
          lastInteraction = now;
        }
      }

      gl!.bindFramebuffer(gl!.FRAMEBUFFER, cur.fbo);
      gl!.viewport(0, 0, Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
      gl!.useProgram(paintProg);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, prev.texture);
      gl!.uniform1i(gl!.getUniformLocation(paintProg, "u_prev"), 0);
      gl!.uniform2f(gl!.getUniformLocation(paintProg, "u_mouse"), mouse.x, mouse.y);
      gl!.uniform2f(gl!.getUniformLocation(paintProg, "u_lastMouse"), lastMouse.x, lastMouse.y);
      gl!.uniform1f(gl!.getUniformLocation(paintProg, "u_radius"), brushSize);
      gl!.uniform1f(gl!.getUniformLocation(paintProg, "u_hover"), paint);
      gl!.uniform1f(gl!.getUniformLocation(paintProg, "u_fade"), fadeSpeed);
      gl!.uniform1f(gl!.getUniformLocation(paintProg, "u_aspect"), canvas.height / canvas.width);
      drawQuad(paintProg);
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.useProgram(compProg);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, baseTex);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, revealTex);
      gl!.activeTexture(gl!.TEXTURE2);
      gl!.bindTexture(gl!.TEXTURE_2D, cur.texture);
      gl!.uniform1i(gl!.getUniformLocation(compProg, "u_base"), 0);
      gl!.uniform1i(gl!.getUniformLocation(compProg, "u_reveal"), 1);
      gl!.uniform1i(gl!.getUniformLocation(compProg, "u_mask"), 2);
      gl!.uniform1f(gl!.getUniformLocation(compProg, "u_stylize"), stylizeFlag);
      drawQuad(compProg);

      [cur, prev] = [prev, cur];
      if (visible) raf = requestAnimationFrame(render);
    }

    (async () => {
      const base = await loadImage(baseSrc);
      const reveal = await loadImage(revealSrc).catch(() => null);
      if (disposed) return;
      baseTex = texFrom(base);
      revealTex = reveal ? texFrom(reveal) : baseTex;
      stylizeFlag = reveal ? 0 : 1;
      resize();
      raf = requestAnimationFrame(render);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [baseSrc, revealSrc, brushSize, fadeSpeed]);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Plain image underneath: shows instantly and is the fallback if WebGL is unavailable */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={baseSrc} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair touch-pan-y" />
    </div>
  );
}
