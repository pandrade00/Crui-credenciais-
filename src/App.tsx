import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Credential from "./components/pages/Credential";



import { styled } from "@stitches/react";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const DivStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
});

const RoutesStyled = styled("main", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

function App() {  
  return (
    <AuthProvider>
      <ToastProvider>
        <DivStyled>
          <Router>
            <RoutesStyled>
              <Routes>
                <Route path="/" element={<Credential />} />
              </Routes>
            </RoutesStyled>
          </Router>
        </DivStyled>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;