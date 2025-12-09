import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FaturaEmbed() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o app de fatura que está rodando separadamente
    const faturaUrl = localStorage.getItem('faturaUrl') || 'http://localhost:3000';
    window.location.href = faturaUrl;
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Redirecionando para o app de Fatura...</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Se não redirecionar em alguns segundos, verifique se o app da fatura está rodando.
      </p>
      <button 
        onClick={() => navigate('/choice')}
        style={{
          padding: '8px 12px',
          marginTop: '12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer'
        }}
      >
        ← Voltar
      </button>
    </div>
  );
}
