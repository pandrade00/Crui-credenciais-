import { styled } from '@stitches/react';

const ButtonStyled = styled('button', {
    color: '#B4B6B8',
    fontSize: '14px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s, color 0.2s',
    border: 'none',
    cursor: 'pointer',   
   '&:hover': {
        backgroundColor: '#F4F5F7',
        color: '#8A9DB0',
    },
  
    
  });

interface ButtonProps {
    onClick?: () => void;
    text: string;
}




function ButtonFooter({ onClick, text }: ButtonProps) {
  return (
    <ButtonStyled type="button" 
      onClick={onClick} >
      {text}
    </ButtonStyled>
    
  );
}

export default ButtonFooter;