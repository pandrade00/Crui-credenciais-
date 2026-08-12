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

import {
  PencilIcon,
  CheckIcon,
  AirplaneIcon,
  BusIcon,
  HotelIcon,
  CarIcon,
  DefaultServiceIcon,
} from '../common/Icons';

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