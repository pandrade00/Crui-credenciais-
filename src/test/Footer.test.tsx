import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../components/layout/Footer';

describe('Footer Component Unit Tests', () => {
  it('deve exibir o número da página atual', () => {
    const setPage = vi.fn();
    render(<Footer page={2} setPage={setPage} lastPage={3} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Próximo')).toBeInTheDocument();
  });

  it('deve avançar a página ao clicar em Próximo quando não estiver na última página', () => {
    const setPage = vi.fn();
    render(<Footer page={1} setPage={setPage} lastPage={3} />);

    const nextBtn = screen.getByText('Próximo');
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);

    expect(setPage).toHaveBeenCalledTimes(1);
  });

  it('deve retroceder a página ao clicar em Anterior quando não estiver na primeira página', () => {
    const setPage = vi.fn();
    render(<Footer page={3} setPage={setPage} lastPage={3} />);

    const prevBtn = screen.getByText('Anterior');
    expect(prevBtn).not.toBeDisabled();
    fireEvent.click(prevBtn);

    expect(setPage).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar Anterior na primeira página e Próximo na última página', () => {
    const setPage = vi.fn();
    const { rerender } = render(<Footer page={1} setPage={setPage} lastPage={3} />);

    expect(screen.getByText('Anterior')).toBeDisabled();
    expect(screen.getByText('Próximo')).not.toBeDisabled();

    rerender(<Footer page={3} setPage={setPage} lastPage={3} />);
    expect(screen.getByText('Anterior')).not.toBeDisabled();
    expect(screen.getByText('Próximo')).toBeDisabled();
  });
});
