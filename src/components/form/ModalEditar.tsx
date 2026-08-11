import {styled} from '@stitches/react'
import { createPortal } from 'react-dom';


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
            color: '#333' },
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
        borderColor: '#0056b3'},
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
}


function ModalEditar({ onClose }: ModalProps) {
    return createPortal(
        <ModalOverlay onClick={onClose}>
                <ModalContent onClick={(e) => e.stopPropagation()} >
                    <ModalHeader>
                        <h2>Nova Credencial</h2>
                        <button type="button" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </ModalHeader>

                        <Form onSubmit={(e) => e.preventDefault()}>
                            <FormGroup>
                                <Label>Fornecedor <span>Obrigatório</span></Label>
                                <Select><option value=""></option></Select>
                            </FormGroup>

                            <FormGroup>
                                <Label>Nome da Credencial <span>Obrigatório</span></Label>
                                <Input type="text" />
                            </FormGroup>

                            <FormGroup>
                                <Label>Tipo de Serviço <span>Obrigatório</span></Label>
                                <Select defaultValue="" required><option value="" disabled hidden> Selecione o tipo de serviço</option></Select>
                            </FormGroup>
                            
                            <ButtonContainer>
                                    <Button type='button' variant='secondary' onClick={onClose}>Cancelar</Button>
                                    <Button type='submit'>Adicionar
                                    </Button>
                            </ButtonContainer>
                            
                        </Form>

                </ModalContent>       
        </ModalOverlay>
    , document.body
        


    )
}

export default ModalEditar