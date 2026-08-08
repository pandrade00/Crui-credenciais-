import {styled} from '@stitches/react'
import ButtonNewCredencitial from './ButtonNewCredencitial'

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
  
  'h1': {
    color: '#000000',
    fontSize: '26px',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    margin: 0,
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

function Header() {
  return (
    <HeaderStyled>
      <h1>Credenciais</h1>
      <div>      
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>   

        <input type="text" placeholder="Buscar credencial" />
      </div>
      <ButtonNewCredencitial to="/add-credential" text="Nova credencial" />
       
    </HeaderStyled>
  )
}

export default Header;