"use client";

import { useRef, useState } from "react";
import { Sliders, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./stepper-slider-control.module.css";

const STEPS = [
  { value: 1, label: "DEV", name: "Local Sandbox" },
  { value: 2, label: "TEST", name: "Automated Suite" },
  { value: 3, label: "STAGING", name: "Canary Fleet" },
  { value: 4, label: "PROD", name: "Global Edge" },
];

export default function StepperSliderControl() {
  const [currentStep, setCurrentStep] = useState(2);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const stepCount = STEPS.length;
  const progressRatio = (currentStep - 1) / (stepCount - 1);
  const progressPercent = progressRatio * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const nearestStep = Math.round(ratio * (stepCount - 1)) + 1;
    setCurrentStep(nearestStep);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setCurrentStep((prev) => Math.min(stepCount, prev + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const activeStepData = STEPS[currentStep - 1];

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.controlCard}>
          <div className={styles.cardHeader}>
            <div>
              <h4 className={styles.stepTitle}>{activeStepData.name}</h4>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Target deployment stage
              </span>
            </div>
            <span className={styles.stepValBadge}>
              STAGE 0{currentStep} // {activeStepData.label}
            </span>
          </div>

          <div
            ref={trackRef}
            className={styles.sliderTrackWrapper}
            onClick={handleTrackClick}
            role="slider"
            aria-valuemin={1}
            aria-valuemax={stepCount}
            aria-valuenow={currentStep}
            aria-valuetext={activeStepData.name}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.trackRail} />
            <div
              className={styles.trackFill}
              style={{ width: `${progressPercent}%` }}
            />

            {STEPS.map((step, idx) => {
              const tickRatio = idx / (stepCount - 1);
              const isPastOrCurrent = step.value <= currentStep;
              return (
                <div
                  key={step.value}
                  className={`${styles.tickPoint} ${isPastOrCurrent ? styles.tickActive : ""}`}
                  style={{ left: `${tickRatio * 100}%` }}
                />
              );
            })}

            <div
              className={styles.sliderThumb}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className={styles.stepLabels}>
            {STEPS.map((step) => {
              const isCurrent = step.value === currentStep;
              return (
                <span
                  key={step.value}
                  className={`${styles.stepLabelItem} ${isCurrent ? styles.stepLabelActive : ""}`}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sliders size={12} aria-hidden="true" />
          <span>Elastic Snapping Milestone Track</span>
        </div>
        <h3 className={styles.title}>Stepper Slider Control</h3>
        <p className={styles.description}>
          Stepped milestone control with elastic snapping feedback, fill progress illumination, and keyboard arrow controls.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Step navigation">
          <button
            type="button"
            className={styles.btn}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            aria-label="Previous step"
          >
            <ChevronLeft size={13} aria-hidden="true" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setCurrentStep((prev) => Math.min(stepCount, prev + 1))}
            disabled={currentStep === stepCount}
            aria-label="Next step"
          >
            <span>Next</span>
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
