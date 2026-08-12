import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAuthToken,
  getAllCredentials,
  getAllProviders,
  changeCredentialStatus,
  getCredentialById,
  updateCredential,
} from '../service/api';

describe('API Service Unit Tests', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('deve obter o token de autenticação com sucesso', async () => {
    const mockResponse = {
      token: {
        type: 'Bearer',
        value: 'mock-token-value-123',
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const token = await getAuthToken();
    expect(token).toBe('Bearer mock-token-value-123');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('deve retornar lista de credenciais por página', async () => {
    const mockCredentials = [
      {
        credential_uuid: 'cred-1',
        description: 'Credencial Teste',
        service_type: 'road',
        active: true,
        provider: { uuid: 'prov-1', name: 'Fornecedor 1', service_type: 'road' },
        credential_values: [],
      },
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCredentials }),
    } as Response);

    const result = await getAllCredentials('Bearer test-token', 1);
    expect(result.data).toEqual(mockCredentials);
    expect(result.meta).toBeDefined();
  });

  it('deve chamar a rota /active quando status for true e /inactive quando false', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    
    await changeCredentialStatus('Bearer test-token', 'cred-123', true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/credentials/cred-123/active'),
      expect.objectContaining({ method: 'PATCH' }),
    );

    
    await changeCredentialStatus('Bearer test-token', 'cred-123', false);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/credentials/cred-123/inactive'),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deve obter credencial por ID com fallback para resposta direta ou aninhada', async () => {
    const mockData = {
      credential_uuid: 'cred-123',
      description: 'Credencial Detalhada',
    };

    
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as Response);

    const res1 = await getCredentialById('Bearer test-token', 'cred-123');
    expect(res1).toEqual(mockData);

   
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const res2 = await getCredentialById('Bearer test-token', 'cred-123');
    expect(res2).toEqual(mockData);
  });

  it('deve atualizar credencial via PUT', async () => {
    const payload = {
      description: 'QUERO-PASSAGEM-PRINCIPAL EDIT TESTE',
      service_type: 'road',
      identifier: 'QUERO-PASSAGEM-PRINCIPAL EDIT TESTE',
      integration_code: 'INT-USCZEL',
      credentials: [
        { uuid: 'a270cc7c-2e6f-4e83-9a34-ac49c586db34', value: 'username-value-Principal' },
      ],
      uuid: 'a270cc7c-2ce0-4525-bea6-a02a43599175',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { ...payload, credential_uuid: 'cred-123' } }),
    } as Response);

    const res = await updateCredential('Bearer test-token', 'cred-123', payload);
    expect(res).toBeDefined();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/credentials/cred-123'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('deve listar provedores', async () => {
    const mockProviders = [
      { uuid: 'prov-1', name: 'QueroPassagem' },
      { uuid: 'prov-2', name: 'Gol' },
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockProviders }),
    } as Response);

    const providers = await getAllProviders('Bearer test-token', 1);
    expect(providers).toEqual(mockProviders);
  });
});
