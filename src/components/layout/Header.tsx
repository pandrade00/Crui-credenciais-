import { useState, useEffect } from 'react';
import {styled} from '@stitches/react'
import ButtonNewCredencitial from './ButtonNewCredencitial'
import Modal from '../form/Modal'

const HeaderStyled = styled('header', {
  backgroundColor: '#FFFFFF',
  padding: '24px 48px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0px 1px 1px #D3D7DB',
  gap: '16px',
  height: '80px',
  width: '100%',
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,

  '@media (max-width: 768px)': {
    padding: '16px 20px',
    height: 'auto',
    flexWrap: 'wrap',
    gap: '12px',
  },

  '@media (max-width: 480px)': {
    padding: '12px 16px',
  },
  
  'h1': {
    color: '#000000',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    margin: 0,
    '@media (max-width: 480px)': {
      fontSize: '18px',
    },
  },
  
  'div': {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '260px',
    height: '38px',
    padding: '0 14px', 
    gap: '8px', 
    '@media (max-width: 768px)': {
      width: '100%',
      order: 3,
      marginLeft: 0,
    },
  },

  'svg': {
    width: '16px', 
    height: '16px', 
    flexShrink: 0,
    color: '#757575', 
  },

  'input': {
    border: 'none',
    outline: 'none',
    height: '100%',
    width: '100%', 
    background: 'transparent',
    fontSize: '14px',
    fontFamily: 'Arial',
  },
});

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onAddSuccess?: () => void;
}

function Header({ searchTerm = "", onSearchChange, onAddSuccess }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = () => {
    if (onSearchChange) {
      onSearchChange(search);
    }
  };

  return (
    <HeaderStyled>
      <h1>Credenciais</h1>
      <div>      
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
          onClick={handleSearchSubmit}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>  
        
        <input 
          type="text" 
          placeholder="Buscar credencial" 
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            if (onSearchChange) {
              onSearchChange(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
        />
      </div>

      <ButtonNewCredencitial onClick={() => setIsModalOpen(true)} text="Nova credencial" />
      {isModalOpen && (
        <Modal 
          onClose={() => setIsModalOpen(false)}
          onAdd={() => {
            if (onAddSuccess) {
              onAddSuccess();
            }
          }}
        />
      )}
    </HeaderStyled>
  );
}

export default Header;