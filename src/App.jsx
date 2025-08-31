import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import AdminHomePage from './pages/adminPage';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/register';
import ProductPage from './client/productPage';
import Header from './components/header';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from './components/footer';
import About from './pages/AboutUs';
import Contact from './pages/contact';
import WishlistPage from './pages/wishlist';
import ForgetPasswordPage from './pages/forgetPassword';


// Component to handle conditional layout
function AppLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Header />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about" element={<About />} />  
          <Route path="/contact" element={<Contact />} />  
          <Route path="/wishlist" element={<WishlistPage/>} />
          <Route path="/*" element={<Home />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/admin/*" element={<AdminHomePage />} />
        </Routes>
      </main>
      
      {!isAdminPage && <Footer />}
    </div>
  );
}

// Main App Component
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;