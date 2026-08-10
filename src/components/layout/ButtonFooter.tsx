import { Link } from 'react-router-dom';
import { styled } from '@stitches/react';

const ButtonStyled = styled(Link, {
    color: '#B4B6B8',
    fontSize: '14px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s, color 0.2s',
    
    '&:hover': {
        backgroundColor: '#F4F5F7',
        color: '#8A9DB0',
    },

});


interface LinkButtonProps {
    to: string;
    text: string;
}



function ButtonFooter({ to, text }: LinkButtonProps) {
  return (
    <ButtonStyled to={to}>
    {text}
    </ButtonStyled>
    
  );
}

export default ButtonFooter;