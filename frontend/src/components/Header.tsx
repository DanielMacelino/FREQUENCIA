import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton,
  onBack,
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        {showBackButton && onBack && (
          <button className="btn-back" onClick={onBack}>
            ← Voltar
          </button>
        )}
      </div>
    </header>
  );
};
