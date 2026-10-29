import type { HardwareMetrics } from '../shared/ipc-channels';
import type { BrowserTab, ProfilePartition } from '../shared/domain/browser';
import type { SecurityFinding } from '../shared/domain/security';
import type { ShredResult } from '../shared/domain/privacy';
import type { AIDebugContext, AICodeDiff } from '../shared/domain/ai';
import type { NetworkTransaction } from '../shared/domain/network';

export interface DevBrowserAPI {
  system: {
    getHardwareMetrics: () => Promise<HardwareMetrics>;
    checkOllamaStatus: () => Promise<{ ok: boolean; model: string; message?: string }>;
    checkTigerGraphStatus: (endpoint?: string) => Promise<{ ok: boolean; message: string; statusCode?: number }>;
  };
  tabs: {
    createTab: (url: string, partitionKey?: string) => Promise<BrowserTab>;
    closeTab: (tabId: string) => Promise<void>;
    navigate: (tabId: string, url: string) => Promise<void>;
    getPartitions: () => Promise<ProfilePartition[]>;
  };
  network: {
    onStreamTransaction: (callback: (tx: NetworkTransaction) => void) => () => void;
  };
  ai: {
    executeDiagnosis: (context: AIDebugContext) => Promise<{ diagnosis: string; suggestedDiff?: AICodeDiff }>;
  };
  security: {
    getFindings: () => Promise<SecurityFinding[]>;
    clearFindings: () => Promise<void>;
  };
  privacy: {
    triggerNuclearShred: () => Promise<ShredResult>;
  };
}
