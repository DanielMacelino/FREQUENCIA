import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FaturaEmbed() {
  const navigate = useNavigate();
  const [faturaUrl, setFaturaUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const stored = localStorage.getItem('faturaUrl');
    if (stored) {
      setFaturaUrl(stored);
    }
  }, []);

  useEffect(() => {
    if (!faturaUrl) return;
    // Contagem regressiva antes de redirecionar (pequena pausa útil em dev)
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      window.location.href = faturaUrl;
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [faturaUrl]);

  const handleSave = () => {
    if (faturaUrl) {
      localStorage.setItem('faturaUrl', faturaUrl);
      // forçar redirecionamento imediato
      window.location.href = faturaUrl;
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {faturaUrl ? (
        <>
          <p>Redirecionando para o app de Fatura...</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Abrindo: {faturaUrl} — redirecionando em {countdown}s
          </p>
          <button
            onClick={() => (window.location.href = faturaUrl)}
            style={{ padding: '8px 12px', marginTop: '12px', borderRadius: '4px' }}
          >
            Abrir agora
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '8px' }}>Nenhuma URL configurada para o app de Fatura.</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Cole a URL do app de Fatura (ex: https://meu-app-fatura.example.com)</p>
          <div style={{ marginTop: '12px' }}>
            <input
              type="text"
              placeholder="https://localhost:3000"
              value={faturaUrl ?? ''}
              onChange={(e) => setFaturaUrl(e.target.value)}
              style={{ padding: '8px', width: '60%' }}
            />
          </div>
          <div style={{ marginTop: '12px' }}>
            <button onClick={handleSave} style={{ padding: '8px 12px', marginRight: '8px' }}>
              Salvar e Abrir
            </button>
            <button onClick={() => navigate('/choice')} style={{ padding: '8px 12px' }}>← Voltar</button>
          </div>
        </>
      )}
    </div>
  );
}
