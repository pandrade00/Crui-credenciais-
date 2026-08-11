import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardCredencial from '../components/layout/CardCredencial';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('CardCredencial Component Unit Tests', () => {
  const defaultProps = {
    credentialId: 'cred-123',
    description: 'Credencial QueroPassagem',
    fornecedor: 'QueroPassagem',
    tipoServico: 'road',
    active: true,
    providerId: 'prov-123',
  };

  const renderCard = (props = defaultProps) => {
    return render(
      <AuthProvider>
        <ToastProvider>
          <CardCredencial {...props} />
        </ToastProvider>
      </AuthProvider>
    );
  };

  it('deve renderizar o nome, fornecedor e o ícone com tooltip do serviço em português', () => {
    renderCard();

    expect(screen.getByText('Credencial QueroPassagem')).toBeInTheDocument();
    expect(screen.getByText('QueroPassagem')).toBeInTheDocument();

    
    const serviceIconWrapper = screen.getByTitle('Rodoviário');
    expect(serviceIconWrapper).toBeInTheDocument();
  });

  it('deve exibir o status Ativo quando active for true', () => {
    renderCard();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('deve renderizar botão de edição com ícone de lápis', () => {
    renderCard();
    expect(screen.getByLabelText('Editar')).toBeInTheDocument();
  });
});
