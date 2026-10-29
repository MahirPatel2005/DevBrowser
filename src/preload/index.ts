import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import type { DevBrowserAPI } from './api';
import type { AIDebugContext } from '../shared/domain/ai';
import type { NetworkTransaction } from '../shared/domain/network';

const devBrowserAPI: DevBrowserAPI = {
  system: {
    getHardwareMetrics: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_HARDWARE_METRICS),
    checkOllamaStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_CHECK_OLLAMA_STATUS)
  },
  tabs: {
    createTab: (url: string, partitionKey?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TABS_CREATE, { url, partitionKey }),
    closeTab: (tabId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TABS_CLOSE, { tabId }),
    navigate: (tabId: string, url: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TABS_NAVIGATE, { tabId, url }),
    getPartitions: () =>
      ipcRenderer.invoke(IPC_CHANNELS.TABS_LIST)
  },
  network: {
    onStreamTransaction: (callback: (tx: NetworkTransaction) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, tx: NetworkTransaction) => callback(tx);
      ipcRenderer.on(IPC_CHANNELS.NETWORK_STREAM_TRANSACTION, listener);
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.NETWORK_STREAM_TRANSACTION, listener);
      };
    }
  },
  ai: {
    executeDiagnosis: (context: AIDebugContext) =>
      ipcRenderer.invoke(IPC_CHANNELS.AI_EXECUTE_DIAGNOSIS, { context })
  },
  security: {
    getFindings: () => ipcRenderer.invoke(IPC_CHANNELS.SECURITY_GET_FINDINGS),
    clearFindings: () => ipcRenderer.invoke(IPC_CHANNELS.SECURITY_CLEAR_FINDINGS)
  },
  privacy: {
    triggerNuclearShred: () => ipcRenderer.invoke(IPC_CHANNELS.PRIVACY_TRIGGER_NUCLEAR_SHRED)
  }
};

contextBridge.exposeInMainWorld('devBrowserAPI', devBrowserAPI);
