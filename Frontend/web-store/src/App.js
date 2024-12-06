import './App.css';
import Header from './Components/Header/Header.jsx';
import Container from 'react-bootstrap/Container';
import ProductCategories from './Components/ProductCategories/ProductCategories.jsx';
import ProductsPage from './Components/Products/ProductsPage.jsx';
import AddProduct from './Components/AddProduct/AddProduct.jsx';
import { Routes, Route } from "react-router";
import ProductPage from './Components/Products/ProductPage.jsx';
import RegistrationPage from './Components/Registration/RegistrationPage.jsx';
import AuthorizationPage from './Components/Authorization/AuthorizationPage.jsx';
import { getUser } from "./redux/action/UserAction"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Basket from './Components/Basket/Basket.jsx';
import OrderPage from './Components/Orders/OrderPage.jsx';
import ManageOrderPage from './Components/Orders/ManageOrderPage.jsx';
import AboutUs from './Components/AboutUs/AboutUs.jsx';
import Footer from './Components/Footer/Footer.jsx';

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => { dispatch(getUser()) }, [])

  const welcomeHeader = (() => {
    if (currentUser != null) {
      return (<Container><h1>Вітаю, {currentUser?.login} {currentUser?.isAdmin == true ? "(Адмін)" : "(Користувач)"}</h1></Container>)
    }
  })

  return (
    <>
      <Header />
      <Routes>
        <Route index element = {
          <>
            { welcomeHeader() }
            <ProductCategories />
            <ProductsPage />
          </>
        } />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/Product/:id" element={<ProductPage />} />
        <Route path="/Registration" element={<RegistrationPage />} />
        <Route path="/Authorization" element={<AuthorizationPage />} />
        <Route path="/Basket" element={<Basket />} />
        <Route path="/MyOrders" element={<OrderPage />} />
        <Route path="/ManageOrders" element={<ManageOrderPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
