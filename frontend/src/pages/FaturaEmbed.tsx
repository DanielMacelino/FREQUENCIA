import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FaturaEmbed() {
  const navigate = useNavigate();
  const [faturaUrl, setFaturaUrl] = useState<string | null>(null);
  
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('faturaUrl');
    if (stored) {
      setFaturaUrl(stored);
      return;
    }

    // Se não houver URL salva, tentar portas locais conhecidas (CRA/Vite)
    const candidates = ['http://localhost:3004', 'http://localhost:3000'];
    // usa o primeiro candidato e redireciona imediatamente
    setFaturaUrl(candidates[0]);
  }, []);

  useEffect(() => {
    if (!faturaUrl) return;
    const redirectTimeout = setTimeout(() => {
      window.location.href = faturaUrl;
    }, 500); // pequeno atraso para permitir render

    return () => {
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
      <p>Redirecionando para o app de Fatura...</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Abrindo: {faturaUrl} {showConfig ? '' : '— caso não abra, verifique se o app de fatura está rodando.'}
      </p>

      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => (window.location.href = faturaUrl || '')}
          style={{ padding: '8px 12px', borderRadius: '4px', marginRight: 8 }}
        >
          Abrir agora
        </button>
        <button onClick={() => navigate('/choice')} style={{ padding: '8px 12px', marginRight: 8 }}>← Voltar</button>
        <button onClick={() => setShowConfig((s) => !s)} style={{ padding: '8px 12px' }}>
          {showConfig ? 'Fechar configuração' : 'Configurar URL'}
        </button>
      </div>

      {showConfig && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Cole a URL do app de Fatura (ex: https://meu-app-fatura.example.com)</p>
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              placeholder="https://localhost:3004"
              value={faturaUrl ?? ''}
              onChange={(e) => setFaturaUrl(e.target.value)}
              style={{ padding: '8px', width: '60%' }}
            />
          </div>
          <div style={{ marginTop: '8px' }}>
            <button onClick={handleSave} style={{ padding: '8px 12px', marginRight: '8px' }}>
              Salvar e Abrir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
