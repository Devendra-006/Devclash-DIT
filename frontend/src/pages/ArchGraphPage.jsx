import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import ArchGraph from '../components/ArchGraph'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const EXAMPLE_QUERIES = [
  'Where is auth handled?',
  'What calls the database?',
  'What is the entry point?'
]

export default function ArchGraphPage() {
  const { auditId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const repoName = searchParams.get('repo')
  
  const [selectedNode, setSelectedNode] = useState(null)
  const [report, setReport] = useState(null)
  const [nlqQuery, setNlqQuery] = useState('')
  const [nlqLoading, setNlqLoading] = useState(false)
  const [nlqResult, setNlqResult] = useState(null)
  const [nlqError, setNlqError] = useState(null)

  useState(() => {
    const stored = localStorage.getItem(`audit_${auditId}`)
    if (stored) {
      setReport(JSON.parse(stored))
    }
  }, [auditId])

  const repoData = useMemo(() => {
    if (!report || !repoName) return null
    const repo = report.repo_scores?.find(r => r.name === repoName)
    return repo?.arch_graph || null
  }, [report, repoName])

  const onboardingPath = useMemo(() => {
    if (!report || !repoName) return []
    const repo = report.repo_scores?.find(r => r.name === repoName)
    return repo?.onboarding_path || []
  }, [report, repoName])

  const moduleSummaries = useMemo(() => {
    if (!report || !repoName) return {}
    const repo = report.repo_scores?.find(r => r.name === repoName)
    return repo?.module_summaries || {}
  }, [report, repoName])

  const handleNlqSearch = async (query) => {
    if (!query.trim()) return
    
    setNlqLoading(true)
    setNlqError(null)
    setNlqQuery(query)

    try {
      const response = await axios.get(`${API_BASE}/report/${auditId}/nlq`, {
        params: { query }
      })
      setNlqResult(response.data)
    } catch (err) {
      setNlqError(err.response?.data?.detail || 'Query timed out. Try a simpler question.')
    } finally {
      setNlqLoading(false)
    }
  }

  const clearNlqSearch = () => {
    setNlqQuery('')
    setNlqResult(null)
    setNlqError(null)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Architecture Graph {repoName && `- ${repoName}`}
          </h1>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <ArchGraph 
            archGraph={repoData || { nodes: [], edges: [] }}
            onNodeClick={setSelectedNode}
            selectedNode={selectedNode}
            highlightedNodes={nlqResult?.relevant_nodes?.map(n => n.id)}
          />
        </div>

        <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Path</h3>
          
          {onboardingPath.length > 0 ? (
            <div className="space-y-3">
              {onboardingPath.map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedNode?.data?.label === step.file
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedNode({ data: { label: step.file } })}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-gray-900 text-sm font-medium">{step.file}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{step.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No onboarding path available.</p>
          )}

          {selectedNode && moduleSummaries[selectedNode.data?.label] && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-gray-900 font-medium mb-2">
                {selectedNode.data?.label}
              </h4>
              <p className="text-gray-600 text-sm">
                {moduleSummaries[selectedNode.data?.label]}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask about this codebase</h3>
            
            <div className="space-y-2 mb-3">
              {EXAMPLE_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNlqSearch(q)}
                  className="block w-full text-left px-3 py-2 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={nlqQuery}
                onChange={(e) => setNlqQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNlqSearch(nlqQuery)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleNlqSearch(nlqQuery)}
                disabled={nlqLoading}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {nlqLoading ? '...' : '→'}
              </button>
            </div>

            {nlqError && (
              <p className="text-xs text-red-600 mt-2">{nlqError}</p>
            )}

            {nlqResult && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Results:</h4>
                <ul className="space-y-2">
                  {nlqResult.relevant_nodes?.map((node, idx) => (
                    <li key={idx} className="text-sm text-amber-700">
                      <button
                        onClick={() => setSelectedNode({ data: { label: node.id } })}
                        className="hover:underline"
                      >
                        {node.id}
                      </button>
                      {node.reason && <p className="text-xs text-amber-600">{node.reason}</p>}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={clearNlqSearch}
                  className="text-xs text-purple-600 hover:text-purple-800 mt-2"
                >
                  Clear results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}