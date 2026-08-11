import { useState, useEffect } from 'react';
import { styled } from '@stitches/react';
import * as Switch from '@radix-ui/react-switch';
import { changeCredentialStatus } from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ModalEditar from '../form/ModalEditar';

const DivStyled = styled('div', {
  backgroundColor: '#Ffffff',
  width: '100%',
  minHeight: '100px',
  height: 'auto',
  padding: '20px 48px',
  boxSizing: 'border-box',
  borderRadius: '6px',
  border: '1px solid #1962AC',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',

  fontFamily: 'Arial',
  fontSize: '12px',
  color: '#B2C3CF',

  '@media (max-width: 768px)': {
    padding: '16px 20px',
    gap: '16px',
  },

  '@media (max-width: 580px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '16px',
    gap: '14px',
  },
});

const InfosContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  flex: 1,
  gap: '40px',

  '@media (max-width: 900px)': {
    gap: '20px',
  },

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1.2fr 1fr auto',
    gap: '16px',
  },

  '@media (max-width: 580px)': {
    gridTemplateColumns: '1.2fr 1fr auto',
    gap: '12px',
  },

  '@media (max-width: 420px)': {
    gridTemplateColumns: '1fr 1fr auto',
    gap: '8px',
  },
});

const Column = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
  wordBreak: 'break-word',
});

const Value = styled('span', {
  fontSize: '14px',
  color: '#2C3E50',
  fontWeight: 'bold',
  wordBreak: 'break-word',

  '@media (max-width: 480px)': {
    fontSize: '13px',
  },
});

const ServiceValue = styled('span', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  'svg': {
    color: '#1962AC',
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
});

const ActionsContainer = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  flexShrink: 0,

  '@media (max-width: 580px)': {
    justifyContent: 'space-between',
    borderTop: '1px solid #F1F2F6',
    paddingTop: '12px',
  },
});

const EditButton = styled('button', {
  all: 'unset',
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  color: '#8A9DB0',
  justifyContent: 'center',
  '&:hover': {
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
  border: '1px solid transparent',
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

const AirplaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
  </svg>
);

const BusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6v6" />
    <path d="M15 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.2-1.2-.5-1.7L19 7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3l-2.5 5.3c-.3.5-.5 1.1-.5 1.7 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="15" cy="18" r="2" />
  </svg>
);

const HotelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    <path d="M9 9h1" />
    <path d="M9 13h1" />
    <path d="M9 17h1" />
    <path d="M14 9h1" />
    <path d="M14 13h1" />
    <path d="M14 17h1" />
  </svg>
);

const CarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const DefaultServiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const serviceMap: Record<string, { label: string; icon: React.ReactNode }> = {
  road: { label: 'Rodoviário', icon: <BusIcon /> },
  airway: { label: 'Aéreo', icon: <AirplaneIcon /> },
  hotel: { label: 'Hotelaria', icon: <HotelIcon /> },
  offline_hotel: { label: 'Hotel Offline', icon: <HotelIcon /> },
  vehicle: { label: 'Veículo', icon: <CarIcon /> },
};

function getServiceData(type: string) {
  const normalized = (type || '').toLowerCase().trim();
  if (serviceMap[normalized]) {
    return serviceMap[normalized];
  }
  return {
    label: type || 'Não informado',
    icon: <DefaultServiceIcon />,
  };
}

interface CardCredencialProps {
  credentialId: string | number;
  description: string;
  fornecedor: string;
  tipoServico: string;
  active: boolean;
  providerId: string;
  credentialValues?: any[];
  onUpdate?: () => void;
}

function CardCredencial({ credentialId, description, fornecedor, tipoServico, active, providerId, credentialValues, onUpdate }: CardCredencialProps) {
  
  const [isAtivo, setIsAtivo] = useState(!!active);
  const { token } = useAuth();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsAtivo(!!active);
  }, [active]);

  const handleToggleStatus = async (checked: boolean) => {
    
    setIsAtivo(checked); 
    
    if (token) {
      try {
        await changeCredentialStatus(token, credentialId, checked);
        showToast(checked ? 'Credencial ativada com sucesso!' : 'Credencial desativada com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showToast('Erro ao atualizar status da credencial.', 'error');
        setIsAtivo(!checked);
      }
    } else {
       console.warn('Token não encontrado.');
       showToast('Sessão expirada.', 'error');
       setIsAtivo(!checked);
    }
  };

  const serviceData = getServiceData(tipoServico);

  return (
    <DivStyled>
      <InfosContainer>
        <Column>
          <label>Nome</label>
          <Value>{description}</Value>
        </Column>

        <Column>
          <label>Fornecedor</label>
          <Value>{fornecedor}</Value>
        </Column>

        <Column>
          <label>Serviço</label>
          <ServiceValue title={serviceData.label} aria-label={serviceData.label}>
            {serviceData.icon}
          </ServiceValue>
        </Column>
      </InfosContainer>

      <ActionsContainer>
        <EditButton aria-label="Editar" onClick={() => setIsModalOpen(true)}>
          <PencilIcon />
        </EditButton>

        <SiwtchWrapper>
          <SwitchRoot checked={isAtivo} onCheckedChange={handleToggleStatus}>
            <SwitchThumb>
              {isAtivo && <CheckIcon />}
            </SwitchThumb>
          </SwitchRoot>

          <StatusText>{isAtivo ? 'Ativo' : ''}</StatusText>
        </SiwtchWrapper>

        {isModalOpen && (
          <ModalEditar 
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              if (onUpdate) {
                onUpdate();
              }
            }}
            credential={{ 
              credentialId: credentialId,
              description: description, 
              providerId: providerId,     
              providerName: fornecedor, 
              tipoServico: tipoServico,
              credential_values: credentialValues,
            }}
          />
        )}
      </ActionsContainer>
    </DivStyled>
  );
}

export default CardCredencial;