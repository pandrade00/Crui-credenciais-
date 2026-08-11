import { useState } from 'react';
import { styled } from '@stitches/react';
import * as Switch from '@radix-ui/react-switch';

const DivStyled = styled('div', {
  backgroundColor: '#Ffffff',
  width: '100%',
  height: '100px',
  padding: '24px 48px',
  boxSizing: 'border-box',
  borderRadius: '6px',
  border: '1px solid #1962AC',

  display: 'flex',
  justifyContent: 'space-between',


  fontFamily: 'Arial',
  fontSize: '12px',
  color: '#B2C3CF',

});

const InfosContainer = styled('div', {

  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  flex: 1,
  gap: '64px',

});

const Column = styled('div', {

  display: 'flex',
  flexDirection: 'column',
  gap: '4px',

});



const Value = styled('span', {

  fontSize: '14px',
  color:'#2C3E50',
  fontWeight: 'bold',

});

const ActionsContainer = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',

});

const EditButton = styled('button', {
  all: 'unset',
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  color: '#8A9DB0',
  justifyContent: 'center',
  '&:hover' : {
    color: '#1962AC',
  },

});

const SiwtchWrapper = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
});

const StatusText = styled('span', {
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#2C3E50',
  minWidth: '45px',
});

const SwitchRoot = styled(Switch.Root, {
  all: 'unset',
  width: '42px',
  height: '25px',
  backgroundColor: '#E6E6E6',
  borderRadius: '9999px',
  position: 'relative',
  border: 'none',
  cursor: 'pointer',

  '&[data-state="checked"]': { 
    backgroundColor: '#EBF4FC',
    borderColor: '#1962AC',
   },
});

const SwitchThumb = styled(Switch.Thumb, {
  display: 'flex',

  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  backgroundColor: '#1962AC',
  borderRadius: '9999px',
  transition: 'transform 100ms',
  transform: 'translateX(4px)', 
  willChange: 'transform',

  
  '&[data-state="checked"]': { 
    transform: 'translateX(20px)',
    backgroundColor: '#1962AC',
  },
});

const PencilIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface CardCredencialProps {
  nome: string;
  fornecedor: string;
  tipoServico: string;
}

function CardCredencial({ nome, fornecedor, tipoServico }: CardCredencialProps) {

  const [isAtivo, setIsAtivo] = useState(false);

  return (
  <DivStyled>
    <InfosContainer>
       <Column>
         <label>Nome</label>
         <Value>{nome}</Value>
       </Column>
    
    
       <Column>
         <label>Fornecedor</label>
         <Value>{fornecedor}</Value>
       </Column>

       <Column>
         <label>Serviço</label>
         <Value>{tipoServico}</Value>
       </Column>
    </InfosContainer>

    <ActionsContainer>
        <EditButton aria-label="Editar">
        <PencilIcon />
      </EditButton>

      <SiwtchWrapper>

        <SwitchRoot checked={isAtivo} onCheckedChange={setIsAtivo}>
		      <SwitchThumb>
            <CheckIcon />
          </SwitchThumb>
	      </SwitchRoot>

        <StatusText>{isAtivo ? 'Ativo' :'' }</StatusText>


      </SiwtchWrapper>

    </ActionsContainer>
		
  </DivStyled>
);

}

export default CardCredencial;