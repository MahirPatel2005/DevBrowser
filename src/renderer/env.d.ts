import type { DevBrowserAPI } from '../preload/api';

declare global {
  interface Window {
    devBrowserAPI?: DevBrowserAPI;
  }
}
