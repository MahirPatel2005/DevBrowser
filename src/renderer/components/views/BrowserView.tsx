import React from 'react';
import { 
  Globe, 
  Sparkles, 
  Network, 
  Layers, 
  ShieldAlert 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../common/Badge';

export const BrowserView: React.FC = () => {
  const currentUrl = useAppStore(s => s.currentUrl);
  const splitLayout = useAppStore(s => s.splitLayout);
  const tabs = useAppStore(s => s.tabs);
  const activeTabId = useAppStore(s => s.activeTabId);
  const partitions = useAppStore(s => s.partitions);
  const setActiveView = useAppStore(s => s.setActiveView);
  const sendAiPrompt = useAppStore(s => s.sendAiPrompt);
  const addToast = useAppStore(s => s.addToast);

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activePartition = partitions.find(p => p.id === activeTab?.partitionId);

  const handleQuickAiAudit = () => {
    setActiveView('ai');
    sendAiPrompt(`Audit the security headers and network calls currently active on ${currentUrl}`);
    addToast({
      type: 'info',
      title: 'AI Analysis Initiated',
      message: `Analyzing active page: ${currentUrl}`
    });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: splitLayout === 'split-horizontal' ? 'column' : 'row',
      overflow: 'hidden',
      background: 'var(--bg-primary)'
    }}>
      {/* Primary Browser Pane */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
        borderRight: splitLayout === 'split-vertical' ? '1px solid var(--border-medium)' : 'none',
        borderBottom: splitLayout === 'split-horizontal' ? '1px solid var(--border-medium)' : 'none',
        position: 'relative'
      }}>
        {/* Pane Sub-header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Primary Webview Sandbox
            </span>
            {activePartition && (
              <Badge 
                label={activePartition.name} 
                variant="primary" 
                icon={<Layers size={10} />} 
              />
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveView('network')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              className="transition-smooth hover:bg-slate-800"
            >
              <Network size={12} color="var(--accent-cyan)" />
              Inspect Network
            </button>

            <button
              onClick={handleQuickAiAudit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-emerald)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              className="transition-smooth hover:opacity-90"
            >
              <Sparkles size={12} />
              Ask AI to Diagnose
            </button>
          </div>
        </div>

        {/* Viewport Simulation Frame */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '28px 36px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.1)',
              marginBottom: '14px'
            }}>
              <Globe size={28} color="var(--accent-cyan)" />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Connected Developer Sandbox
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Inspecting target application at <code style={{ color: 'var(--accent-cyan)' }}>{currentUrl}</code>. Chrome DevTools Protocol (CDP) session is actively monitoring all network frames, cookies, and DOM mutations.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              textAlign: 'left',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>CDP State: </span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active (100% Fidelity)</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Partition: </span>
                <span style={{ color: activePartition?.color || 'var(--text-primary)', fontWeight: 600 }}>
                  {activePartition?.partitionKey || 'persist:dev'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Passive Audit: </span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>11 Rules Active</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Local AI Bridge: </span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Metal M4 Acceleration</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setActiveView('security')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ShieldAlert size={14} />
                View 3 Security Findings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Split Pane (if active) */}
      {splitLayout !== 'single' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={14} color="var(--accent-indigo)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Secondary Container Role (Split Pane)
              </span>
              <Badge label="Admin Role" variant="danger" />
            </div>
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Side-by-Side Multi-Tenant Testing
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              Test multi-role permissions side-by-side. The secondary pane operates in a completely isolated Electron partition with distinct cookies and local storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
