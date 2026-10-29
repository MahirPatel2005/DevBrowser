import type { HardwareMetrics } from '../shared/ipc-channels';
import type { BrowserTab, ProfilePartition } from '../shared/domain/browser';
import type { SecurityFinding } from '../shared/domain/security';
import type { ShredResult } from '../shared/domain/privacy';

export interface DevBrowserAPI {
  system: {
    getHardwareMetrics: () => Promise<HardwareMetrics>;
    checkOllamaStatus: () => Promise<{ ok: boolean; model: string; message?: string }>;
  };
  tabs: {
    createTab: (url: string, partitionKey?: string) => Promise<BrowserTab>;
    closeTab: (tabId: string) => Promise<void>;
    navigate: (tabId: string, url: string) => Promise<void>;
    getPartitions: () => Promise<ProfilePartition[]>;
  };
  security: {
    getFindings: () => Promise<SecurityFinding[]>;
    clearFindings: () => Promise<void>;
  };
  privacy: {
    triggerNuclearShred: () => Promise<ShredResult>;
  };
}
