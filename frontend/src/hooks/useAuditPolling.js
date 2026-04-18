import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function useAuditPolling(auditId, onComplete) {
  const [status, setStatus] = useState(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!auditId) return

    const pollStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE}/report/${auditId}/status`)
        const { status: currentStatus, progress: currentProgress } = response.data
        
        setStatus(currentStatus)
        setProgress(currentProgress)

        if (currentStatus === 'done') {
          clearInterval(intervalRef.current)
          
          const reportResponse = await axios.get(`${API_BASE}/report/${auditId}`)
          setReport(reportResponse.data)
          onComplete?.(reportResponse.data)
        } else if (currentStatus === 'failed') {
          clearInterval(intervalRef.current)
          setError('Audit failed. Please try again.')
        }
      } catch (err) {
        clearInterval(intervalRef.current)
        setError(err.response?.data?.detail || 'Failed to fetch audit status')
      }
    }

    pollStatus()
    intervalRef.current = setInterval(pollStatus, 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [auditId])

  return { status, progress, error, report }
}