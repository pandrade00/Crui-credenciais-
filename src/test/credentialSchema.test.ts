import { describe, it, expect } from 'vitest';
import { validateCredentialForm } from '../schemas/credentialSchema';

describe('Credential Yup Schema Unit Tests', () => {
  it('deve rejeitar cadastro sem fornecedor', async () => {
    const res = await validateCredentialForm(
      { nome: 'Credencial Teste', fornecedor: '', tipoServico: 'road' },
      [],
      {},
      false
    );

    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Selecione um fornecedor.');
  });

  it('deve rejeitar nome de credencial com menos de 3 caracteres', async () => {
    const res = await validateCredentialForm(
      { nome: 'ab', fornecedor: 'prov-1', tipoServico: 'road' },
      [],
      {},
      false
    );

    expect(res.isValid).toBe(false);
    expect(res.error).toBe('O nome da credencial deve ter no mínimo 3 caracteres.');
  });

  it('deve rejeitar quando um parâmetro obrigatório estiver vazio', async () => {
    const parameters = [
      { uuid: 'param-1', title: 'Usuario API', required: true },
      { uuid: 'param-2', title: 'Senha API', required: false },
    ];

    const res = await validateCredentialForm(
      { nome: 'Credencial Valida', fornecedor: 'prov-1', tipoServico: 'road' },
      parameters,
      { 'param-1': '', 'param-2': 'senha123' },
      false
    );

    expect(res.isValid).toBe(false);
    expect(res.error).toBe('O campo "Usuario API" é obrigatório.');
  });

  it('deve aprovar dados válidos no cadastro e na edição', async () => {
    const parameters = [
      { uuid: 'param-1', title: 'Usuario API', required: true },
    ];

    const resCreate = await validateCredentialForm(
      { nome: 'Credencial Valida', fornecedor: 'prov-1', tipoServico: 'road' },
      parameters,
      { 'param-1': 'usuario_123' },
      false
    );

    expect(resCreate.isValid).toBe(true);

    const resEdit = await validateCredentialForm(
      { nome: 'Credencial Valida Editada', tipoServico: 'airway' },
      parameters,
      { 'param-1': 'usuario_123' },
      true
    );

    expect(resEdit.isValid).toBe(true);
  });
});
