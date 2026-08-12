
import { styled } from '@stitches/react';
import { PlusCircleIcon } from '../common/Icons';

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
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginLeft: 'auto',
    '&:hover': {
        backgroundColor: '#0052A3',
    },
    '@media (min-width: 769px)': {
        marginLeft: 0,
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
        padding: '0 10px',
        height: '36px',
    },
});

interface ButtonProps {
    onClick: () => void;
    text: string;
}

function ButtonNewCredencitial({ onClick, text }: ButtonProps) {
    return (
        <StyledButton onClick={onClick}>
            <PlusCircleIcon width={16} height={16} stroke="#FFFFFF" />
            {text}
        </StyledButton>
    );
}

export default ButtonNewCredencitial;