import {styled} from '@stitches/react'
import ButtonFooter from './ButtonFooter';
import type { Dispatch, SetStateAction } from 'react';

const FooterStyled = styled('footer', {
  backgroundColor: '#FFFFFF',
  color: '#B7B9BA',
  padding: '0 48px',
  display: 'flex',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '14px',
  fontFamily: 'Arial',
  boxShadow: '0px -1px 1px #D3D7DB',
  width: '100%',
  height: '80px',
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 100,

  '@media (max-width: 768px)': {
    padding: '0 20px',
    height: '64px',
  },

  '@media (max-width: 480px)': {
    padding: '0 16px',
    height: '60px',
  },
});

const DivContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const Number = styled('span', {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: 'Arial',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
  
  variants: {
    active: {
      true: {
        backgroundColor: '#EBF4FC', 
        color: '#1962AC', 
      },
      false: {
        backgroundColor: 'transparent',
        color: '#B4B6B8',
        '&:hover': {
          backgroundColor: '#F4F5F7', 
        }
      }
    }
  },
  
  defaultVariants: {
    active: false,
  }
});

interface FooterProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>; 
}

function Footer({ page, setPage }: FooterProps) {

const handlePrevious = () => {
    setPage((prevPage) => {
      if (prevPage > 1) return prevPage - 1;
      return prevPage;
    });
  };

  const handleNext = () => {  
   setPage((prevPage) => prevPage + 1); 
  };

  return (
    <FooterStyled>
    <ButtonFooter onClick={handlePrevious} text="Anterior"/>
    <DivContainer>
      <Number active={true}>{page}</Number>
    </DivContainer>
    <ButtonFooter onClick={handleNext} text="Próximo" />   
    </FooterStyled>
  );
}

export default Footer;