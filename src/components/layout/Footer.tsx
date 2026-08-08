import {styled} from '@stitches/react'

const FooterStyled = styled('footer', {
  backgroundColor: '#FFFFFF',
  padding: '14px 28px',
  display: 'flex',
  boxShadow: '0px -1px 1px #D3D7DB',
  'h1': {
    color: '#ffffff'
    ,
  }
});


function Footer() {
  return (
    <FooterStyled>
      <p></p>
    </FooterStyled>
  );
}

export default Footer;