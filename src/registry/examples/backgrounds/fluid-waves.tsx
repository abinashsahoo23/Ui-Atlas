"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Compass, Waves } from "lucide-react";
import styles from "./fluid-waves.module.css";

const THEMES = [
  { id: "ocean", name: "Deep Ocean", col1: [0.05, 0.45, 0.9], col2: [0.0, 0.85, 0.8], bg: "#020c1b" },
  { id: "sunset", name: "Infrared Horizon", col1: [0.95, 0.25, 0.3], col2: [1.0, 0.65, 0.1], bg: "#180406" },
  { id: "monochrome", name: "Onyx Silk", col1: [0.8, 0.85, 0.9], col2: [0.4, 0.45, 0.5], bg: "#0a0a0c" },
];

export default function FluidWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [themeIdx, setThemeIdx] = useState(0);
  const [frequency, setFrequency] = useState(1.4);
  const [speed, setSpeed] = useState(1.0);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentTheme = THEMES[themeIdx];
  const themeRef = useRef(currentTheme);
  const freqRef = useRef(frequency);
  const speedRef = useRef(speed);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    themeRef.current = currentTheme;
    freqRef.current = frequency;
    speedRef.current = speed;
  }, [isPlaying, currentTheme, frequency, speed]);

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

    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_col1;
      uniform vec3 u_col2;
      uniform float u_freq;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        // Fluid distortion influenced by mouse
        vec2 p = uv * 2.0;
        p += (u_mouse - 0.5) * 0.5;

        float t = u_time * 0.7;
        float v = 0.0;

        for (int i = 1; i <= 6; i++) {
          float fi = float(i);
          v += sin(p.x * (fi * 1.2 * u_freq) + t * (0.8 + fi * 0.15) + cos(p.y * fi * 1.5 + t)) * (0.5 / fi);
          p += vec2(sin(p.y + t * 0.3), cos(p.x - t * 0.4)) * 0.35;
        }

        // Ribbon contours
        float ribbon = sin(v * 4.0 + uv.y * 5.0);
        float lineDist = abs(fract(ribbon) - 0.5);
        float lineGlow = 0.04 / (lineDist + 0.03);

        vec3 color = mix(u_col1, u_col2, sin(v + uv.x * 2.0) * 0.5 + 0.5);
        color *= lineGlow;

        // Subtle dark vignette
        color *= 1.0 - length(uv) * 0.45;

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
    const col1Loc = gl.getUniformLocation(program, "u_col1");
    const col2Loc = gl.getUniformLocation(program, "u_col2");
    const freqLoc = gl.getUniformLocation(program, "u_freq");

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

        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, accumulated);
        gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
        gl.uniform3fv(col1Loc, themeRef.current.col1);
        gl.uniform3fv(col2Loc, themeRef.current.col2);
        gl.uniform1f(freqLoc, freqRef.current);

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
      style={{ backgroundColor: currentTheme.bg }}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <Waves size={14} className={styles.icon} />
          <span className={styles.title}>FLUID WAVES // PROCEDURAL RIBBONS</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause waves" : "Play waves"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setThemeIdx((idx) => (idx + 1) % THEMES.length)}
            aria-label="Cycle wave theme"
          >
            <Compass size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>FREQ</span>
            <input
              type="range"
              min="0.6"
              max="2.5"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Wave frequency"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>SPEED</span>
            <input
              type="range"
              min="0.2"
              max="2.2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Wave speed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
