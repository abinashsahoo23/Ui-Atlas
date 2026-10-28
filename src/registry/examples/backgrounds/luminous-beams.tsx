"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Sun, Compass } from 'lucide-react';
import styles from "./luminous-beams.module.css";

const PALETTES = [
  { id: "gold", name: "Solar Gold", col: [1.0, 0.8, 0.35], bg: "#110901" },
  { id: "cyan", name: "Glacial Cyan", col: [0.25, 0.85, 1.0], bg: "#020f18" },
  { id: "prism", name: "Prismatic Violet", col: [0.85, 0.35, 1.0], bg: "#12031a" },
];

export default function LuminousBeams() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [beamDensity, setBeamDensity] = useState(12);
  const [beamAngle, setBeamAngle] = useState(35);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentPal = PALETTES[paletteIdx];
  const palRef = useRef(currentPal);
  const densityRef = useRef(beamDensity);
  const angleRef = useRef(beamAngle);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    palRef.current = currentPal;
    densityRef.current = beamDensity;
    angleRef.current = beamAngle;
  }, [isPlaying, currentPal, beamDensity, beamAngle]);

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

    // Fragment Shader - Volumetric Raymarched Beams
    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_tint;
      uniform float u_count;
      uniform float u_angle;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        // Rotate uv by angle
        float rad = radians(u_angle + (u_mouse.x - 0.5) * 30.0);
        mat2 rot = mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
        vec2 p = rot * uv;

        float t = u_time * 0.5;
        float beamSum = 0.0;

        int num = int(u_count);
        for (int i = 0; i < 20; i++) {
          if (i >= num) break;
          float fi = float(i);
          float xPos = (fi / float(num) - 0.5) * 2.2;
          xPos += sin(t * 0.4 + fi * 1.5) * 0.25;

          float dist = abs(p.x - xPos);
          float intensity = 0.012 / (dist * dist * 45.0 + 0.02);

          // Fade along beam length with soft noise variation
          float lenFade = smoothstep(1.2, -0.6, p.y + sin(p.x * 3.0 + t) * 0.15);
          beamSum += intensity * lenFade;
        }

        vec3 color = u_tint * beamSum;
        // Atmospheric haze and dust speckle
        float dust = fract(sin(dot(uv + fract(t * 0.05), vec2(12.9898, 78.233))) * 43758.5453);
        color += dust * 0.04 * length(color);

        color *= (1.0 - length(uv) * 0.5);

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
    const tintLoc = gl.getUniformLocation(program, "u_tint");
    const countLoc = gl.getUniformLocation(program, "u_count");
    const angleLoc = gl.getUniformLocation(program, "u_angle");

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

        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, accumulated);
        gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
        gl.uniform3fv(tintLoc, palRef.current.col);
        gl.uniform1f(countLoc, densityRef.current);
        gl.uniform1f(angleLoc, angleRef.current);

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
          <Sun size={14} className={styles.icon} />
          <span className={styles.title}>LUMINOUS BEAMS // VOLUMETRIC LIGHT</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause beams" : "Play beams"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setPaletteIdx((idx) => (idx + 1) % PALETTES.length)}
            aria-label="Cycle beam tint"
          >
            <Compass size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>RAYS</span>
            <input
              type="range"
              min="6"
              max="18"
              step="1"
              value={beamDensity}
              onChange={(e) => setBeamDensity(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Light beam density"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>ANGLE</span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={beamAngle}
              onChange={(e) => setBeamAngle(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Light beam angle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
