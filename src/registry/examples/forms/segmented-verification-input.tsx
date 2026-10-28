'use client';

import React, { useState, useRef } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import styles from './segmented-verification-input.module.css';

export function SegmentedVerificationInput() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_DEMO_CODE = '724910';

  const handleChange = (index: number, value: string) => {
    // Only accept numeric single character
    const char = value.slice(-1).replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setStatus('idle');
    setFeedback('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify
    if (newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      triggerVerification(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);

    const focusIdx = Math.min(5, pasteData.length);
    inputRefs.current[focusIdx]?.focus();

    if (newDigits.every((d) => d !== '')) {
      triggerVerification(newDigits.join(''));
    }
  };

  const triggerVerification = (code: string) => {
    setStatus('verifying');
    setFeedback('Authenticating cryptographic challenge...');

    setTimeout(() => {
      if (code === CORRECT_DEMO_CODE) {
        setStatus('success');
        setFeedback('Two-factor challenge approved. Session initialized.');
      } else {
        setStatus('error');
        setFeedback(`Invalid authentication token. Try code ${CORRECT_DEMO_CODE} for demo.`);
      }
    }, 600);
  };

  const handleReset = () => {
    setDigits(['', '', '', '', '', '']);
    setStatus('idle');
    setFeedback('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <KeyRound size={13} />
          <span>Security Token Verification</span>
        </div>
        <button
          onClick={handleReset}
          className={styles.resetBtn} data-preview-chrome
          title="Reset Input"
          aria-label="Reset verification code"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>Enter Security Passcode</h3>
        <p className={styles.subtitle}>
          Enter the 6-digit confirmation token issued to your hardware key or device.
        </p>

        {/* 6 Segmented Cells */}
        <div className={styles.inputGrid} onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`${styles.digitCell} ${
                status === 'error' ? styles.errorCell : status === 'success' ? styles.successCell : ''
              }`}
              aria-label={`Digit ${idx + 1}`}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Demo Preset Helper */}
        <div className={styles.demoHelper}>
          <span>Demo secret: </span>
          <button
            onClick={() => {
              setDigits(CORRECT_DEMO_CODE.split(''));
              triggerVerification(CORRECT_DEMO_CODE);
            }}
            className={styles.autoFillBtn}
          >
            Fill &apos;{CORRECT_DEMO_CODE}&apos;
          </button>
        </div>

        {/* Status Feedback Notification */}
        {feedback && (
          <div
            className={`${styles.statusAlert} ${
              status === 'error'
                ? styles.alertError
                : status === 'success'
                ? styles.alertSuccess
                : styles.alertInfo
            }`}
          >
            {status === 'success' && <CheckCircle2 size={14} />}
            {status === 'error' && <AlertCircle size={14} />}
            <span>{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
