import { useState, useEffect, useCallback } from 'react';
import { getHealthStatus } from '../services/api';

export function useBackendHealth(pollIntervalMs = 30000) {
  const [status, setStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'
  const [data, setData] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    setStatus('checking');
    const start = performance.now();
    try {
      const res = await getHealthStatus();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setData(res);
      setStatus('connected');
      setError(null);
      setLastChecked(new Date());
    } catch (err) {
      setStatus('disconnected');
      setData(null);
      setLatency(null);
      setError(err.message || 'Backend unreachable');
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    if (pollIntervalMs > 0) {
      const interval = setInterval(checkHealth, pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [checkHealth, pollIntervalMs]);

  return {
    status,
    data,
    latency,
    lastChecked,
    error,
    checkHealth,
    isConnected: status === 'connected',
    isChecking: status === 'checking',
  };
}

export default useBackendHealth;
