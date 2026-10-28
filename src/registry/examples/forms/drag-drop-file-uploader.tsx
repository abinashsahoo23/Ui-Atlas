'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, RefreshCw } from 'lucide-react';
import styles from './drag-drop-file-uploader.module.css';

interface MockUploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
}

const INITIAL_FILES: MockUploadedFile[] = [
  {
    id: 'f-1',
    name: 'atlas-cryptographic-manifest.json',
    size: '142 KB',
    type: 'JSON',
    progress: 100,
  },
  {
    id: 'f-2',
    name: 'neural-weights-checkpoint.safetensors',
    size: '4.8 MB',
    type: 'BIN',
    progress: 82,
  },
];

export function DragDropFileUploader() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<MockUploadedFile[]>(INITIAL_FILES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const addedFiles: MockUploadedFile[] = Array.from(e.dataTransfer.files).map((f) => ({
        id: `f-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        progress: 100,
      }));
      setFiles((prev) => [...addedFiles, ...prev]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const addedFiles: MockUploadedFile[] = Array.from(e.target.files).map((f) => ({
        id: `f-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        progress: 100,
      }));
      setFiles((prev) => [...addedFiles, ...prev]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const resetSample = () => {
    setFiles(INITIAL_FILES);
  };

  return (
    <div className={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className={styles.hiddenInput}
        aria-hidden="true"
      />

      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <UploadCloud size={13} />
          <span>Local Memory Uploader</span>
        </div>
        <button
          onClick={resetSample}
          className={styles.resetBtn} data-preview-chrome
          title="Reset files"
          aria-label="Reset file list"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Drag & Drop Target Area */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.draggingActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload file drop area. Click or drop files here."
      >
        <div className={styles.dropContent}>
          <div className={styles.cloudIconContainer}>
            <UploadCloud size={28} className={styles.cloudIcon} />
          </div>
          <h4 className={styles.dropTitle}>
            {isDragging ? 'Release to queue files' : 'Drop artifacts here or browse filesystem'}
          </h4>
          <p className={styles.dropHint}>Supports .json, .wasm, .ts, .safetensors up to 50MB</p>
        </div>
      </div>

      {/* Selected File Queue List */}
      <div className={styles.fileList}>
        <span className={styles.listHeader}>Queued Artifacts ({files.length})</span>

        {files.length === 0 ? (
          <div className={styles.emptyNotice}>No files queued for staging.</div>
        ) : (
          files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.itemLeft}>
                <div className={styles.typeBadge}>{file.type}</div>
                <div className={styles.fileMeta}>
                  <div className={styles.fileName}>
                    <FileText size={12} className={styles.fileIcon} />
                    <span>{file.name}</span>
                  </div>
                  <span className={styles.fileSize}>{file.size}</span>
                </div>
              </div>

              <div className={styles.itemRight}>
                {file.progress === 100 ? (
                  <span className={styles.statusDone}>
                    <CheckCircle2 size={14} /> Ready
                  </span>
                ) : (
                  <span className={styles.statusProgress}>{file.progress}%</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className={styles.removeBtn}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
