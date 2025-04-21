// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import BudgetingTools from './pages/BudgetingTools';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ExpenseManager from './pages/ExpenseManager';
import IncomeManager from './pages/IncomeManager'; // Import IncomeManager
import NavBar from './pages/NavBar';
import Footer from './pages/Footer';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="min-h-screen flex flex-col">
        {/*<Navbar />*/}
        <main className="flex-grow" style={{ paddingTop: '8rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/budgeting-tools" element={<BudgetingTools />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/ExpenseManager" element={<ExpenseManager/>} />
            <Route path="/IncomeManager" element={<IncomeManager/>} /> 
            <Route path="/Profile" element={<ProfilePage />}/>
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </main>
        {/*<Footer />*/}
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
