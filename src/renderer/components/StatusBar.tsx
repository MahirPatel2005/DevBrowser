import React from 'react';
import { Cpu, Flame, HardDrive, ShieldCheck, Volume2 } from 'lucide-react';
import type { HardwareMetrics } from '../../shared/ipc-channels';

interface StatusBarProps {
  metrics: HardwareMetrics | null;
  ollamaStatus: { ok: boolean; model: string; message?: string };
  onNuclearShred: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  metrics,
  ollamaStatus,
  onNuclearShred
}) => {
  const formatBytes = (bytes: number): string => {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatMb = (bytes: number): string => {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '24px',
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '0 10px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)'
    }}>
      {/* Left Telemetry: Hardware & Memory */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span>MacBook Air M4 (arm64)</span>
        </div>

        {metrics && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HardDrive size={12} style={{ color: '#a855f7' }} />
            <span>
              RAM: {formatBytes(metrics.totalUnifiedMemoryBytes - metrics.freeUnifiedMemoryBytes)} / {formatBytes(metrics.totalUnifiedMemoryBytes)} Unified
            </span>
            <span style={{ color: 'var(--accent-emerald)' }}>
              (App RSS: {formatMb(metrics.appMemoryUsageBytes)})
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Volume2 size={12} style={{ color: 'var(--accent-indigo)' }} />
          <span>Voice: Wispr Flow Ready</span>
        </div>
      </div>

      {/* Right Controls: AI status & Nuclear Shred */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: ollamaStatus.ok ? '#10b981' : '#ef4444'
          }} />
          <span style={{ color: ollamaStatus.ok ? 'var(--text-secondary)' : '#ef4444' }}>
            Ollama: {ollamaStatus.ok ? ollamaStatus.model : 'Offline'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} style={{ color: '#10b981' }} />
          <span>Keychain Encrypted</span>
        </div>

        <button
          onClick={onNuclearShred}
          title="Permanently purge SQLite, Keychain credentials, and session caches"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '3px'
          }}
          className="transition-smooth hover:bg-red-950"
        >
          <Flame size={12} />
          Nuclear Shred
        </button>
      </div>
    </footer>
  );
};
