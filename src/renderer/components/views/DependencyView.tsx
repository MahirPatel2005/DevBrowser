import React from 'react';
import { 
  Share2, 
  AlertTriangle, 
  Layers, 
  Server, 
  Database, 
  Globe, 
  Settings 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../common/Badge';

export const DependencyView: React.FC = () => {
  const graphNodes = useAppStore(s => s.graphNodes);
  const graphEdges = useAppStore(s => s.graphEdges);
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const setSelectedNodeId = useAppStore(s => s.setSelectedNodeId);
  const blastRadius = useAppStore(s => s.blastRadius);
  const calculateBlastRadiusForNode = useAppStore(s => s.calculateBlastRadiusForNode);
  const tigerGraphStatus = useAppStore(s => s.tigerGraphStatus);
  const setActiveView = useAppStore(s => s.setActiveView);

  const selectedNode = graphNodes.find(n => n.id === selectedNodeId) || graphNodes[0];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Database': return <Database size={15} color="var(--accent-purple)" />;
      case 'Service': return <Server size={15} color="var(--accent-indigo)" />;
      case 'FrontendRoute': return <Globe size={15} color="var(--accent-cyan)" />;
      default: return <Layers size={15} color="var(--accent-emerald)" />;
    }
  };

  const connectedEdges = graphEdges.filter(e => e.sourceId === selectedNode?.id || e.targetId === selectedNode?.id);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Top Provider Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            API Dependency Graph & Blast Radius Simulator
          </span>
          <Badge 
            label={tigerGraphStatus === 'connected' ? 'TigerGraph REST++ Connected' : 'In-Memory Provider Active'} 
            variant={tigerGraphStatus === 'connected' ? 'success' : 'demo'} 
          />
        </div>

        <button
          onClick={() => setActiveView('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Settings size={12} />
          Configure TigerGraph
        </button>
      </div>

      {/* Main Canvas & Inspector Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Interactive Visual Graph Canvas */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'auto',
          position: 'relative'
        }}>
          {/* Visual Topology Diagram */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
            maxWidth: '620px',
            width: '100%'
          }}>
            {/* Level 1: Frontend Route */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                onClick={() => setSelectedNodeId('route:cart')}
                style={{
                  background: selectedNode?.id === 'route:cart' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'route:cart' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Globe size={14} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>FRONTEND ROUTE</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>/cart UI</div>
              </div>
            </div>

            <div style={{ height: '16px', width: '2px', background: 'var(--accent-cyan)' }} />

            {/* Level 2: API Gateway & Endpoint */}
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
              <div
                onClick={() => setSelectedNodeId('service:api-gw')}
                style={{
                  background: selectedNode?.id === 'service:api-gw' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'service:api-gw' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Server size={14} color="var(--accent-indigo)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-indigo)' }}>GATEWAY</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>API Gateway</div>
              </div>

              <div
                onClick={() => setSelectedNodeId('ep:checkout')}
                style={{
                  background: selectedNode?.id === 'ep:checkout' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'ep:checkout' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Layers size={14} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-emerald)' }}>ENDPOINT</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>POST /checkout</div>
              </div>
            </div>

            <div style={{ height: '16px', width: '2px', background: 'var(--accent-indigo)' }} />

            {/* Level 3: Downstream Microservices */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div
                onClick={() => setSelectedNodeId('service:billing')}
                style={{
                  background: selectedNode?.id === 'service:billing' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'service:billing' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '3px' }}>SERVICE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>BillingService</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', marginTop: '2px' }}>● 38ms latency</div>
              </div>

              <div
                onClick={() => setSelectedNodeId('service:inventory')}
                style={{
                  background: selectedNode?.id === 'service:inventory' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'service:inventory' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '3px' }}>SERVICE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>InventoryService</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-amber)', marginTop: '2px' }}>▲ 12% error rate</div>
              </div>

              <div
                onClick={() => setSelectedNodeId('db:orders')}
                style={{
                  background: selectedNode?.id === 'db:orders' ? 'var(--bg-active)' : 'var(--bg-surface)',
                  border: `2px solid ${selectedNode?.id === 'db:orders' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="transition-smooth hover:scale-105"
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '3px' }}>DATABASE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>PostgreSQL:Orders</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>2 Replicas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Node Inspector & Blast Radius Panel */}
        <div style={{
          width: '320px',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '16px',
          flexShrink: 0,
          overflowY: 'auto'
        }}>
          {selectedNode && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  {getNodeIcon(selectedNode.type)}
                  <Badge label={selectedNode.type} variant="primary" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedNode.name}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {selectedNode.id}
                </div>
              </div>

              {/* Connected Dependencies */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  CONNECTED DEPENDENCIES ({connectedEdges.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {connectedEdges.map((e, idx) => (
                    <div key={idx} style={{
                      background: 'var(--bg-surface)',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)'
                    }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>{e.type}</span>: {e.sourceId === selectedNode.id ? `→ ${e.targetId}` : `← ${e.sourceId}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blast Radius Action */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Outage Simulation & Risk
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Simulate taking this node offline to measure cascade blast radius and affected consumer routes.
                </p>

                <button
                  onClick={() => calculateBlastRadiusForNode(selectedNode.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: 'var(--accent-amber)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  className="transition-smooth hover:opacity-90"
                >
                  <AlertTriangle size={13} />
                  Calculate Blast Radius
                </button>

                {blastRadius && (
                  <div style={{
                    marginTop: '8px',
                    background: 'var(--bg-primary)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <div style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
                      Impact Score: {Math.round(blastRadius.impactScore * 100)}%
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Affected Nodes: {blastRadius.affectedNodes.length} services
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
