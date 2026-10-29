import React, { useState } from 'react';
import { 
  Network, 
  Send, 
  ShieldAlert, 
  Bot, 
  Share2, 
  Play, 
  Sparkles
} from 'lucide-react';
import type { SecurityFinding } from '../../shared/domain/security';

interface DockPanelProps {
  findings: SecurityFinding[];
  ollamaStatus: { ok: boolean; model: string; message?: string };
  onRunAiDiagnosis: () => void;
  aiDiagnosis: string | null;
  isAiLoading: boolean;
}

export const DockPanel: React.FC<DockPanelProps> = ({
  findings,
  ollamaStatus,
  onRunAiDiagnosis,
  aiDiagnosis,
  isAiLoading
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'apiClient' | 'security' | 'ai' | 'graph'>('network');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/api/v2/checkout');
  const [apiBody, setApiBody] = useState('{\n  "productId": "m4-pro-01",\n  "quantity": 1,\n  "coupon": "DEV2026"\n}');
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleSendApi = () => {
    setApiResponse(JSON.stringify({
      status: 200,
      ok: true,
      data: {
        orderId: 'ord_9942a1b8',
        amount: 1499.00,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    }, null, 2));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '340px',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      zIndex: 10
    }}>
      {/* Dock Tabs Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 8px',
        height: '34px',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('network')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: activeTab === 'network' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'network' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'network' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Network size={14} />
          Network Inspector
          <span style={{ fontSize: '10px', background: 'var(--bg-surface)', padding: '1px 5px', borderRadius: '4px' }}>
            CDP Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('apiClient')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: activeTab === 'apiClient' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'apiClient' ? 'var(--accent-indigo)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'apiClient' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Send size={14} />
          API Client & Env
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: activeTab === 'security' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'security' ? 'var(--accent-amber)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'security' ? '2px solid var(--accent-amber)' : '2px solid transparent',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <ShieldAlert size={14} />
          Passive Security
          {findings.length > 0 && (
            <span style={{
              fontSize: '10px',
              background: '#ef4444',
              color: 'white',
              padding: '1px 5px',
              borderRadius: '999px',
              fontWeight: 700
            }}>
              {findings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: activeTab === 'ai' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'ai' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'ai' ? '2px solid var(--accent-emerald)' : '2px solid transparent',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Bot size={14} />
          Local AI Debugger
          <span style={{
            fontSize: '10px',
            background: ollamaStatus.ok ? '#10b98125' : '#ef444425',
            color: ollamaStatus.ok ? '#10b981' : '#ef4444',
            padding: '1px 5px',
            borderRadius: '4px'
          }}>
            {ollamaStatus.ok ? 'Ollama Active' : 'Ollama Offline'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: activeTab === 'graph' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'graph' ? '#38bdf8' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'graph' ? '2px solid #38bdf8' : '2px solid transparent',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Share2 size={14} />
          API Graph
        </button>
      </div>

      {/* Dock Content Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {/* 1. Network Tab */}
        {activeTab === 'network' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '6px 8px' }}>Method</th>
                  <th style={{ padding: '6px 8px' }}>Status</th>
                  <th style={{ padding: '6px 8px' }}>URL</th>
                  <th style={{ padding: '6px 8px' }}>Type</th>
                  <th style={{ padding: '6px 8px' }}>Size</th>
                  <th style={{ padding: '6px 8px' }}>Time</th>
                  <th style={{ padding: '6px 8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '6px 8px', color: '#10b981', fontWeight: 600 }}>POST</td>
                  <td style={{ padding: '6px 8px', color: '#10b981' }}>200 OK</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>/api/v2/checkout</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>fetch / json</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>1.4 KB</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>42 ms</td>
                  <td style={{ padding: '6px 8px' }}>
                    <button
                      onClick={() => setActiveTab('apiClient')}
                      style={{
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--accent-cyan)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Replay in API Client
                    </button>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '6px 8px', color: '#38bdf8', fontWeight: 600 }}>GET</td>
                  <td style={{ padding: '6px 8px', color: '#38bdf8' }}>304</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>/static/js/bundle.js</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>script</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>245 KB</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-muted)' }}>12 ms</td>
                  <td style={{ padding: '6px 8px' }}>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 2. API Client Tab */}
        {activeTab === 'apiClient' && (
          <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value as never)}
                  style={{
                    background: 'var(--bg-primary)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px'
                  }}
                />
                <button
                  onClick={handleSendApi}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--accent-indigo)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 14px',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Play size={13} />
                  Send
                </button>
              </div>

              <textarea
                value={apiBody}
                onChange={(e) => setApiBody(e.target.value)}
                rows={7}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  padding: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-medium)', padding: '8px', overflow: 'auto' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>RESPONSE BODY</div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#38bdf8' }}>
                {apiResponse || '// Click Send to dispatch API request and view response'}
              </pre>
            </div>
          </div>
        )}

        {/* 3. Security Findings Tab */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {findings.map((f) => (
              <div
                key={f.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderLeft: '4px solid #ef4444',
                  borderRadius: '4px',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: '#ef444425',
                      color: '#ef4444',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {f.severity}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {f.title}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [{f.ruleId}]
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.owaspCategory}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {f.description}
                </div>
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-amber)',
                  marginTop: '6px'
                }}>
                  Evidence: {f.evidence.rawSnippet || f.evidence.url}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Local AI Debugger Tab */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active Model: <code style={{ color: 'var(--accent-emerald)' }}>{ollamaStatus.model}</code> (Local Metal Acceleration)
              </div>
              <button
                onClick={onRunAiDiagnosis}
                disabled={isAiLoading || !ollamaStatus.ok}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--accent-emerald)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: isAiLoading ? 'wait' : 'pointer',
                  opacity: ollamaStatus.ok ? 1 : 0.5
                }}
              >
                <Sparkles size={13} />
                {isAiLoading ? 'Analyzing...' : 'Diagnose Active App State'}
              </button>
            </div>

            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              minHeight: '120px',
              whiteSpace: 'pre-wrap'
            }}>
              {aiDiagnosis || `// Local AI ready. All prompts remain 100% on-device (M4 Apple Silicon). Click 'Diagnose Active App State' to analyze active DOM and network traffic.`}
            </div>
          </div>
        )}

        {/* 5. API Dependency Graph Tab */}
        {activeTab === 'graph' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '12px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FRONTEND ROUTE</div>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>/cart</div>
              </div>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>→ CALLS →</span>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '12px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SERVICE ENDPOINT</div>
                <div style={{ fontWeight: 600, color: '#10b981' }}>POST /api/v2/checkout</div>
              </div>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>→ DEPENDS_ON →</span>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '12px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DOWNSTREAM SERVICE</div>
                <div style={{ fontWeight: 600, color: 'var(--accent-indigo)' }}>BillingService:v1</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Provider: <code>InMemoryGraphProvider</code> (MVP) · TigerGraph REST++ Provider integration available in Settings
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
