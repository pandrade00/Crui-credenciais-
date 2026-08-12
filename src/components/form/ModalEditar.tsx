import { styled } from '@stitches/react'
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

import { getProviderParameters, getCredentialById, updateCredential } from '../../service/api'; 
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { validateCredentialForm } from '../../schemas/credentialSchema';
import { CloseIcon, AlertCircleIcon } from '../common/Icons';

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

interface ModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    credential?: {
        credentialId: string | number; 
        description: string;
        providerName: string;
        providerId: string;
        tipoServico: string;
        credential_values?: any[];
    };
}

const tipoDeServico: Record<string, string> = {
    road: 'Rodoviário',
    airway: 'Aéreo',
    hotel: 'Hotelaria',
    vehicle: 'Veículo',
    offline_hotel: 'Hotel Offline',
};

function extractParamValue(param: any, allSavedItems: any[], rawDataObj?: any): string {
    if (!param) return '';
    const paramUuid = String(param.uuid || param.id || '').trim();
    const paramName = String(param.name || param.key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const paramTitle = String(param.title || param.label || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (Array.isArray(allSavedItems)) {
        if (paramUuid) {
            for (const item of allSavedItems) {
                const itemParamUuid = String(
                    item.parameter?.uuid ||
                    item.credential_parameter_uuid ||
                    item.provider_parameter_uuid ||
                    item.parameter_uuid ||
                    item.parameter?.id ||
                    item.parameter_id ||
                    item.uuid ||
                    item.id ||
                    ''
                ).trim();

                if (itemParamUuid && itemParamUuid === paramUuid && item.value !== undefined && item.value !== null) {
                    return String(item.value);
                }
            }
        }

        if (paramName) {
            for (const item of allSavedItems) {
                const itemName = String(
                    item.name ||
                    item.key ||
                    item.parameter?.name ||
                    item.parameter?.key ||
                    ''
                ).toLowerCase().replace(/[^a-z0-9]/g, '');

                if (itemName && itemName === paramName && item.value !== undefined && item.value !== null) {
                    return String(item.value);
                }
            }
        }

        
        if (paramTitle) {
            for (const item of allSavedItems) {
                const itemTitle = String(
                    item.title ||
                    item.label ||
                    item.parameter?.title ||
                    item.parameter?.label ||
                    ''
                ).toLowerCase().replace(/[^a-z0-9]/g, '');

                if (itemTitle && itemTitle === paramTitle && item.value !== undefined && item.value !== null) {
                    return String(item.value);
                }
            }
        }
    }

    
    if (rawDataObj && typeof rawDataObj === 'object') {
        if (param.uuid && rawDataObj[param.uuid] !== undefined) return String(rawDataObj[param.uuid]);
        if (param.name && rawDataObj[param.name] !== undefined) return String(rawDataObj[param.name]);
        if (rawDataObj.parameters && typeof rawDataObj.parameters === 'object' && !Array.isArray(rawDataObj.parameters)) {
            if (param.uuid && rawDataObj.parameters[param.uuid] !== undefined) return String(rawDataObj.parameters[param.uuid]);
            if (param.name && rawDataObj.parameters[param.name] !== undefined) return String(rawDataObj.parameters[param.name]);
        }
    }

    return '';
}

function ModalEditar({ onClose, onSuccess, credential }: ModalProps) {
    const [providerParameters, setProviderParameters] = useState<any[]>([]);
    const [paramValues, setParamValues] = useState<Record<string, string>>({});
    const [nome, setNome] = useState<string>(credential?.description || '');
    const [rawCredentialData, setRawCredentialData] = useState<any>(null);
    const [allSavedValues, setAllSavedValues] = useState<any[]>([]);
    const [tipoServico, setTipoServico] = useState<string>(credential?.tipoServico || '');
    const [availableServiceTypes, setAvailableServiceTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { token } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (credential?.description) {
            setNome(credential.description);
        }
        if (credential?.tipoServico) {
            setTipoServico(credential.tipoServico);
        }
    }, [credential]);

    useEffect(() => {
        async function fetchAllData() {
            if (!credential?.credentialId || !token) return;

            try {
                setLoading(true);
                
                const savedData = await getCredentialById(token as string, credential.credentialId);
                if (savedData) {
                    setRawCredentialData(savedData);
                }
                
                const provId = credential.providerId || savedData?.provider?.uuid;
                let schemaParams: any[] = [];
                let services: string[] = [];

                if (provId) {
                    try {
                        const schemaData = await getProviderParameters(token as string, provId);
                        schemaParams = schemaData?.parameters || (Array.isArray(schemaData) ? schemaData : []);
                        services = schemaData?.service_types || [];
                    } catch (schemaErr) {
                        console.warn("Erro ao buscar schema dos parâmetros:", schemaErr);
                    }
                }

                const allSavedItems: any[] = [
                    ...(Array.isArray(savedData?.credential_values) ? savedData.credential_values : []),
                    ...(Array.isArray(savedData?.parameters) ? savedData.parameters : []),
                    ...(Array.isArray(savedData?.credential_parameters) ? savedData.credential_parameters : []),
                    ...(Array.isArray(credential?.credential_values) ? credential.credential_values : []),
                ];

                setAllSavedValues(allSavedItems);

                if (savedData) {
                    if (savedData.description) {
                        setNome(savedData.description);
                    }
                    if (savedData.service_type) {
                        setTipoServico(savedData.service_type);
                    }
                }

                if (schemaParams.length === 0 && allSavedItems.length > 0) {
                    schemaParams = allSavedItems.map((cv: any) => ({
                        uuid: cv.parameter?.uuid || cv.credential_parameter_uuid || cv.uuid,
                        title: cv.parameter?.title || cv.name || 'Parâmetro',
                        input_type: cv.parameter?.input_type || 'text',
                        required: cv.parameter?.required ?? false,
                        description: cv.parameter?.description || '',
                    }));
                }

                const valuesMap: Record<string, string> = {};
                for (const param of schemaParams) {
                    const val = extractParamValue(param, allSavedItems, savedData);
                    valuesMap[param.uuid] = val;
                }

                setParamValues(valuesMap);
                setProviderParameters(schemaParams);
                if (services.length > 0) {
                    setAvailableServiceTypes(services);
                }
            } catch (error) {
                console.error('Erro ao obter dados para edição:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllData();
    }, [credential, token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const description = (formData.get('nome') as string) || nome;
        const selectedService = (formData.get('tipoServico') as string) || tipoServico;

        const credentialsList = providerParameters.map((param) => {
            const fieldValue = paramValues[param.uuid] !== undefined 
                ? paramValues[param.uuid] 
                : (formData.get(`param_${param.uuid}`) as string || '');
            
            const existingValueItem = allSavedValues.find((item: any) => {
                const itemParamUuid = item.parameter?.uuid || item.credential_parameter_uuid || item.parameter_uuid;
                const paramUuid = param.uuid;
                const paramName = (param.name || param.key || '').toLowerCase().trim();
                const itemName = (item.name || item.key || item.parameter?.name || '').toLowerCase().trim();
                const paramTitle = (param.title || param.label || '').toLowerCase().trim();
                const itemTitle = (item.title || item.label || item.parameter?.title || '').toLowerCase().trim();

                return (itemParamUuid && paramUuid && String(itemParamUuid) === String(paramUuid)) ||
                       (paramName && itemName && paramName === itemName) ||
                       (paramTitle && itemTitle && paramTitle === itemTitle);
            });

            const targetUuid = existingValueItem?.uuid || param.uuid;

            return {
                uuid: String(targetUuid),
                value: fieldValue,
            };
        });

        const validation = await validateCredentialForm(
            { nome: description, tipoServico: selectedService },
            providerParameters,
            paramValues,
            true
        );

        if (!validation.isValid) {
            setErrorMessage(validation.error || 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (!token || !credential?.credentialId) {
            setErrorMessage("Sessão expirada ou não encontrada.");
            return;
        }

        const payload = {
            description,
            service_type: selectedService,
            identifier: description,
            integration_code: rawCredentialData?.integration_code || rawCredentialData?.provider?.integration_code || rawCredentialData?.code || 'INT-USCZEL',
            credentials: credentialsList,
            uuid: String(credential.credentialId || rawCredentialData?.credential_uuid || rawCredentialData?.uuid || ''),
        };

        try {
            setSaving(true);
            await updateCredential(token as string, payload);
            showToast("Credencial atualizada com sucesso!", "success");
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error: any) {
            console.error('Erro ao salvar alterações da credencial:', error);
            setErrorMessage(error?.message || 'Não foi possível salvar as alterações da credencial.');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()} >
                <ModalHeader>
                    <h2>Editar Credencial</h2>
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
                        <Select defaultValue={credential?.providerId} disabled>
                            <option value={credential?.providerId}>{credential?.providerName}</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Nome da Credencial <span>Obrigatório</span></Label>
                        <Input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            name="nome" 
                            required 
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Tipo de Serviço <span>Obrigatório</span></Label>
                        <Select 
                            value={tipoServico} 
                            onChange={(e) => setTipoServico(e.target.value)}
                            name="tipoServico" 
                            required
                        >
                            {tipoServico && (
                                <option value={tipoServico}>
                                    {tipoDeServico[tipoServico] || tipoServico}
                                </option>
                            )}
                            {availableServiceTypes.length > 0
                                ? availableServiceTypes
                                    .filter((type) => type !== tipoServico)
                                    .map((type) => (
                                        <option key={type} value={type}>
                                            {tipoDeServico[type] || type}
                                        </option>
                                    ))
                                : Object.entries(tipoDeServico)
                                    .filter(([key]) => key !== tipoServico)
                                    .map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))
                            }
                        </Select>
                    </FormGroup>
                    
                    {loading ? (
                        <p style={{ fontSize: '14px', color: '#515B64' }}>Carregando parâmetros...</p>
                    ) : providerParameters.length > 0 ? (
                        providerParameters.map((param) => (
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
                                    value={paramValues[param.uuid] ?? ''} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setParamValues((prev) => ({ ...prev, [param.uuid]: val }));
                                    }}
                                />
                            </FormGroup>
                        ))
                    ) : (
                        <p style={{ fontSize: '14px', color: '#8A9DB0' }}>Nenhum parâmetro configurável para este fornecedor.</p>
                    )}
                    
                    <ButtonContainer>
                        <Button type='button' variant='secondary' onClick={onClose}>Cancelar</Button>
                        <Button type='submit' disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>       
        </ModalOverlay>,
        document.body
    );
}

export default ModalEditar;