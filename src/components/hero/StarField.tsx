"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
attribute float a_size;
attribute float a_alpha;
varying float v_alpha;
void main() {
  gl_Position = vec4(a_pos.x * 2.0 - 1.0, 1.0 - a_pos.y * 2.0, 0.0, 1.0);
  gl_PointSize = a_size;
  v_alpha = a_alpha;
}`;

const FRAG = `
precision mediump float;
varying float v_alpha;
void main() {
  float dist = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.0, dist) * v_alpha * 1.5;
  float glow  = smoothstep(0.5, 0.0, dist) * v_alpha * 0.4;
  gl_FragColor = vec4(1.0, 0.97, 0.9, alpha + glow);
}`;

type Shooter = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aSize = gl.getAttribLocation(prog, "a_size");
    const aAlpha = gl.getAttribLocation(prog, "a_alpha");
    const stride = 4 * 4;
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 8);
    gl.enableVertexAttribArray(aAlpha);
    gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, stride, 12);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // 300 stars on a stratified grid (evenly spread, jittered) in the upper 60%
    const cols = 25, rows = 12;
    const stars = Array.from({ length: cols * rows }, (_, i) => ({
      x: ((i % cols) + Math.random()) / cols,
      y: ((Math.floor(i / cols) + Math.random()) / rows) * 0.6,
      size: 1 + Math.random() * 2.2,
      base: 0.25 + Math.random() * 0.6,
      speed: 0.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    let shooters: Shooter[] = [];
    let nextSpawn = 1.5;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      const wasVisible = visible;
      visible = e.isIntersecting;
      if (visible && !wasVisible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let time = 0;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        const angle = Math.PI * (0.12 + Math.random() * 0.12);
        shooters.push({
          x: 0.1 + Math.random() * 0.5,
          y: Math.random() * 0.25,
          vx: Math.cos(angle) * 0.8,
          vy: Math.sin(angle) * 0.8,
          life: 0,
          maxLife: 0.7 + Math.random() * 0.5,
          trail: [],
        });
        nextSpawn = 1.5 + Math.random() * 2.5;
      }

      const data: number[] = [];
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
        data.push(s.x, s.y, s.size * dpr, s.base * tw);
      }

      for (const st of shooters) {
        st.life += dt;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        const t = st.life / st.maxLife;
        const headAlpha = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / 0.8);
        st.trail.unshift({ x: st.x, y: st.y, alpha: headAlpha });
        if (st.trail.length > 40) st.trail.pop();
        for (let i = 1; i < st.trail.length; i++) st.trail[i].alpha *= 0.88;
        st.trail.forEach((p, i) => data.push(p.x, p.y, (i === 0 ? 3.5 : 2.4 - i * 0.04) * dpr, p.alpha));
      }
      shooters = shooters.filter((s) => s.life < s.maxLife);

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(data), gl!.DYNAMIC_DRAW);
      gl!.drawArrays(gl!.POINTS, 0, data.length / 4);

      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
