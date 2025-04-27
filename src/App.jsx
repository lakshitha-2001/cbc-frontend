
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import ProductCard from './components/productCard';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signUp'; // Ensure this file exists
import AdminPage from './pages/adminPage';

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/products" element={<ProductCard />} /> {/* Consider using a ProductsPage */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} /> {/* Catch-all route for 404 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;