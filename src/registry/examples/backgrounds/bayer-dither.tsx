"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Layers, Sliders } from 'lucide-react';
import styles from "./bayer-dither.module.css";

const PALETTES = [
  { id: "monochrome", name: "1-Bit Mac", dark: [0.05, 0.05, 0.08], light: [0.92, 0.94, 0.96], bg: "#0d0e12" },
  { id: "gameboy", name: "Classic Phosphor", dark: [0.08, 0.18, 0.08], light: [0.61, 0.73, 0.22], bg: "#142111" },
  { id: "cyberpunk", name: "Neo Tokyo", dark: [0.08, 0.02, 0.15], light: [0.95, 0.15, 0.65], bg: "#160424" },
];

export default function BayerDither() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [pixelScale, setPixelScale] = useState(3.0);
  const [threshold, setThreshold] = useState(0.5);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentPal = PALETTES[paletteIdx];
  const palRef = useRef(currentPal);
  const scaleRef = useRef(pixelScale);
  const thresholdRef = useRef(threshold);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    palRef.current = currentPal;
    scaleRef.current = pixelScale;
    thresholdRef.current = threshold;
  }, [isPlaying, currentPal, pixelScale, threshold]);

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

    // Fragment Shader - 8x8 Bayer Matrix Procedural Dither
    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_dark;
      uniform vec3 u_light;
      uniform float u_scale;
      uniform float u_threshold;

      // 8x8 Bayer matrix values normalized (0..63)/64
      float bayer8(vec2 p) {
        int x = int(mod(p.x, 8.0));
        int y = int(mod(p.y, 8.0));
        
        // Compact 4x4 recursive bayer reconstructed
        int m[64] = int[64](
           0, 32,  8, 40,  2, 34, 10, 42,
          48, 16, 56, 24, 50, 18, 58, 26,
          12, 44,  4, 36, 14, 46,  6, 38,
          60, 28, 52, 20, 62, 30, 54, 22,
           3, 35, 11, 43,  1, 33,  9, 41,
          51, 19, 59, 27, 49, 17, 57, 25,
          15, 47,  7, 39, 13, 45,  5, 37,
          63, 31, 55, 23, 61, 29, 53, 21
        );
        return float(m[y * 8 + x]) / 64.0;
      }

      void main() {
        vec2 rawCoord = gl_FragCoord.xy / u_scale;
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);

        // Procedural plasma wave
        float t = u_time * 0.8;
        vec2 m = (u_mouse - 0.5) * 1.5;
        vec2 p = uv * 3.5 + m;

        float v = sin(p.x * 2.0 + t) + sin(p.y * 2.5 - t * 0.7) + sin((p.x + p.y) * 1.8 + t * 1.2);
        v += cos(length(p) * 4.0 - t * 1.5);
        v = v * 0.25 + 0.5; // normalized 0..1

        // Bias threshold
        v = clamp((v - 0.5) * 1.4 + u_threshold, 0.0, 1.0);

        // Bayer dither comparison
        float dither = bayer8(rawCoord);
        float quantized = step(dither, v);

        vec3 color = mix(u_dark, u_light, quantized);
        fragColor = vec4(color, 1.0);
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
    const darkLoc = gl.getUniformLocation(program, "u_dark");
    const lightLoc = gl.getUniformLocation(program, "u_light");
    const scaleLoc = gl.getUniformLocation(program, "u_scale");
    const threshLoc = gl.getUniformLocation(program, "u_threshold");

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
        accumulated += delta;

        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, accumulated);
        gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
        gl.uniform3fv(darkLoc, palRef.current.dark);
        gl.uniform3fv(lightLoc, palRef.current.light);
        gl.uniform1f(scaleLoc, scaleRef.current);
        gl.uniform1f(threshLoc, thresholdRef.current);

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
          <Layers size={14} className={styles.icon} />
          <span className={styles.title}>BAYER DITHER // 8x8 ORDERED SHADER</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause dither" : "Play dither"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setPaletteIdx((idx) => (idx + 1) % PALETTES.length)}
            aria-label="Cycle dither palette"
          >
            <Sliders size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>SCALE</span>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={pixelScale}
              onChange={(e) => setPixelScale(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Dither pixel scale"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>LEVEL</span>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Luminance threshold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
