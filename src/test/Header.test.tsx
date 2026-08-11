import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/layout/Header';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('Header Component Unit Tests', () => {
  const renderHeader = (props: any = {}) => {
    return render(
      <AuthProvider>
        <ToastProvider>
          <Header {...props} />
        </ToastProvider>
      </AuthProvider>
    );
  };

  it('deve renderizar o título Credenciais e o botão Nova credencial', () => {
    renderHeader();
    expect(screen.getByText('Credenciais')).toBeInTheDocument();
    expect(screen.getByText('Nova credencial')).toBeInTheDocument();
  });

  it('deve chamar onSearchChange em tempo real ao digitar', () => {
    const onSearchChange = vi.fn();
    renderHeader({ onSearchChange });

    const input = screen.getByPlaceholderText('Buscar credencial');
    fireEvent.change(input, { target: { value: 'hotel' } });

    expect(onSearchChange).toHaveBeenCalledWith('hotel');
  });

  it('deve disparar a busca ao pressionar a tecla Enter', () => {
    const onSearchChange = vi.fn();
    renderHeader({ searchTerm: 'gol', onSearchChange });

    const input = screen.getByPlaceholderText('Buscar credencial');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearchChange).toHaveBeenCalledWith('gol');
  });
});
