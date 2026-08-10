import {styled} from '@stitches/react'
import ButtonFooter from './ButtonFooter';

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
  cursor: 'pointer',
  height: '80px',

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

function Footer() {
  return (
    <FooterStyled>
    <ButtonFooter to="" text="Anterior" />
    <DivContainer>

      <Number active={true}>1</Number>
     
    </DivContainer>
    <ButtonFooter to="" text="Próximo" />   
    </FooterStyled>
  );
}

export default Footer;