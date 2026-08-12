import { styled } from '@stitches/react'
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { getAllProviders, getProviderParameters, createCredentialByProvider } from '../../service/api';
import type ProviderI from '../../interfaces/ProviderInterface';
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { validateCredentialForm } from '../../schemas/credentialSchema';
import { CloseIcon, AlertCircleIcon } from '../common/Icons';

const ModalOverlay = styled('div', {
    position: 'fixed',
    inset: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: ' 6px',
    justifyContent: 'center',  
    zIndex: 1000,
});

const ModalContent = styled('div', {
    backgroundColor: '#FFFFFF',
    padding: '32px',
    borderRadius: '16px',
    width: '100%',
    height: '90%',
    maxWidth: '650px',
    minHeight: '600px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial',
    overflowY: 'auto',
});

const ModalHeader = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '24px',

    'h2': {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    'button': {
        background: '#F1F2F6',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        color:'#999',
        '&:hover': { 
            color: '#333' 
        },
    },
});

const Form = styled('form', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
});

const FormGroup = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
    gap: '8px',
});

const Label = styled('label', {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#515B64',
    'span': { color: '#B6772A'},
    display: 'flex',
    gap: '4px',
});
    
const Input = styled('input', {
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    '&:focus': {
        borderColor: '#0056b3',
        borderWidth: '2px',
        padding: '13px 15px',
    },
    outline: 'none',
    fontFamily: 'Arial',
});

const Select = styled('select', {
    padding: '14px 16px 14px 16px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    color: '#333',
    '&:focus': {
        borderColor: '#0056b3'
    },
    outline: 'none',
    fontFamily: 'Arial',
    backgroundColor: '#fff',
    '&:invalid': {
        color: '#888',
    },
});

const ButtonContainer = styled('div', {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: 'auto',
});

const Button = styled('button', {
    backgroundColor: '#0064C6',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'Arial',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontWeight: 'bold',
    variants: {
        variant: {
            secondary: {
                backgroundColor: '#F1F2F6',
                color: '#333',
                '&:hover': {
                    backgroundColor: '#E5E7EB',
                },
            },
        },
    },
});

const AlertMessage = styled('div', {
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: '1px solid #F87171',
});

interface ModalProps {
    onClose: () => void;
    onAdd: () => void;
}

function Modal({ onClose, onAdd }: ModalProps) {
    const [providers, setProviders] = useState<ProviderI[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [providerParameters, setProviderParameters] = useState<any[]>([]);
    const [availableServiceTypes, setAvailableServiceTypes] = useState<string[]>([]);
    const [selectedServiceType, setSelectedServiceType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const { token } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        async function fetchProviders() {
            if (!token) return; 

            try {
                const data = await getAllProviders(token as string, 1);
                setProviders(data);
            } catch (error) {
                console.error('Erro ao carregar provedores:', error);
            }
        }
        fetchProviders();
    }, [token]); 

    useEffect(() => {
        if (!selectedProviderId || !token) {
            setProviderParameters([]);
            setAvailableServiceTypes([]);
            setSelectedServiceType('');
            return;
        }

        async function fetchParameters() {
            try {
                const data = await getProviderParameters(token as string, selectedProviderId);
                const params = data?.parameters || (Array.isArray(data) ? data : []);
                const services = data?.service_types || [];
                
                setProviderParameters(params);
                setAvailableServiceTypes(services);
                
                if (services.length > 0) {
                    setSelectedServiceType(services[0]);
                } else {
                    setSelectedServiceType('');
                }
            } catch (error) {
                console.error('Erro ao obter parâmetros do provedor:', error);
                setProviderParameters([]);
                setAvailableServiceTypes([]);
                setSelectedServiceType('');
            }
        }

        fetchParameters();
    }, [selectedProviderId, token]);

    const serviceLabels: Record<string, string> = {
        road: 'Rodoviário',
        airway: 'Aéreo',
        hotel: 'Hotelaria',
        vehicle: 'Veículo',
        offline_hotel: 'Hotel Offline',
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const description = (formData.get('nome') as string) || '';
        const providerId = (formData.get('fornecedor') as string) || selectedProviderId;
        const serviceType = (formData.get('tipoServico') as string) || selectedServiceType;

        const paramValuesMap: Record<string, string> = {};
        const parameters = providerParameters.map((param) => {
            const fieldValue = (formData.get(`param_${param.uuid}`) as string) || '';
            paramValuesMap[param.uuid] = fieldValue;
            return {
                credential_parameter_uuid: param.uuid,
                value: fieldValue,
            };
        });

        const validation = await validateCredentialForm(
            { nome: description, fornecedor: providerId, tipoServico: serviceType },
            providerParameters,
            paramValuesMap,
            false
        );

        if (!validation.isValid) {
            setErrorMessage(validation.error || 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (!token) {
            setErrorMessage("Sessão expirada ou não encontrada.");
            return;
        }

        const payload = {
            description,
            provider_id: providerId,
            service_type: serviceType,
            parameters,
        };

        try {
            setLoading(true);
            
            await createCredentialByProvider(token as string, selectedProviderId, payload);
            
            showToast("Credencial cadastrada com sucesso!", "success");
            onAdd(); 
            onClose(); 
        } catch (error: any) {
            console.error('Erro ao adicionar credencial:', error);
            setErrorMessage(error?.message || 'Não foi possível salvar a credencial.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()} >
                <ModalHeader>
                    <h2>Nova Credencial</h2>
                    <button type="button" onClick={onClose}>
                        <CloseIcon width={16} height={16} stroke="#000000" />
                    </button>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <AlertMessage>
                            <AlertCircleIcon width={16} height={16} />
                            <span>{errorMessage}</span>
                        </AlertMessage>
                    )}
                    <FormGroup>
                        <Label>Fornecedor <span>Obrigatório</span></Label>
                        <Select name="fornecedor" defaultValue="" required onChange={(e) => setSelectedProviderId(e.target.value)}>
                            <option value="" disabled hidden>Selecione um fornecedor</option>
                            {providers.map((provider) => (
                                <option key={provider.uuid} value={provider.uuid}>
                                    {provider.name}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Nome da Credencial <span>Obrigatório</span></Label>
                        <Input name="nome" type="text" required placeholder="Digite o nome da credencial"/>
                    </FormGroup>

                    <FormGroup>
                        <Label>Tipo de Serviço <span>Obrigatório</span></Label>
                        <Select 
                            name="tipoServico" 
                            value={selectedServiceType} 
                            onChange={(e) => setSelectedServiceType(e.target.value)}
                            required
                        >
                            {availableServiceTypes.length === 0 ? (
                                <option value="" disabled>Selecione um fornecedor primeiro</option>
                            ) : (
                                availableServiceTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {serviceLabels[type] || type}
                                    </option>
                                ))
                            )}
                        </Select>
                    </FormGroup>

                    {providerParameters.map((param) => (
                        <FormGroup key={param.uuid}>
                            <Label>
                                {param.title || param.name || param.label || 'Parâmetro'}{' '}
                                {param.required ? <span>Obrigatório</span> : null}
                            </Label>
                            <Input 
                                name={`param_${param.uuid}`} 
                                type={param.input_type === 'password' ? 'password' : (param.input_type === 'int' ? 'number' : 'text')} 
                                required={param.required} 
                                placeholder={param.description || `Digite o valor`}
                            />
                        </FormGroup>
                    ))}
                    
                    <ButtonContainer>
                            <Button type='button' variant='secondary' onClick={onClose}>Cancelar</Button>
                            <Button type='submit' disabled={loading}>
                                {loading ? 'Adicionando...' : 'Adicionar'}
                            </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>       
        </ModalOverlay>
    , document.body
    )
}

export default Modal