import React, { useState } from 'react';
import { 
  Shield, 
  Bot, 
  Share2, 
  Database, 
  Flame, 
  Key, 
  Volume2, 
  RefreshCw,
  Cloud,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const telemetryEnabled = useAppStore(s => s.telemetryEnabled);
  const historyAutoPurgeDays = useAppStore(s => s.historyAutoPurgeDays);
  const ollamaHost = useAppStore(s => s.ollamaHost);
  const selectedAiModel = useAppStore(s => s.selectedAiModel);
  const tigerGraphEndpoint = useAppStore(s => s.tigerGraphEndpoint);
  const tigerGraphSecret = useAppStore(s => s.tigerGraphSecret);
  const tigerGraphStatus = useAppStore(s => s.tigerGraphStatus);
  const tigerGraphName = useAppStore(s => s.tigerGraphName);
  const tigerGraphProviderType = useAppStore(s => s.tigerGraphProviderType);
  const tigerGraphMode = useAppStore(s => s.tigerGraphMode);
  const setSetting = useAppStore(s => s.setSetting);
  const triggerNuclearShred = useAppStore(s => s.triggerNuclearShred);
  const checkOllama = useAppStore(s => s.checkOllama);
  const ollamaStatus = useAppStore(s => s.ollamaStatus);
  const addToast = useAppStore(s => s.addToast);

  const [activeTab, setActiveTab] = useState<'privacy' | 'ai' | 'integrations' | 'storage'>('privacy');
  const [isTestingOllama, setIsTestingOllama] = useState(false);
  const [isTestingTigerGraph, setIsTestingTigerGraph] = useState(false);

  const handleTestOllama = async () => {
    setIsTestingOllama(true);
    await checkOllama();
    setIsTestingOllama(false);
    addToast({
      type: ollamaStatus.ok ? 'success' : 'warning',
      title: 'Ollama Connection Test',
      message: ollamaStatus.message || (ollamaStatus.ok ? 'Ollama daemon responsive' : 'Connection failed')
    });
  };

  const handleTestTigerGraph = async () => {
    setIsTestingTigerGraph(true);
    try {
      if (window.devBrowserAPI?.system) {
        const res = await window.devBrowserAPI.system.checkTigerGraphStatus({
          endpoint: tigerGraphEndpoint,
          secret: tigerGraphSecret,
          graphName: tigerGraphName
        });
        setIsTestingTigerGraph(false);
        setSetting('tigerGraphStatus', res.ok ? 'connected' : 'disconnected');
        addToast({
          type: res.ok ? 'success' : 'warning',
          title: res.ok ? 'TigerGraph Connected' : 'TigerGraph Connection Notice',
          message: res.message
        });
        return;
      }
    } catch (err) {
      console.error('[TigerGraph] Health check error:', err);
    }

    setIsTestingTigerGraph(false);
    setSetting('tigerGraphStatus', 'disconnected');
    addToast({
      type: 'warning',
      title: 'TigerGraph Connection Notice',
      message: 'Endpoint unreachable. Using local In-Memory Graph Provider fallback.'
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Settings Navigation Sidebar */}
      <div style={{
        width: '210px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', padding: '0 8px', marginBottom: '6px' }}>
          SETTINGS
        </div>

        {[
          { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={16} /> },
          { id: 'ai', label: 'Local AI (Ollama)', icon: <Bot size={16} /> },
          { id: 'integrations', label: 'Integrations', icon: <Share2 size={16} /> },
          { id: 'storage', label: 'Storage & Shred', icon: <Database size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as never)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg-active)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            className="transition-smooth hover:bg-slate-800"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Settings Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Privacy Tab */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Privacy Controls & Data Retention
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Dev Browser is strictly local-first. We collect zero analytics and route zero traffic through remote proxy servers.
                </p>
              </div>

              {/* Zero Telemetry Toggle */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Anonymous Diagnostic Telemetry
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Strict Default: Disabled. When disabled, zero network packets leave the machine.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={telemetryEnabled}
                  onChange={e => setSetting('telemetryEnabled', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Keychain SafeStorage Status */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Key size={18} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Hardware-Backed Keychain Encryption
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Leverages macOS Keychain via Electron <code>safeStorage</code> API. Secrets are encrypted at rest.
                    </div>
                  </div>
                </div>

                <Badge label="Active (macOS Keychain)" variant="success" />
              </div>

              {/* Auto Purge Slider */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Automatic History & Network Purge Retention
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {historyAutoPurgeDays} Days
                  </span>
                </div>

                <input
                  type="range"
                  min={7}
                  max={90}
                  step={7}
                  value={historyAutoPurgeDays}
                  onChange={e => setSetting('historyAutoPurgeDays', parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>7 Days (Minimal Storage)</span>
                  <span>30 Days (Recommended)</span>
                  <span>90 Days (Extended Audit)</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. AI Model Tab */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Local AI Inference Engine (Ollama)
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Inference executes locally on your MacBook Air M4 using unified memory and Metal GPU acceleration.
                </p>
              </div>

              {/* Ollama Host & Ping */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Ollama Daemon Host URL
                  </label>
                  <button
                    onClick={handleTestOllama}
                    disabled={isTestingOllama}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      borderRadius: '5px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: isTestingOllama ? 'wait' : 'pointer'
                    }}
                  >
                    <RefreshCw size={12} className={isTestingOllama ? 'animate-spin' : ''} />
                    Test Connection
                  </button>
                </div>

                <input
                  type="text"
                  value={ollamaHost}
                  onChange={e => setSetting('ollamaHost', e.target.value)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <Badge
                    label={ollamaStatus.ok ? `Connected (${ollamaStatus.model})` : 'Daemon Offline'}
                    variant={ollamaStatus.ok ? 'success' : 'danger'}
                  />
                </div>
              </div>

              {/* Model Selection */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Active Quantized Coding Model
                </label>

                <select
                  value={selectedAiModel}
                  onChange={e => setSetting('selectedAiModel', e.target.value)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px'
                  }}
                >
                  <option value="qwen2.5-coder:7b">qwen2.5-coder:7b (Recommended · 4.7 GB VRAM · ~38 tok/s on M4)</option>
                  <option value="llama3.2:3b">llama3.2:3b (Lightweight · 2.0 GB VRAM · Low Battery Mode)</option>
                </select>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Configured with dynamic eviction (<code>keep_alive: "5m"</code>). Automatically unloads weights from unified RAM after 5 minutes of inactivity to keep your Mac fast.
                </div>
              </div>
            </div>
          )}

          {/* 3. Integrations Tab */}
          {activeTab === 'integrations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  External Provider Integrations
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Decoupled provider integrations for API dependency graphing and voice dictation.
                </p>
              </div>

              {/* TigerGraph & TGCloud Card */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={18} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      TigerGraph & TGCloud Integration
                    </span>
                  </div>

                  <Badge
                    label={tigerGraphStatus === 'connected' ? 'Connected' : 'Disconnected (In-Memory Fallback)'}
                    variant={tigerGraphStatus === 'connected' ? 'success' : 'warning'}
                  />
                </div>

                {/* Provider Preset Selector */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSetting('tigerGraphProviderType', 'tgcloud');
                      if (tigerGraphEndpoint.includes('127.0.0.1') || !tigerGraphEndpoint) {
                        setSetting('tigerGraphEndpoint', 'https://my-subdomain.i.tgcloud.io');
                      }
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${tigerGraphProviderType === 'tgcloud' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                      background: tigerGraphProviderType === 'tgcloud' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-surface)',
                      color: tigerGraphProviderType === 'tgcloud' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Cloud size={14} />
                    TigerGraph Cloud (tgcloud.io)
                  </button>

                  <button
                    onClick={() => {
                      setSetting('tigerGraphProviderType', 'local');
                      if (tigerGraphEndpoint.includes('tgcloud.io') || !tigerGraphEndpoint) {
                        setSetting('tigerGraphEndpoint', 'http://127.0.0.1:9000');
                      }
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${tigerGraphProviderType === 'local' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                      background: tigerGraphProviderType === 'local' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-surface)',
                      color: tigerGraphProviderType === 'local' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Database size={14} />
                    Local Docker / Self-Hosted
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {tigerGraphProviderType === 'tgcloud'
                    ? 'TigerGraph Cloud (TGCloud) manages licensing and cluster hosting automatically. Connect via your TGCloud HTTPS subdomain and API token with zero local container RAM overhead.'
                    : 'Connects to a self-hosted TigerGraph instance via port 9000 (REST++) and port 14240 (GraphStudio). Requires a valid license key inside Docker.'}
                </div>

                {/* Configuration Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {tigerGraphProviderType === 'tgcloud' ? 'TGCloud Host URL' : 'REST++ Endpoint URL'}
                    </label>
                    <input
                      type="text"
                      value={tigerGraphEndpoint}
                      onChange={e => setSetting('tigerGraphEndpoint', e.target.value)}
                      placeholder={tigerGraphProviderType === 'tgcloud' ? 'https://my-subdomain.i.tgcloud.io' : 'http://127.0.0.1:9000'}
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Graph Name
                    </label>
                    <input
                      type="text"
                      value={tigerGraphName}
                      onChange={e => setSetting('tigerGraphName', e.target.value)}
                      placeholder="MyGraph"
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      API Secret / Token
                    </label>
                    <input
                      type="password"
                      value={tigerGraphSecret}
                      onChange={e => setSetting('tigerGraphSecret', e.target.value)}
                      placeholder="Bearer token or secret"
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Strict TigerGraph Mode Toggle */}
                <div style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Strict TigerGraph Only Mode
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Source graph views exclusively from TigerGraph REST++. Disables in-memory simulation fallbacks.
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={tigerGraphMode === 'tigergraph-only'}
                    onChange={e => setSetting('tigerGraphMode', e.target.checked ? 'tigergraph-only' : 'hybrid')}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={handleTestTigerGraph}
                    disabled={isTestingTigerGraph}
                    style={{
                      background: 'var(--accent-cyan)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: isTestingTigerGraph ? 'wait' : 'pointer'
                    }}
                  >
                    {isTestingTigerGraph ? 'Testing Endpoint...' : 'Test TigerGraph Connection'}
                  </button>

                  <a
                    href={tigerGraphEndpoint.includes('tgcloud.io') ? tigerGraphEndpoint : 'http://127.0.0.1:14240'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-secondary)',
                      borderRadius: '5px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={13} />
                    Open GraphStudio Console
                  </a>
                </div>
              </div>

              {/* Wispr Flow Card */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Volume2 size={18} color="var(--accent-indigo)" />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Wispr Flow Voice Dictation Workflow
                    </span>
                  </div>

                  <Badge label="Desktop Dictation Ready" variant="success" />
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>Supported Workflow:</strong> Wispr Flow runs as a system-level assistant on macOS. Focus any input field, code editor, or the Local AI prompt bar, press your Wispr Flow hotkey, and spoken code/assertions will insert directly with auto-punctuation.
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  Direct Voice Interface API mode (WebSocket streaming via <code>wss://platform-api.wisprflow.ai/ws</code>) is available for users with active Wispr Flow developer access keys.
                </div>
              </div>
            </div>
          )}

          {/* 4. Storage & Nuclear Shred Tab */}
          {activeTab === 'storage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Local Storage & Data Destruction
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Manage the local SQLite cache and execute complete cryptographic data purges.
                </p>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Local SQLite Database (devbrowser.db)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Path: <code>~/Library/Application Support/DevBrowser/devbrowser.db</code>
                  </div>
                </div>

                <Badge label="2.4 MB on disk" variant="outline" />
              </div>

              {/* Nuclear Shred Danger Card */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                  <Flame size={20} />
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>Nuclear Shred (Cryptographic Wipe)</span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This action permanently destroys all local SQLite history, purges all container session partitions (cookies, localStorage, IndexedDB), and securely removes all decrypted credentials from the macOS Keychain. This cannot be undone.
                </p>

                <button
                  onClick={() => {
                    if (confirm('CRITICAL: Permanently destroy all local databases, session cookies, and Keychain credentials?')) {
                      triggerNuclearShred();
                    }
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  className="transition-smooth hover:bg-red-700"
                >
                  <Flame size={14} />
                  Execute Nuclear Shred
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
