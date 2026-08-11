import { useEffect, useState, useCallback } from "react";
import CardCredencial from "../layout/CardCredencial";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import { styled } from "@stitches/react";
import type CredentialI from "../../interfaces/CredentialInterface";
import { getAllCredentials, getAuthToken } from "../../service/api";
import { useAuth } from "../../context/AuthContext";

const DivStyled = styled("div", {
  backgroundColor: "#F1F2F6",
  width: "100%",
  flex: 1,
  flexDirection: "column",
  display: "flex",
  gap: "24px",
  padding: "104px 48px 104px 48px",
  boxSizing: "border-box",
  minHeight: "100vh",

  '@media (max-width: 768px)': {
    padding: "140px 16px 100px 16px",
    gap: "16px",
  },

  '@media (max-width: 480px)': {
    padding: "135px 12px 90px 12px",
    gap: "12px",
  },
});

function Credential() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [credentials, setCredentials] = useState<CredentialI[]>([]);
  const [page, setPage] = useState<number>(1);
  const { token, login } = useAuth();

  const fetchCredentials = useCallback(async (authToken: string, currentPage: number, search: string) => {
    try {
      const data = await getAllCredentials(authToken, currentPage, search);
      setCredentials(data);
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        console.warn("Token expirado, autenticando novamente...");
        const newToken = await getAuthToken();
        login(newToken);
        const data = await getAllCredentials(newToken, currentPage, search);
        setCredentials(data);
      } else {
        console.error("Erro ao obter credenciais:", error);
      }
    }
  }, [login]);

  useEffect(() => {
    if (!token) {
      getAuthToken()
        .then((responseToken) => {
          login(responseToken);
        })
        .catch((err) => {
          console.error("Erro no login inicial:", err);
        });
    }
  }, [token, login]);

  useEffect(() => {
    if (token) {
      fetchCredentials(token, page, searchTerm);
    }
  }, [token, page, searchTerm, fetchCredentials]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleReload = () => {
    if (token) {
      fetchCredentials(token, page, searchTerm);
    }
  };

  const filteredCredentials = credentials.filter((credential) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const nameMatch = credential.description?.toLowerCase().includes(term);
    const providerMatch = credential.provider?.name?.toLowerCase().includes(term);
    const serviceMatch = credential.service_type?.toLowerCase().includes(term);
    return Boolean(nameMatch || providerMatch || serviceMatch);
  });

  return (
    <>
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
        onAddSuccess={handleReload}
      />
      <DivStyled>
        {filteredCredentials.length > 0 ? (
          filteredCredentials.map((credential) => (
            <CardCredencial
              key={credential.credential_uuid}
              credentialId={credential.credential_uuid}
              description={credential.description}
              fornecedor={credential.provider?.name || ""}
              tipoServico={credential.service_type}
              active={!!credential.active}
              providerId={credential.provider?.uuid || ""}
              credentialValues={credential.credential_values}
              onUpdate={handleReload}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#8A9DB0", fontSize: "16px", marginTop: "32px", fontFamily: "Arial" }}>
            {searchTerm ? "Nenhuma credencial encontrada para a busca." : "Nenhuma credencial cadastrada."}
          </p>
        )}
      </DivStyled>

      {!searchTerm && <Footer page={page} setPage={setPage} />}
    </>
  );
}

export default Credential;