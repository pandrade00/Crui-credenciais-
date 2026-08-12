import type CredentialI from "../interfaces/CredentialInterface";
import type ProviderI from "../interfaces/ProviderInterface";
import type CreateCredentialI from "../interfaces/CreateCredentialInterface";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const USER_EMAIL = import.meta.env.VITE_USER_EMAIL ?? "";
const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD ?? "";

function getApiUrl(): string {
  return API_URL;
}

function getHeaders(authToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = authToken;
  }
  return headers;
}

function getAuthToken(): Promise<string> {const url = `${getApiUrl()}/login`; const body = JSON.stringify({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  });

  return fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body,
  }).then(async (response) => {
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || `Erro ao autenticar: ${response.status}`);
    }
    const data = await response.json();
    if (!data.token) {
      throw new Error("Token não encontrado na resposta da autenticação");
    }
    return `${data.token.type} ${data.token.value}`;
  });
}

export interface CredentialsResponseI {
  data: CredentialI[];
  meta?: {
    current_page: number;
    last_page: number;
    total?: number;
    per_page?: number;
    from?: number;
    to?: number;
  };
}

async function getAllCredentials(
  authToken: string,
  page: number,
  searchQuery?: string,
): Promise<CredentialsResponseI> {
  if (!authToken) return { data: [], meta: { current_page: 1, last_page: 1 } };

 
  if (searchQuery && searchQuery.trim() !== "") {
    try {
      const allCredentials: CredentialI[] = [];
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage && currentPage <= 10) {
        const pageUrl = `${getApiUrl()}/credentials?page=${currentPage}&search=${encodeURIComponent(searchQuery.trim())}`;
        const pageRes = await fetch(pageUrl, {
          method: "GET",
          headers: getHeaders(authToken),
        });
        if (pageRes.status === 401) throw new Error("UNAUTHORIZED");
        if (!pageRes.ok) break;

        const pageData = await pageRes.json();
        const items: CredentialI[] = pageData.data || [];
        if (items.length === 0) {
          hasNextPage = false;
        } else {
          for (const item of items) {
            if (!allCredentials.some((c) => c.credential_uuid === item.credential_uuid)) {
              allCredentials.push(item);
            }
          }
          if (pageData.meta && pageData.meta.last_page && currentPage >= pageData.meta.last_page) {
            hasNextPage = false;
          } else if (items.length < (pageData.meta?.per_page || 10)) {
            hasNextPage = false;
          } else {
            currentPage++;
          }
        }
      }

      return {
        data: allCredentials,
        meta: { current_page: 1, last_page: 1, total: allCredentials.length },
      };
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") throw error;
      console.error("Erro na busca global de credenciais:", error);
    }
  }


  const url = `${getApiUrl()}/credentials?page=${page ?? 1}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(authToken),
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.message || `Erro ao obter credenciais: ${response.status}`);
  }
  const data = await response.json();
  if (!data.data) {
    throw new Error("Credenciais não encontradas na resposta da API");
  }
  return {
    data: data.data,
    meta: data.meta || { current_page: page ?? 1, last_page: page ?? 1 },
  };
}

function getAllProviders(
  authToken: string,
  page: number,
): Promise<ProviderI[]> {
  if (!authToken) return Promise.resolve([]);
  const url = `${getApiUrl()}/providers?page=${page ?? 1}`;

  return fetch(url, {
    method: "GET",
    headers: getHeaders(authToken),
  }).then(async (response) => {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || `Erro ao obter provedores: ${response.status}`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error("Provedores não encontrados na resposta da API");
    }
    return data.data;
  });
}

function changeCredentialStatus(
  authToken: string,
  credentialId: string | number,
  currentStatus: boolean,
): Promise<void> {
  if (!authToken) return Promise.resolve();
  const url = `${getApiUrl()}/credentials/${credentialId}/${currentStatus ? "active" : "inactive"}`;

  return fetch(url, {
    method: "PATCH",
    headers: getHeaders(authToken),
  }).then(async (response) => {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(
        errData?.message || `Erro ao ${currentStatus ? "ativar" : "desativar"} credencial`,
      );
    }
  });
}

function getCredentialById(
  authToken: string,
  credentialId: string | number,
): Promise<any> {
  const url = `${getApiUrl()}/credentials/${credentialId}`;

  return fetch(url, {
    method: "GET",
    headers: getHeaders(authToken),
  }).then(async (response) => {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!response.ok) {
      throw new Error(`Erro ao obter credencial`);
    }
    const data = await response.json();
    return data.data !== undefined ? data.data : data;
  });
}

function getMe(authToken: string): Promise<any> {
  const url = `${getApiUrl()}/me`;

  return fetch(url, {
    method: "GET",
    headers: getHeaders(authToken),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Erro ao obter informações do usuário`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error("Informações do usuário não encontradas na resposta da API");
    }
    return data.data;
  });
}

function getProviderParameters(authToken: string, providerId: string): Promise<any> {
  const url = `${getApiUrl()}/credentials/providers/${providerId}/parameters`;

  return fetch(url, {
    method: "GET",
    headers: getHeaders(authToken),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Erro ao obter parâmetros do provedor`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error("Parâmetros não encontrados na resposta da API");
    }
    return data.data;
  });
}

function createCredentialByProvider(
  authToken: string,
  providerId: string,
  credentialData: CreateCredentialI,
): Promise<CredentialI> {
  const url = `${getApiUrl()}/credentials/providers/${providerId}`;

  return fetch(url, {
    method: "POST",
    headers: getHeaders(authToken),
    body: JSON.stringify(credentialData),
  }).then(async (response) => {
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || "Erro ao criar nova credencial para o provedor");
    }
    const data = await response.json();
    return data.data || data;
  });
}

function updateCredential(
  authToken: string,
  credentialIdOrData: string | number | any,
  credentialData?: any,
): Promise<CredentialI> {
  let credentialId: string | number | undefined;
  let bodyData: any;

  if (credentialData !== undefined) {
    credentialId = credentialIdOrData;
    bodyData = credentialData;
  } else {
    bodyData = credentialIdOrData;
    credentialId = bodyData?.uuid || bodyData?.credential_uuid;
  }

  const url = credentialId ? `${getApiUrl()}/credentials/${credentialId}` : `${getApiUrl()}/credentials`;

  return fetch(url, {
    method: "PUT",
    headers: getHeaders(authToken),
    body: JSON.stringify(bodyData),
  }).then(async (response) => {
    if (response.status === 405) {
      const patchRes = await fetch(url, {
        method: "PATCH",
        headers: getHeaders(authToken),
        body: JSON.stringify(bodyData),
      });
      if (patchRes.status === 401) throw new Error("UNAUTHORIZED");
      if (!patchRes.ok) {
        const errData = await patchRes.json().catch(() => null);
        throw new Error(errData?.message || "Erro ao atualizar credencial");
      }
      const patchData = await patchRes.json();
      return patchData.data || patchData;
    }

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || "Erro ao atualizar credencial");
    }
    const data = await response.json();
    return data.data || data;
  });
}

export {
  getApiUrl,
  getAuthToken,
  getAllCredentials,
  getAllProviders,
  changeCredentialStatus,
  getCredentialById,
  getMe,
  getProviderParameters,
  createCredentialByProvider,
  updateCredential,
};