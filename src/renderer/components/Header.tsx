import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Plus, 
  Columns, 
  Rows, 
  Square
} from 'lucide-react';
import type { BrowserTab, ProfilePartition } from '../../shared/domain/browser';

interface DragCSSProperties extends React.CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

interface HeaderProps {
  tabs: BrowserTab[];
  activeTabId: string;
  partitions: ProfilePartition[];
  currentUrl: string;
  splitLayout: 'single' | 'split-vertical' | 'split-horizontal';
  onSelectTab: (id: string) => void;
  onNewTab: () => void;
  onUrlChange: (url: string) => void;
  onNavigate: () => void;
  onToggleSplitLayout: (layout: 'single' | 'split-vertical' | 'split-horizontal') => void;
}

export const Header: React.FC<HeaderProps> = ({
  tabs,
  activeTabId,
  partitions,
  currentUrl,
  splitLayout,
  onSelectTab,
  onNewTab,
  onUrlChange,
  onNavigate,
  onToggleSplitLayout
}) => {
  const activeTab = tabs.find(t => t.id === activeTabId);
  const activePartition = partitions.find(p => p.id === activeTab?.partitionId);

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      WebkitAppRegion: 'drag'
    } as DragCSSProperties}>
      {/* Top Tab Bar (macOS Traffic Light Offset) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '78px', // Space for macOS window traffic lights
        paddingRight: '12px',
        paddingTop: '6px',
        gap: '6px',
        height: '40px',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const partition = partitions.find(p => p.id === tab.partitionId);
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px 6px 0 0',
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                borderTop: isActive ? `2px solid ${partition?.color || 'var(--accent-cyan)'}` : '2px solid transparent',
                borderLeft: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                borderRight: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                minWidth: '140px',
                maxWidth: '220px',
                WebkitAppRegion: 'no-drag'
              } as DragCSSProperties}
              className="transition-smooth"
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: partition?.color || '#3b82f6',
                  flexShrink: 0
                }}
              />
              <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {tab.title}
              </span>
            </div>
          );
        })}

        <button
          onClick={onNewTab}
          title="New Container Tab"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            WebkitAppRegion: 'no-drag'
          } as DragCSSProperties}
          className="transition-smooth hover:bg-slate-800"
        >
          <Plus size={16} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Layout Switchers */}
        <div style={{ display: 'flex', gap: '2px', WebkitAppRegion: 'no-drag' } as DragCSSProperties}>
          <button
            onClick={() => onToggleSplitLayout('single')}
            title="Single Pane View"
            style={{
              background: splitLayout === 'single' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: splitLayout === 'single' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => onToggleSplitLayout('split-vertical')}
            title="Split Vertical View"
            style={{
              background: splitLayout === 'split-vertical' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: splitLayout === 'split-vertical' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Columns size={14} />
          </button>
          <button
            onClick={() => onToggleSplitLayout('split-horizontal')}
            title="Split Horizontal View"
            style={{
              background: splitLayout === 'split-horizontal' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: splitLayout === 'split-horizontal' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Rows size={14} />
          </button>
        </div>
      </div>

      {/* Omnibox / Navigation Control Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        gap: '8px',
        background: 'var(--bg-surface)',
        WebkitAppRegion: 'no-drag'
      } as DragCSSProperties}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            title="Back"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px'
            }}
          >
            <ArrowLeft size={15} />
          </button>
          <button
            title="Forward"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px'
            }}
          >
            <ArrowRight size={15} />
          </button>
          <button
            title="Reload"
            onClick={onNavigate}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px'
            }}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Address Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          background: 'var(--bg-primary)',
          borderRadius: '6px',
          border: '1px solid var(--border-medium)',
          padding: '4px 10px',
          gap: '8px'
        }}>
          {activePartition && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: activePartition.color,
                background: `${activePartition.color}15`,
                padding: '2px 6px',
                borderRadius: '4px',
                flexShrink: 0
              }}
            >
              {activePartition.name}
            </span>
          )}
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate()}
            placeholder="Enter URL or localhost address..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <span style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            ⌘K
          </span>
        </div>
      </div>
    </header>
  );
};
