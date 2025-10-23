
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Header from './components/Header';
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import CheckOut from './pages/CheckOut';
import AuthProvider from './contexts/AuthContext';
import Pending from './pages/Pending';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import OrderPage from './pages/OrderPage';

const App = () => {
  return (
    <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='product/:slug' element={<ProductDetails />} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='cart' element={<CartPage />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                    <Route path='checkout' element={<CheckOut />} />
                    <Route path='pending' element={<Pending />} />
                    <Route path='shipping' element={<Shipping />} />
                     <Route path='order' element={<OrderPage />} />
                  </Routes>
                </>
              } />
            </Routes>
          </AuthProvider>
    </Router>
  );
};

export default App;
