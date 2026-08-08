import {styled} from '@stitches/react'
import ButtonFooter from './ButtonFooter';

const FooterStyled = styled('footer', {
  backgroundColor: '#FFFFFF',
  color: '#B7B9BA',
  padding: '24px 48px',
  display: 'flex',
  
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '14px',
  fontFamily: 'Arial',
  boxShadow: '0px -1px 1px #D3D7DB',
  width: '100%',
  height: '80px',

});


function Footer() {
  return (
    <FooterStyled>
    <ButtonFooter to="" text="Anterior" />

    <ButtonFooter to="" text="Próximo" />   
    </FooterStyled>
  );
}

export default Footer;