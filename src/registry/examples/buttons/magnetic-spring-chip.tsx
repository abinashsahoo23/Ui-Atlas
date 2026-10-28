"use client";

import { useRef, useState } from "react";
import { Magnet, Compass, Sparkles, Zap, Flame, Shield } from "lucide-react";
import styles from "./magnetic-spring-chip.module.css";

interface ChipItem {
  id: string;
  label: string;
  icon: typeof Compass;
}

const CHIPS: ChipItem[] = [
  { id: "optics", label: "Optical Physics", icon: Sparkles },
  { id: "neural", label: "Neural Matrix", icon: Zap },
  { id: "fluid", label: "Fluid Dynamics", icon: Compass },
  { id: "thermal", label: "Thermal Dissipation", icon: Flame },
  { id: "quantum", label: "Quantum Shield", icon: Shield },
];

function SingleMagneticChip({
  chip,
  isSelected,
  onToggle,
  strength,
}: {
  chip: ChipItem;
  isSelected: boolean;
  onToggle: () => void;
  strength: number;
}) {
  const pillRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const Icon = chip.icon;

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const pill = pillRef.current;
    if (!pill) return;

    const rect = pill.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    setOffset({
      x: dx * strength,
      y: dy * strength,
    });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={pillRef}
      type="button"
      className={`${styles.magneticPill} ${isSelected ? styles.active : ""}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onToggle}
      aria-pressed={isSelected}
    >
      <Icon size={14} aria-hidden="true" />
      <span>{chip.label}</span>
    </button>
  );
}

export default function MagneticSpringChip() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["optics", "neural"]);
  const [magneticPull, setMagneticPull] = useState<"standard" | "high">("standard");

  const toggleChip = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const pullMultiplier = magneticPull === "high" ? 0.45 : 0.25;

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.chipGrid} role="group" aria-label="Magnetic filter tags">
          {CHIPS.map((chip) => (
            <SingleMagneticChip
              key={chip.id}
              chip={chip}
              isSelected={selectedIds.includes(chip.id)}
              onToggle={() => toggleChip(chip.id)}
              strength={pullMultiplier}
            />
          ))}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Magnet size={12} aria-hidden="true" />
          <span>Gravitational Attraction Spring</span>
        </div>
        <h3 className={styles.title}>Magnetic Spring Chip</h3>
        <p className={styles.description}>
          Container-scoped magnetic pull displacing tactile filter chips toward cursor center with dampened physical spring return.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="radiogroup" aria-label="Magnetic pull strength">
          <button
            type="button"
            className={`${styles.btn} ${magneticPull === "standard" ? styles.active : ""}`}
            onClick={() => setMagneticPull("standard")}
            role="radio"
            aria-checked={magneticPull === "standard"}
          >
            <span>Standard Tension</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${magneticPull === "high" ? styles.active : ""}`}
            onClick={() => setMagneticPull("high")}
            role="radio"
            aria-checked={magneticPull === "high"}
          >
            <Magnet size={13} aria-hidden="true" />
            <span>High Gravity Pull</span>
          </button>
        </div>
      </div>
    </div>
  );
}
