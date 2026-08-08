import { Link } from 'react-router-dom';
import { styled } from '@stitches/react';

const ButtonStyled = styled(Link, {
    color: '#B4B6B8',
    fontSize: '14px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecoration: 'none',

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