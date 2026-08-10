
import { styled } from '@stitches/react';

const StyledButton = styled('button', {
    backgroundColor: '#0064C6',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'Arial',
    padding: '0 14px',
    textDecoration: 'none',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '38px',
    boxSizing: 'border-box',
});

interface ButtonProps {
    onClick: () => void;
    text: string;
}

function ButtonNewCredencitial({ onClick, text }: ButtonProps) {
    return (
        <StyledButton onClick={onClick}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#FFFFFF"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            {text}
        </StyledButton>
        
    );
}

export default ButtonNewCredencitial;