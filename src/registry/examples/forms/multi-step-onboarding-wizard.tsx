'use client';

import React, { useState } from 'react';
import { User, Building, Settings, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import styles from './multi-step-onboarding-wizard.module.css';

interface WizardData {
  fullName: string;
  email: string;
  orgName: string;
  clusterRegion: string;
  enableTelemetry: boolean;
  enableEncryption: boolean;
}

export function MultiStepOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<WizardData>({
    fullName: 'Elena Rostova',
    email: 'elena@atlas-research.io',
    orgName: 'Atlas Quantum Systems',
    clusterRegion: 'eu-west-1 (Frankfurt)',
    enableTelemetry: true,
    enableEncryption: true,
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Full legal name is required.');
        return false;
      }
      if (!formData.email.includes('@')) {
        setErrorMsg('Valid organization email is required.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.orgName.trim()) {
        setErrorMsg('Organization namespace is required.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        setIsCompleted(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const resetWizard = () => {
    setIsCompleted(false);
    setCurrentStep(1);
    setErrorMsg('');
  };

  return (
    <div className={styles.container}>
      {/* Step Stepper Header */}
      <div className={styles.stepperHeader}>
        {[
          { num: 1, label: 'Identity', icon: User },
          { num: 2, label: 'Cluster', icon: Building },
          { num: 3, label: 'Security & Review', icon: Settings },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num || isCompleted;

          return (
            <div
              key={s.num}
              className={`${styles.stepIndicator} ${isActive ? styles.activeStep : ''} ${
                isDone ? styles.doneStep : ''
              }`}
            >
              <div className={styles.iconCircle}>
                {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
              </div>
              <span className={styles.stepText}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Form Content */}
      <div className={styles.cardBody}>
        {isCompleted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <ShieldCheck size={36} />
            </div>
            <h3 className={styles.successTitle}>Onboarding Verified</h3>
            <p className={styles.successText}>
              Organization <strong>{formData.orgName}</strong> is provisioned on cluster{' '}
              <strong>{formData.clusterRegion}</strong> for user <strong>{formData.email}</strong>.
            </p>
            <button onClick={resetWizard} className={styles.resetBtn} data-preview-chrome>
              Run Demo Again
            </button>
          </div>
        ) : (
          <div className={styles.formPanel}>
            {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

            {/* STEP 1: IDENTITY */}
            {currentStep === 1 && (
              <div className={styles.stepGroup}>
                <h4 className={styles.groupTitle}>Operator Identity</h4>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Full Operator Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={styles.inputField}
                    placeholder="e.g. Elena Rostova"
                  />
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Work Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.inputField}
                    placeholder="operator@domain.com"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: CLUSTER */}
            {currentStep === 2 && (
              <div className={styles.stepGroup}>
                <h4 className={styles.groupTitle}>Cluster Architecture</h4>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Organization Namespace</label>
                  <input
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Primary Edge Region</label>
                  <select
                    value={formData.clusterRegion}
                    onChange={(e) => setFormData({ ...formData, clusterRegion: e.target.value })}
                    className={styles.selectField}
                  >
                    <option value="eu-west-1 (Frankfurt)">eu-west-1 (Frankfurt)</option>
                    <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                    <option value="ap-southeast-1 (Singapore)">ap-southeast-1 (Singapore)</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: SECURITY & PREFERENCES */}
            {currentStep === 3 && (
              <div className={styles.stepGroup}>
                <h4 className={styles.groupTitle}>Security Policies & Review</h4>
                <div className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    id="chk-enc"
                    checked={formData.enableEncryption}
                    onChange={(e) => setFormData({ ...formData, enableEncryption: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <label htmlFor="chk-enc" className={styles.checkboxLabel}>
                    Enforce hardware AES-256 end-to-end memory isolation
                  </label>
                </div>
                <div className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    id="chk-tel"
                    checked={formData.enableTelemetry}
                    onChange={(e) => setFormData({ ...formData, enableTelemetry: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <label htmlFor="chk-tel" className={styles.checkboxLabel}>
                    Stream anonymous zero-trust telemetry for error profiling
                  </label>
                </div>

                {/* Review Snapshot */}
                <div className={styles.reviewBox}>
                  <span className={styles.reviewHeader}>Summary Snapshot:</span>
                  <div>• Operator: {formData.fullName} ({formData.email})</div>
                  <div>• Org: {formData.orgName}</div>
                  <div>• Region: {formData.clusterRegion}</div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={styles.navRow}>
              {currentStep > 1 && (
                <button onClick={handleBack} className={styles.backBtn}>
                  <ArrowLeft size={13} />
                  <span>Previous</span>
                </button>
              )}
              <button onClick={handleNext} className={styles.continueBtn}>
                <span>{currentStep === 3 ? 'Confirm & Deploy' : 'Continue'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
