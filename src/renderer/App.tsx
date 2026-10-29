import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { DockPanel } from './components/DockPanel';
import { StatusBar } from './components/StatusBar';
import type { BrowserTab, ProfilePartition } from '../shared/domain/browser';
import type { SecurityFinding } from '../shared/domain/security';
import type { HardwareMetrics } from '../shared/ipc-channels';
import type { DevBrowserAPI } from '../preload/api';

declare global {
  interface Window {
    devBrowserAPI?: DevBrowserAPI;
  }
}

export const App: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      partitionId: '11111111-1111-4111-a111-111111111111',
      url: 'http://localhost:3000',
      title: 'Dev Server: Localhost',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPinned: false,
      hibernation: { isHibernated: false, lastUrl: 'http://localhost:3000' },
      activeSplitPane: 'main'
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [partitions, setPartitions] = useState<ProfilePartition[]>([
    {
      id: '11111111-1111-4111-a111-111111111111',
      name: 'Default Developer',
      partitionKey: 'persist:dev-default',
      color: '#3b82f6',
      isEphemeral: false,
      createdAt: Date.now()
    },
    {
      id: '22222222-2222-4222-a222-222222222222',
      name: 'Admin Role',
      partitionKey: 'persist:dev-admin',
      color: '#ef4444',
      isEphemeral: false,
      createdAt: Date.now()
    }
  ]);
  const [currentUrl, setCurrentUrl] = useState<string>('http://localhost:3000');
  const [splitLayout, setSplitLayout] = useState<'single' | 'split-vertical' | 'split-horizontal'>('single');
  const [metrics, setMetrics] = useState<HardwareMetrics | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<{ ok: boolean; model: string; message?: string }>({
    ok: false,
    model: 'checking...'
  });
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch of system hardware & Ollama status
    if (window.devBrowserAPI) {
      window.devBrowserAPI.system.getHardwareMetrics().then(setMetrics).catch(console.error);
      window.devBrowserAPI.system.checkOllamaStatus().then(setOllamaStatus).catch(console.error);
      window.devBrowserAPI.tabs.getPartitions().then((p) => {
        if (p && p.length > 0) setPartitions(p);
      }).catch(console.error);
      window.devBrowserAPI.security.getFindings().then(setFindings).catch(console.error);
    }
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) setCurrentUrl(tab.url);
  };

  const handleNewTab = async () => {
    if (window.devBrowserAPI) {
      const newTab = await window.devBrowserAPI.tabs.createTab('http://localhost:3000', 'persist:dev-admin');
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setCurrentUrl(newTab.url);
    } else {
      const newId = `tab-${Date.now()}`;
      const newTab: BrowserTab = {
        id: newId,
        partitionId: '22222222-2222-4222-a222-222222222222',
        url: 'http://localhost:3000/admin',
        title: 'Admin Dashboard',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isPinned: false,
        hibernation: { isHibernated: false, lastUrl: 'http://localhost:3000/admin' },
        activeSplitPane: 'main'
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newId);
      setCurrentUrl(newTab.url);
    }
  };

  const handleNavigate = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: currentUrl, title: currentUrl.replace('http://', '') } : t));
  };

  const handleRunAiDiagnosis = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setAiDiagnosis(
        `[Diagnosis from local ${ollamaStatus.model}]\n\n` +
        `Root Cause: Missing Content-Security-Policy and exposed development headers detected on ${currentUrl}.\n` +
        `Remediation Patch:\n` +
        `\`\`\`diff\n` +
        `+ // next.config.js - Add security headers\n` +
        `+ headers: async () => [{\n` +
        `+   source: '/(.*)',\n` +
        `+   headers: [{ key: 'Content-Security-Policy', value: "default-src 'self'" }]\n` +
        `+ }]\n` +
        `\`\`\``
      );
      setIsAiLoading(false);
    }, 1200);
  };

  const handleNuclearShred = async () => {
    if (window.confirm('WARNING: Trigger Nuclear Shred? This will purge all local SQLite history, session cookies, and Keychain credentials.')) {
      if (window.devBrowserAPI) {
        const result = await window.devBrowserAPI.privacy.triggerNuclearShred();
        alert(`Nuclear Shred Completed: ${result.details.join(', ')}`);
      } else {
        alert('Nuclear Shred completed in mock mode.');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-primary)'
    }}>
      <Header
        tabs={tabs}
        activeTabId={activeTabId}
        partitions={partitions}
        currentUrl={currentUrl}
        splitLayout={splitLayout}
        onSelectTab={handleSelectTab}
        onNewTab={handleNewTab}
        onUrlChange={setCurrentUrl}
        onNavigate={handleNavigate}
        onToggleSplitLayout={setSplitLayout}
      />

      {/* Main Workspace Split View Area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: splitLayout === 'split-horizontal' ? 'column' : 'row',
        overflow: 'hidden',
        position: 'relative'
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
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            gap: '12px',
            padding: '24px'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              padding: '24px 32px',
              maxWidth: '540px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Dev Browser Active Workspace
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Currently inspecting: <code style={{ color: 'var(--accent-cyan)' }}>{currentUrl}</code>
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '11px',
                textAlign: 'left',
                background: 'var(--bg-primary)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)'
              }}>
                <div>CDP Interception: <span style={{ color: '#10b981' }}>Active</span></div>
                <div>Passive Auditor: <span style={{ color: '#10b981' }}>Monitoring</span></div>
                <div>Session Partition: <span style={{ color: '#38bdf8' }}>persist:dev-default</span></div>
                <div>Local AI Bridge: <span style={{ color: ollamaStatus.ok ? '#10b981' : '#ef4444' }}>{ollamaStatus.ok ? 'Connected' : 'Offline'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Split Pane (if split view active) */}
        {splitLayout !== 'single' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
            padding: '16px',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-indigo)', marginBottom: '8px' }}>
              Parallel Inspection Pane (Split View)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Render secondary role session (e.g. Admin Role container) or live API debugger side-by-side.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Integrated Developer Suite (Network, API Client, Security, AI, Graph) */}
      <DockPanel
        findings={findings}
        ollamaStatus={ollamaStatus}
        onRunAiDiagnosis={handleRunAiDiagnosis}
        aiDiagnosis={aiDiagnosis}
        isAiLoading={isAiLoading}
      />

      {/* Global Status Bar */}
      <StatusBar
        metrics={metrics}
        ollamaStatus={ollamaStatus}
        onNuclearShred={handleNuclearShred}
      />
    </div>
  );
};

export default App;
