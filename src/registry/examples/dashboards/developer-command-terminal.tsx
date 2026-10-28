'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, Play, CornerDownLeft } from 'lucide-react';
import styles from './developer-command-terminal.module.css';

interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

const PRESET_COMMANDS = [
  { cmd: 'atlas status', label: 'Cluster Status' },
  { cmd: 'atlas build --target=wasm', label: 'Compile WASM' },
  { cmd: 'atlas benchmark p99', label: 'Latency Benchmark' },
  { cmd: 'atlas keygen --algo=ed25519', label: 'Generate Keypair' },
];

const DETERMINISTIC_RESPONSES: Record<string, string[]> = {
  'atlas status': [
    '[OK] Gateway node eu-central-1 active (uptime: 99.98%)',
    '[OK] Raft consensus quorum: 5/5 peers synchronized',
    '[OK] Ingestion pipeline throughput: 1.4M msg/s',
  ],
  'atlas build --target=wasm': [
    'Compiling core-runtime-rs v2.4.0 (release)...',
    'Optimizing LLVM bitcode passes [O3 + LTO]...',
    'Wrote target/wasm32-unknown/atlas_kernel.wasm (184.2 KB)',
    '[SUCCESS] WebAssembly binary generated in 420ms',
  ],
  'atlas benchmark p99': [
    'Executing 100,000 synthetic HTTP/3 round-trips...',
    'Median: 0.42 ms | P90: 1.12 ms | P99: 1.84 ms',
    'Zero dropped frames or socket exhaustion detected.',
  ],
  'atlas keygen --algo=ed25519': [
    'Generating 256-bit Edwards-curve Digital Signature Keypair...',
    'Public Key: 0x9f81a74e2b...d4a8',
    '[CAUTION] Private key saved to memory keyring with ephemeral lifetime.',
  ],
};

export function DeveloperCommandTerminal() {
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: '1', type: 'output', text: 'UI Atlas Developer CLI v6.0.0 [Embedded Session]' },
    { id: '2', type: 'output', text: 'Type a command or click a preset below to execute.' },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const executeCommand = (cmdText: string) => {
    const cleanCmd = cmdText.trim();
    if (!cleanCmd) return;

    const newLogs: TerminalLog[] = [
      ...logs,
      { id: `${Date.now()}-in`, type: 'input', text: `$ ${cleanCmd}` },
    ];

    if (cleanCmd.toLowerCase() === 'clear') {
      setLogs([]);
      setInputValue('');
      return;
    }

    const responses = DETERMINISTIC_RESPONSES[cleanCmd] || [
      `Command not found: "${cleanCmd}". Available presets: atlas status, atlas build --target=wasm, atlas benchmark p99, atlas keygen --algo=ed25519, clear`,
    ];

    responses.forEach((resp, i) => {
      newLogs.push({
        id: `${Date.now()}-out-${i}`,
        type: resp.includes('[SUCCESS]') || resp.includes('[OK]') ? 'success' : resp.includes('[CAUTION]') ? 'error' : 'output',
        text: resp,
      });
    });

    setLogs(newLogs);
    setInputValue('');
  };

  const handleCopy = () => {
    const textToCopy = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.terminalContainer}>
      {/* Terminal Titlebar */}
      <div className={styles.titlebar}>
        <div className={styles.windowDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>

        <div className={styles.titleText}>
          <Terminal size={12} />
          <span>atlas-worker-01 ~ zsh</span>
        </div>

        <div className={styles.titleActions} data-preview-chrome>
          <button
            onClick={handleCopy}
            className={styles.iconBtn}
            title="Copy Terminal Logs"
            aria-label="Copy terminal log contents"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <button
            onClick={() => setLogs([])}
            className={styles.iconBtn}
            title="Clear Terminal"
            aria-label="Clear terminal logs"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Output Console Buffer */}
      <div className={styles.outputBuffer} tabIndex={0} aria-label="Terminal output stream">
        {logs.map((log) => (
          <div key={log.id} className={`${styles.logLine} ${styles[log.type]}`}>
            {log.text}
          </div>
        ))}
      </div>

      {/* Active Command Input Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(inputValue);
        }}
        className={styles.promptLine} data-preview-chrome
      >
        <span className={styles.promptSymbol}>$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type command or choose preset below..."
          className={styles.cmdInput}
          spellCheck={false}
        />
        <button type="submit" className={styles.enterBtn} aria-label="Submit command">
          <CornerDownLeft size={13} />
        </button>
      </form>

      {/* Preset Command Shortcuts */}
      <div className={styles.presetBar} data-preview-chrome>
        <span className={styles.presetLabel}>Presets:</span>
        {PRESET_COMMANDS.map((item) => (
          <button
            key={item.cmd}
            onClick={() => executeCommand(item.cmd)}
            className={styles.presetChip}
          >
            <Play size={10} />
            <span>{item.cmd}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
