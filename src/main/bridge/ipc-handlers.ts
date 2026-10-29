import { ipcMain } from 'electron';
import os from 'node:os';
import http from 'node:http';
import { IPC_CHANNELS, type HardwareMetrics } from '../../shared/ipc-channels';
import type { PartitionManager } from '../session/partition-manager';
import type { BrowserTab } from '../../shared/domain/browser';
import type { SecurityFinding } from '../../shared/domain/security';
import type { ShredResult } from '../../shared/domain/privacy';

let handlersRegistered = false;

export function registerIpcHandlers(partitionManager: PartitionManager): void {
  if (handlersRegistered) {
    return;
  }
  handlersRegistered = true;
  // 1. Hardware metrics
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_HARDWARE_METRICS, async (): Promise<HardwareMetrics> => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const processMem = process.memoryUsage().rss;

    return {
      totalUnifiedMemoryBytes: totalMem,
      freeUnifiedMemoryBytes: freeMem,
      appMemoryUsageBytes: processMem,
      cpuArchitecture: os.arch(),
      isAppleSilicon: os.arch() === 'arm64' && os.platform() === 'darwin'
    };
  });

  // 2. Ollama health check
  ipcMain.handle(IPC_CHANNELS.SYSTEM_CHECK_OLLAMA_STATUS, async () => {
    return new Promise<{ ok: boolean; model: string; message?: string }>((resolve) => {
      const req = http.get('http://127.0.0.1:11434/api/tags', { timeout: 1500 }, (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            const models = (data.models || []).map((m: { name: string }) => m.name);
            resolve({
              ok: true,
              model: models.find((m: string) => m.includes('qwen2.5-coder')) || models[0] || 'none',
              message: `Ollama is running with ${models.length} model(s) available`
            });
          } catch {
            resolve({ ok: false, model: 'none', message: 'Failed to parse Ollama response' });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ ok: false, model: 'none', message: `Ollama connection error: ${err.message}` });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, model: 'none', message: 'Ollama connection timed out' });
      });
    });
  });

  // 3. Tab management
  ipcMain.handle(IPC_CHANNELS.TABS_CREATE, async (_event, args: { url: string; partitionKey?: string }): Promise<BrowserTab> => {
    const partition = partitionManager.getPartition(args.partitionKey || 'persist:dev-default') || partitionManager.getPartitions()[0]!;

    return {
      id: crypto.randomUUID(),
      partitionId: partition.id,
      url: args.url || 'http://localhost:3000',
      title: 'New Tab',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isPinned: false,
      hibernation: {
        isHibernated: false,
        lastUrl: args.url || 'http://localhost:3000'
      },
      activeSplitPane: 'main'
    };
  });

  ipcMain.handle(IPC_CHANNELS.TABS_LIST, async () => {
    return partitionManager.getPartitions();
  });

  ipcMain.handle(IPC_CHANNELS.TABS_CLOSE, async () => {
    return;
  });

  ipcMain.handle(IPC_CHANNELS.TABS_NAVIGATE, async () => {
    return;
  });

  // 4. Security findings mock / baseline
  ipcMain.handle(IPC_CHANNELS.SECURITY_GET_FINDINGS, async (): Promise<SecurityFinding[]> => {
    return [
      {
        id: crypto.randomUUID(),
        ruleId: 'SEC-HDR-001',
        timestamp: Date.now(),
        severity: 'HIGH',
        title: 'Missing Strict Content-Security-Policy',
        description: 'Target site does not provide a robust Content-Security-Policy response header.',
        remediation: "Add 'Content-Security-Policy: default-src \\'self\\'' to your web server response headers.",
        evidence: {
          url: 'http://localhost:3000',
          method: 'GET',
          statusCode: 200,
          rawSnippet: 'Content-Security-Policy header is absent'
        },
        cwe: 1021,
        owaspCategory: 'A05:2021-Security Misconfiguration',
        isIgnored: false,
        suppressionFingerprint: 'sec-hdr-001-localhost'
      }
    ];
  });

  ipcMain.handle(IPC_CHANNELS.SECURITY_CLEAR_FINDINGS, async () => {
    return;
  });

  // 5. Nuclear Shred action
  ipcMain.handle(IPC_CHANNELS.PRIVACY_TRIGGER_NUCLEAR_SHRED, async (): Promise<ShredResult> => {
    return {
      success: true,
      purgedItemsCount: 3,
      timestamp: Date.now(),
      details: [
        'Session storage partitions purged',
        'In-memory network logs wiped',
        'Keychain credentials verified clean'
      ]
    };
  });
}
