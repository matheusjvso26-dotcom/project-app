'use client'

import React, { useState, useCallback } from 'react'
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Save, ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { saveVisualFlow } from './actions' // Criaremos essa action

const initialNodes: Node[] = [
    {
        id: 'start',
        type: 'input',
        data: { label: 'Início (Gatilho)' },
        position: { x: 250, y: 50 },
        style: { background: '#1c1c1c', color: '#ff7b00', border: '1px solid #ff7b00', borderRadius: '8px', fontWeight: 'bold' }
    }
]

const initialEdges: Edge[] = []

export function FlowBuilder({ botName, onBack }: { botName: string, onBack: () => void }) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)
    const [isSaving, setIsSaving] = useState(false)

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    )

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } }, eds)),
        []
    )

    const addMessageNode = () => {
        const newNode: Node = {
            id: `msg-${Date.now()}`,
            data: { label: 'Mensagem de Texto' },
            position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
            style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '150px' }
        }
        setNodes((nds) => [...nds, newNode])
    }

    const addOptionNode = () => {
        const newNode: Node = {
            id: `opt-${Date.now()}`,
            data: { label: 'Validação (Se/Senão)' },
            position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
            style: { background: '#1e3a8a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '150px' }
        }
        setNodes((nds) => [...nds, newNode])
    }

    const handleSave = async () => {
        setIsSaving(true)
        const workflowData = { nodes, edges }
        try {
            await saveVisualFlow(botName, workflowData)
            toast.success("Design da árvore de decisões salvo com sucesso!")
        } catch (err: any) {
            toast.error(err.message || "Falha ao salvar fluxograma.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            {/* Header */}
            <div className="h-16 flex-shrink-0 bg-[#1c1c1c] border-b border-white/10 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Árvore Interativa [{botName}]
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={addMessageNode} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#2a2a2a] hover:bg-[#333] border border-white/10 rounded-md transition-colors">
                        <Plus className="w-3 h-3" /> Nó de Mensagem
                    </button>
                    <button onClick={addOptionNode} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#1e3a8a] hover:bg-[#1e40af] border border-blue-500/20 rounded-md transition-colors">
                        <Plus className="w-3 h-3" /> Nó de Condição
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-[#ff7b00] hover:bg-[#e66a00] rounded-md shadow-lg shadow-[#ff7b00]/20 transition-colors ml-2 disabled:opacity-50">
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Salvando...' : 'Salvar Fluxo'}
                    </button>
                </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 w-full h-full relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    colorMode="dark"
                    nodesConnectable={true}
                    elementsSelectable={true}
                >
                    <Background color="#ffffff" gap={16} size={1} variant={BackgroundVariant.Dots} />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    )
}
