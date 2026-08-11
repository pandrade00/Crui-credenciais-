import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { styled, keyframes } from '@stitches/react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItemData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextI {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextI | undefined>(undefined);

const slideIn = keyframes({
  '0%': { transform: 'translateY(100%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

const ToastContainer = styled('div', {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  pointerEvents: 'none',
});

const ToastItem = styled('div', {
  padding: '12px 18px',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  animation: `${slideIn} 0.25s ease-out`,
  pointerEvents: 'auto',

  variants: {
    type: {
      success: {
        backgroundColor: '#00C247',
      },
      error: {
        backgroundColor: '#E53E3E',
      },
      info: {
        backgroundColor: '#38B6FF',
      },
    },
  },
  defaultVariants: {
    type: 'info',
  },
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} type={toast.type}>
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            <span>{toast.message}</span>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextI {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}
