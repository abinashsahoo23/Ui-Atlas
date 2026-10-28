"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Palette } from 'lucide-react';
import styles from "./threads-field.module.css";

const PALETTES = {
  emerald: { bg: "#03130d", line: [0.1, 0.9, 0.5] as [number, number, number], name: "Emerald Cyber" },
  electric: { bg: "#040b1e", line: [0.2, 0.5, 1.0] as [number, number, number], name: "Electric Blue" },
  amethyst: { bg: "#13051e", line: [0.8, 0.2, 0.9] as [number, number, number], name: "Amethyst Warp" },
};

export default function ThreadsField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paletteKey, setPaletteKey] = useState<keyof typeof PALETTES>("emerald");
  const [amplitude, setAmplitude] = useState(1.2);
  const [interactive, setInteractive] = useState(true);

  // References for render loop
  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const paletteRef = useRef(PALETTES[paletteKey]);
  const amplitudeRef = useRef(amplitude);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    paletteRef.current = PALETTES[paletteKey];
    amplitudeRef.current = amplitude;
  }, [isPlaying, paletteKey, amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // Vertex Shader
    const vsSource = `#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Procedural flowing harmonic threads
    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_color;
      uniform float u_amplitude;

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

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        // Interactive mouse influence
        vec2 mouseOffset = (u_mouse - 0.5) * 0.4;
        uv += mouseOffset * (1.0 - length(uv));

        float t = u_time * 0.6;
        float lineSum = 0.0;

        // Render multiple sine threads with noise offsets
        for (int i = 0; i < 9; i++) {
          float fi = float(i);
          float offset = fi * 0.22;
          float wave = sin(uv.x * (3.5 + fi * 0.5) + t + offset) * (0.18 * u_amplitude);
          wave += cos(uv.x * 2.1 - t * 0.8 + offset) * (0.08 * u_amplitude);
          
          float n = noise(vec2(uv.x * 2.0 + t * 0.2, fi)) * 0.15;
          wave += n;

          float dist = abs(uv.y - wave);
          float thickness = 0.003 + 0.002 * sin(uv.x * 4.0 + t);
          lineSum += thickness / (dist * dist * 35.0 + 0.005);
        }

        vec3 col = u_color * lineSum;
        // Subtle ambient vignette
        col *= (1.1 - length(uv) * 0.6);
        fragColor = vec4(col, 1.0);
      }
    `;

    // Compile helper
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
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
    const colorLoc = gl.getUniformLocation(program, "u_color");
    const ampLoc = gl.getUniformLocation(program, "u_amplitude");

    // Fullscreen quad
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

    const startTime = performance.now();
    let elapsedPaused = 0;
    let lastTime = startTime;

    // Intersection observer for power saving
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const render = (time: number) => {
      if (isVisible && isPlayingRef.current) {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;
        elapsedPaused += delta;

        // Smooth mouse lerp
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, elapsedPaused);
        gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
        gl.uniform3f(
          colorLoc,
          paletteRef.current.line[0],
          paletteRef.current.line[1],
          paletteRef.current.line[2]
        );
        gl.uniform1f(ampLoc, amplitudeRef.current);

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
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ backgroundColor: PALETTES[paletteKey].bg }}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Overlay UI & Controls */}
      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <span className={styles.glowDot} />
          <span className={styles.title}>THREADS // HARMONIC WAVE FIELD</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              const keys = Object.keys(PALETTES) as (keyof typeof PALETTES)[];
              const nextIndex = (keys.indexOf(paletteKey) + 1) % keys.length;
              setPaletteKey(keys[nextIndex]);
            }}
            aria-label="Cycle color palette"
          >
            <Palette size={14} />
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            data-active={interactive}
            onClick={() => setInteractive((i) => !i)}
            aria-label="Toggle cursor interactivity"
          >
            <RefreshCw size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>AMP</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Thread wave amplitude"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
