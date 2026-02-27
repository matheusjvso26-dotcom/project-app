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
        data: { label: 'Início (Gatilho Webhook)' },
        position: { x: 400, y: 50 },
        style: { background: '#1c1c1c', color: '#ff7b00', border: '2px solid #ff7b00', borderRadius: '12px', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }
    },
    {
        id: 'msg-1',
        data: { label: '📝 Boas-Vindas\n\n"Fala Matheus! Aqui é a inteligência do sistema FLY UP operando em alta performance! 🚀\\n\\nO seu servidor acaba de enviar essa mensagem pelo botEngine oficial via Meta API."' },
        position: { x: 400, y: 150 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '250px', fontSize: '12px', padding: '10px' }
    },
    {
        id: 'audio-1',
        data: { label: '🎙️ Áudio Dinâmico (.ogg)\n\n[audio_explicacao.ogg]' },
        position: { x: 400, y: 280 },
        style: { background: '#1e3a8a', color: '#fff', border: '1px solid #3b82f650', borderRadius: '8px', minWidth: '250px', fontSize: '11px', padding: '10px', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }
    },
    {
        id: 'menu-1',
        data: { label: '🤖 Menu de Ações Rápida\n\nComo quer testar a ramificação interativa?\n\n1 - Quero ver o Transbordo (Humano)\n2 - Mandar pro Kanban\n3 - Me conte uma piada' },
        position: { x: 400, y: 390 },
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #ffffff40', borderRadius: '8px', minWidth: '250px', fontSize: '11px', padding: '10px' }
    },
    {
        id: 'act-1',
        data: { label: '🧑‍💻 Transbordo (Handoff)\n\nAtribuir para: Matheus (Dono)' },
        position: { x: 100, y: 560 },
        style: { background: '#064e3b', color: '#10b981', border: '1px solid #059669', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '10px' }
    },
    {
        id: 'act-3',
        data: { label: '✅ Avançar no CRM\n\nMudar Stage -> Qualificação' },
        position: { x: 400, y: 560 },
        style: { background: '#450a0a', color: '#f87171', border: '1px solid #dc2626', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '10px' }
    },
    {
        id: 'msg-joke',
        data: { label: '📝 Mandar Piada\n\n"Sabe qual a diferença entre o SaaS e a padaria? Na padaria o pão cai, no SaaS do Matheus o servidor não cai (graças ao Coolify)! 😂"' },
        position: { x: 700, y: 560 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '10px' }
    }
]

const initialEdges: Edge[] = [
    { id: 'e-start-msg1', source: 'start', target: 'msg-1', animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } },
    { id: 'e-msg1-audio1', source: 'msg-1', target: 'audio-1', animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } },
    { id: 'e-audio1-menu', source: 'audio-1', target: 'menu-1', animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } },
    { id: 'e-menu-act1', source: 'menu-1', target: 'act-1', animated: true, label: 'Se Opção 1', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-act3', source: 'menu-1', target: 'act-3', animated: true, label: 'Se Opção 2', style: { stroke: '#f87171', strokeWidth: 2 } },
    { id: 'e-menu-joke', source: 'menu-1', target: 'msg-joke', animated: true, label: 'Se Opção 3', style: { stroke: '#52525b', strokeWidth: 2 } },
]

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
