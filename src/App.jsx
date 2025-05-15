
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import ProductCard from './components/productCard';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/register'; // Ensure this file exists
import AdminPage from './pages/adminPage';
import TestPage from './pages/testPage';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register';

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductCard />} /> {/* Consider using a ProductsPage */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} /> {/* Catch-all route for 404 */}
        <Route path="/test" element={<TestPage />} /> {/* Test route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;