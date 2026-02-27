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
        position: { x: 500, y: 50 },
        style: { background: '#1c1c1c', color: '#ff7b00', border: '2px solid #ff7b00', borderRadius: '12px', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }
    },
    {
        id: 'msg-menu',
        data: { label: '🤖 Menu Inicial M2R\n\n"Hoje a M2R Cred trabalha com as seguintes modalidades de empréstimo:\n\n1️⃣ Aposentados\n2️⃣ Pensionistas\n3️⃣ Militares do Exército\n4️⃣ Servidores Públicos\n5️⃣ Antecipação do FGTS\n6️⃣ Crédito CLT\n\nEm qual dessas opções você se enquadra?"' },
        position: { x: 500, y: 150 },
        style: { background: '#1e3a8a', color: '#fff', border: '1px solid #3b82f650', borderRadius: '8px', minWidth: '350px', fontSize: '11px', padding: '10px' }
    },
    {
        id: 'f1-dados',
        data: { label: '📝 Coleta Aposentados\n\n"Perfeito! Para eu verificar as opções e simular pra você, me informe por favor:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Qual banco você recebe o benefício?"' },
        position: { x: 50, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f2-dados',
        data: { label: '📝 Coleta Pensionistas\n\n"Perfeito! Para eu simular, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Banco que recebe o benefício"' },
        position: { x: 300, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f3-dados',
        data: { label: '📝 Coleta Militares\n\n"Ótimo! Para eu verificar as condições pra você:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Posto/graduação\n✅ Banco onde recebe"' },
        position: { x: 550, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f4-dados',
        data: { label: '📝 Coleta Servidor\n\n"Perfeito! Para eu simular corretamente, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Órgão/Prefeitura/Estado (qual é o vínculo?)\n✅ UF e cidade\n✅ Banco onde recebe"' },
        position: { x: 800, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f5-dados',
        data: { label: '📝 Coleta FGTS\n\n"Perfeito! Para antecipação do FGTS, me informe por favor:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Você tem o app Meu FGTS instalado?"' },
        position: { x: 1050, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f6-dados',
        data: { label: '📝 Coleta CLT\n\n"Ótimo! Para eu verificar a liberação do Crédito CLT, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Empresa onde trabalha\n✅ Tempo de carteira assinada (aprox.)\n✅ Salário líquido (média)"' },
        position: { x: 1300, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'act-humano',
        data: { label: '🧑‍💻 Handoff Humano\n\nAtribuir para a equipe para receber documentos e qualificar no CRM' },
        position: { x: 675, y: 560 },
        style: { background: '#450a0a', color: '#f87171', border: '1px solid #dc2626', borderRadius: '8px', minWidth: '250px', fontSize: '11px', padding: '10px' }
    }
]

const initialEdges: Edge[] = [
    { id: 'e-start-menu', source: 'start', target: 'msg-menu', animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } },
    { id: 'e-menu-f1', source: 'msg-menu', target: 'f1-dados', animated: true, label: 'Se Opção 1', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f2', source: 'msg-menu', target: 'f2-dados', animated: true, label: 'Se Opção 2', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f3', source: 'msg-menu', target: 'f3-dados', animated: true, label: 'Se Opção 3', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f4', source: 'msg-menu', target: 'f4-dados', animated: true, label: 'Se Opção 4', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f5', source: 'msg-menu', target: 'f5-dados', animated: true, label: 'Se Opção 5', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f6', source: 'msg-menu', target: 'f6-dados', animated: true, label: 'Se Opção 6', style: { stroke: '#10b981', strokeWidth: 2 } },

    // Todos desaguam no Humano apos coletar os dados
    { id: 'e-f1-act', source: 'f1-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f2-act', source: 'f2-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f3-act', source: 'f3-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f4-act', source: 'f4-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f5-act', source: 'f5-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f6-act', source: 'f6-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } }
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
