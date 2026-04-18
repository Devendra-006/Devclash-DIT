import { useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

const NODE_COLORS = {
  entryPoint: { border: '#2563EB', fill: '#EFF6FF', badge: 'ENTRY' },
  highImpact: { border: '#DC2626', fill: '#FEF2F2', badge: 'CHANGE RISK' },
  orphaned: { border: '#6B7280', fill: '#F9FAFB', badge: 'ORPHANED' },
  normal: { border: '#D1D5DB', fill: '#FFFFFF', badge: null },
  highlighted: { border: '#D97706', fill: '#FEF3C7', badge: null }
}

function CustomNode({ data, selected }) {
  const { isOrphaned, changeRisk, isHighlighted, nodeType } = data
  
  const getNodeStyle = () => {
    if (isHighlighted) {
      return {
        background: NODE_COLORS.highlighted.fill,
        border: `2px solid ${NODE_COLORS.highlighted.border}`,
        borderRadius: '8px',
        padding: '10px 15px',
        color: '#1F2937',
        fontSize: '12px',
        minWidth: '120px',
        textAlign: 'center'
      }
    }
    
    let colorSet = NODE_COLORS.normal
    if (nodeType === 'entry_point') colorSet = NODE_COLORS.entryPoint
    else if (changeRisk === 'HIGH') colorSet = NODE_COLORS.highImpact
    else if (isOrphaned) colorSet = NODE_COLORS.orphaned
    
    return {
      background: colorSet.fill,
      border: selected ? '2px solid #8B5CF6' : `1px solid ${colorSet.border}`,
      borderRadius: '8px',
      padding: '10px 15px',
      color: '#1F2937',
      fontSize: '12px',
      minWidth: '120px',
      textAlign: 'center'
    }
  }

  const nodeStyle = getNodeStyle()
  
  const getBadge = () => {
    if (isHighlighted) return null
    if (nodeType === 'entry_point') return NODE_COLORS.entryPoint.badge
    if (changeRisk === 'HIGH') return NODE_COLORS.highImpact.badge
    if (isOrphaned) return NODE_COLORS.orphaned.badge
    return null
  }

  const badge = getBadge()

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} style={{ background: '#8B5CF6' }} />
      <div className="font-medium">{data.label}</div>
      {data.moduleSummary && (
        <div className="text-gray-500 text-xs mt-1">{data.moduleSummary}</div>
      )}
      {badge && (
        <div className="flex gap-1 mt-2 justify-center">
          <span className="px-1.5 py-0.5 text-xs rounded" style={{ 
            background: NODE_COLORS[nodeType === 'entry_point' ? 'entryPoint' : changeRisk === 'HIGH' ? 'highImpact' : 'orphaned'].fill,
            color: NODE_COLORS[nodeType === 'entry_point' ? 'entryPoint' : changeRisk === 'HIGH' ? 'highImpact' : 'orphaned'].border
          }}>
            {badge}
          </span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#8B5CF6' }} />
    </div>
  )
}

const nodeTypes = { customNode: CustomNode }

export default function ArchGraph({ 
  archGraph = { nodes: [], edges: [] }, 
  onNodeClick,
  selectedNode = null,
  highlightedNodes = []
}) {
  const initialNodes = useMemo(() => {
    if (!archGraph.nodes || archGraph.nodes.length === 0) {
      return [
        { id: '1', type: 'customNode', position: { x: 250, y: 0 }, data: { label: 'No data', moduleSummary: 'No architecture data available' } }
      ]
    }
    return archGraph.nodes.map(node => ({
      id: node.id,
      type: 'customNode',
      position: { x: node.x || 0, y: node.y || 0 },
      data: {
        label: node.label || node.id,
        moduleSummary: node.module_summary,
        isOrphaned: node.is_orphaned,
        changeRisk: node.change_risk,
        nodeType: node.type,
        isHighlighted: highlightedNodes.includes(node.id)
      }
    }))
  }, [archGraph, highlightedNodes])

  const initialEdges = useMemo(() => {
    if (!archGraph.edges) return []
    return archGraph.edges.map(edge => ({
      id: edge.id || `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
      style: { stroke: '#9CA3AF', strokeWidth: 1 },
      type: 'smoothstep'
    }))
  }, [archGraph])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  const onNodeClickHandler = useCallback((event, node) => {
    onNodeClick?.(node)
  }, [onNodeClick])

  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#E5E7EB" gap={20} />
        <Controls className="!bg-white !border-gray-200" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.isHighlighted) return '#D97706'
            if (node.data?.changeRisk === 'HIGH') return '#DC2626'
            if (node.data?.isOrphaned) return '#6B7280'
            return '#8B5CF6'
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
          className="!bg-gray-50"
        />
      </ReactFlow>
      
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: '#2563EB' }}></span>
          Entry Point
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: '#DC2626' }}></span>
          High Impact
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: '#6B7280' }}></span>
          Orphaned
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: '#D1D5DB' }}></span>
          Normal
        </div>
      </div>
    </div>
  )
}