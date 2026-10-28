"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Shield, Eye } from 'lucide-react';
import styles from "./dark-veil-ambient.module.css";

const PALETTES = [
  { id: "obsidian", name: "Obsidian Smoke", col: [0.35, 0.4, 0.5], bg: "#030406" },
  { id: "crimson", name: "Blood Silk", col: [0.65, 0.15, 0.2], bg: "#0d0204" },
  { id: "aurora", name: "Boreal Night", col: [0.15, 0.55, 0.45], bg: "#020908" },
];

export default function DarkVeilAmbient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [veilDensity, setVeilDensity] = useState(1.2);
  const [warpSpeed, setWarpSpeed] = useState(0.8);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentPal = PALETTES[paletteIdx];
  const palRef = useRef(currentPal);
  const densityRef = useRef(veilDensity);
  const speedRef = useRef(warpSpeed);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    palRef.current = currentPal;
    densityRef.current = veilDensity;
    speedRef.current = warpSpeed;
  }, [isPlaying, currentPal, veilDensity, warpSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const vsSource = `#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Soft undulating dark cloth / veil folds
    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_tint;
      uniform float u_density;

      // Smooth fractal noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.0 + vec2(100.0);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        vec2 m = (u_mouse - 0.5) * 0.4;
        vec2 p = uv + m * 0.5;

        float t = u_time * 0.4;
        
        // Layered warping coordinates simulating folded silk fabric
        vec2 q = vec2(fbm(p + t * 0.2), fbm(p + vec2(5.2, 1.3) - t * 0.15));
        vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15), fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.2));

        float f = fbm(p + 4.0 * r);

        // Enhance folds and high-contrast ridges
        float folds = pow(f, 2.4 * u_density);
        float rim = pow(1.0 - length(uv) * 0.6, 2.0);

        vec3 col = mix(vec3(0.015, 0.018, 0.025), u_tint, folds);
        col += pow(r.x, 3.0) * u_tint * 0.7;
        col *= rim;

        fragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const posLoc = gl.getAttribLocation(program, "position");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const tintLoc = gl.getUniformLocation(program, "u_tint");
    const denseLoc = gl.getUniformLocation(program, "u_density");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    let accumulated = 0;
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const render = (time: number) => {
      if (isVisible && isPlayingRef.current) {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;
        accumulated += delta * speedRef.current;

        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, accumulated);
        gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
        gl.uniform3fv(tintLoc, palRef.current.col);
        gl.uniform1f(denseLoc, densityRef.current);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        lastTime = time;
      }
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
    mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ backgroundColor: currentPal.bg }}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <Shield size={14} className={styles.icon} />
          <span className={styles.title}>DARK VEIL // AMBIENT DRAPERY</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause veil" : "Play veil"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setPaletteIdx((idx) => (idx + 1) % PALETTES.length)}
            aria-label="Cycle veil tint"
          >
            <Eye size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>FOLDS</span>
            <input
              type="range"
              min="0.6"
              max="2.0"
              step="0.1"
              value={veilDensity}
              onChange={(e) => setVeilDensity(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Veil fold density"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>SPEED</span>
            <input
              type="range"
              min="0.3"
              max="1.8"
              step="0.1"
              value={warpSpeed}
              onChange={(e) => setWarpSpeed(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Veil animation speed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
