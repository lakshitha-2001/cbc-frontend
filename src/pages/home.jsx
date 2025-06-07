import { Route, Routes } from 'react-router-dom';
import LoginPage from './login';
import ProductPage from '../client/productPage';
import ProductOverview from '../client/productOverview';
import Cart from '../client/cart';
import Checkout from '../client/checkout';


export default function HomePage() {
  return (
    <div className="h-screen w-full">
      
      <div className='w-full h-[calc(100vh-100px)] '>
        <Routes path="/*">
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/about" element={<h1>About Us</h1>} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/overview/:id" element={<ProductOverview/>}/>
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>  
      </div>
        
    </div>
  ); 
}