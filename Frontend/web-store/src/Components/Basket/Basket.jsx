import { useSelector, useDispatch } from "react-redux";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { clearBasket } from '../../redux/action/BasketAction'
import BasketItem from "./BasketItem";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createOrder, removeLastOrder } from '../../redux/action/OrderAction'

const Basket = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ totalSum, setTotalSum ] = useState(0);
    const { products } = useSelector((state) => state.basket);
    const { order, error } = useSelector((state) => state.order);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        let _totalSum = 0;
        products.forEach((p) => 
        { 
            _totalSum += p.price * p.count 
        });

        setTotalSum(_totalSum)
    }, [products])
    
    useEffect(() => {
        if (order != null)
        {
            dispatch(clearBasket());
            dispatch(removeLastOrder());
            navigate(`/MyOrders`);
        }
    }, [order])

    const handleCreateOrder = () => 
    {
        if (currentUser)
        {
            const productsForOrder = products.map(product => ({
                productId: product.id,
                productCount: product.count,
                userId: currentUser.id
            }));

            dispatch(createOrder(productsForOrder))
        }
        else
        {
            navigate(`/authorization`);
        }
    }

    if (products.length === 0) { 
        return (
            <Container 
                className="d-flex justify-content-center align-items-center" 
                style={{ height: '100vh' }}
            >
                <h1>Кошик пустий!</h1>
            </Container>
        );
    }
    else 
    {
        return (
            <Container>
                {
                    products.map((product)=>
                    {
                        return (<BasketItem product={product} />);
                    })
                }
                <div style={{ height: "3px", backgroundColor: "gray", margin: "20px 0px"}}></div>
                <p className="d-flex justify-content-end">
                    Разом: {totalSum} грн. 
                </p>
                <Row>
                    <Button className="mt-1" variant="warning" onClick={() => { dispatch(clearBasket()) }}>Очистити кошик</Button>
                    <Button className="mt-1" variant="success" onClick={() => { handleCreateOrder() }}>Створити замовлення</Button>
                </Row>
            </Container>
        );
    }
};

export default Basket;
