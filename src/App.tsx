import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Credential from './components/pages/Credential';

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'




function App() {
  
  return (
    <Router>
      <Header />
      <Routes>
          <Route path="/" element={<Credential />} />
        </Routes>
      <Footer />
    </Router>
  )
}

export default App
