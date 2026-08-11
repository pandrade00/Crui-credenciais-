import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../components/layout/Footer';

describe('Footer Component Unit Tests', () => {
  it('deve exibir o número da página atual', () => {
    const setPage = vi.fn();
    render(<Footer page={2} setPage={setPage} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Próximo')).toBeInTheDocument();
  });

  it('deve avançar a página ao clicar em Próximo', () => {
    const setPage = vi.fn();
    render(<Footer page={1} setPage={setPage} />);

    const nextBtn = screen.getByText('Próximo');
    fireEvent.click(nextBtn);

    expect(setPage).toHaveBeenCalledTimes(1);
  });

  it('deve retroceder a página ao clicar em Anterior', () => {
    const setPage = vi.fn();
    render(<Footer page={3} setPage={setPage} />);

    const prevBtn = screen.getByText('Anterior');
    fireEvent.click(prevBtn);

    expect(setPage).toHaveBeenCalledTimes(1);
  });
});
