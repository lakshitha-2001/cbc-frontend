import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import AdminHomePage from './pages/adminPage';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/register';
import ProductPage from './client/productPage';
import Header from './components/header'; // Assuming you might have a Footer component too
// import Footer from './components/Footer'; // Uncomment if you have a Footer
import 'react-toastify/dist/ReactToastify.css';

// This component will contain the conditional logic for Header/Footer
function AppLayout() {
  const location = useLocation(); // Get the current location object
  const isAdminPage = location.pathname.startsWith('/admin'); // Check if the path starts with /admin

  return (
    <>
      {!isAdminPage && <Header />} {/* Only show Header if not an admin page */}
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductPage />} />
        {/* 
          For admin pages, AdminHomePage itself might have its own internal routing 
          if you use nested routes within it. The /admin/* path ensures this component
          handles all sub-paths of /admin.
        */}
        <Route path="/admin/*" element={<AdminHomePage />} />
        <Route path="/*" element={<Home />} /> {/* Catch-all, consider a 404 page */}
      </Routes>
      {/* {!isAdminPage && <Footer />} // Uncomment and use if you have a Footer component */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout /> {/* Render the AppLayout which handles conditional rendering */}
    </BrowserRouter>
  );
}

export default App;