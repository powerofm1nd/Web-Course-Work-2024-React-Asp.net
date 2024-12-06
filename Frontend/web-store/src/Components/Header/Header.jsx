import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/action/UserAction'



const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const { currentUser, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    if (loading) return "";

    const handleRegistrationClick = () => {
        navigate('/registration');
    }

    const handleAuthorizationClick = () => {
        navigate('/authorization');
    }


    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container className='p-0'>
                <Navbar.Brand href="/">BlackoutStore</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link 
                        href="/" 
                        className={isActive('/') ? 'active' : ''}
                    >
                        Головна сторінка
                    </Nav.Link>
                    
                    
                    { currentUser?.isAdmin == true ? <Nav.Link href="/ManageOrders" className={isActive('/ManageOrders') ? 'active' : ''}>Замовлення користувачів</Nav.Link> : 
                                                     <Nav.Link href="/MyOrders" className={isActive('/MyOrders') ? 'active' : ''}>Мої замовлення</Nav.Link> }
                   
                    <Nav.Link 
                        href="/AboutUs" 
                        className={isActive('/AboutUs') ? 'active' : ''}
                    >
                        Про нас
                    </Nav.Link>
                    
                    { currentUser?.isAdmin != true ? <Nav.Link href="/Basket" className={isActive('/Basket') ? 'active' : ''}>Кошик</Nav.Link> : "" }
                    { currentUser?.isAdmin == true ? <Nav.Link href="/AddProduct" className={isActive('/AddProduct') ? 'active' : ''}>Додати товар</Nav.Link> : "" }
                </Nav>
                <Nav>
                    { currentUser == null ? 
                        <>
                            <Button variant="light" className='m-1' onClick={handleRegistrationClick}>Реєстрація</Button>
                            <Button variant="light" className='m-1' onClick={handleAuthorizationClick}>Авторизація</Button>
                        </> 
                            : <Button variant="danger" className='m-1' onClick={()=> {dispatch(logout())}}>Вийти</Button>
                    }
                    
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;