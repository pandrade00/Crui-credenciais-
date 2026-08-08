import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Credential from './components/pages/Credential';

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import { styled } from '@stitches/react';

const DivStyled = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});


const RoutesStyled = styled('main', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

function App() {
  
  return (
    <DivStyled>

      <Router>

      <Header />
      
      <RoutesStyled>
        <Routes>
          <Route path="/" element={<Credential />} />
        </Routes>
      </RoutesStyled>
      
      <Footer />

    </Router>

    </DivStyled>
    
  )
}

export default App;