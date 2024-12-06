import { Container, Card, ListGroup, Row, Col, Image, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getOrdersByUserId, getAllOrders } from "../../redux/action/OrderAction";
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, error } = useSelector((state) => state.order);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.isAdmin)
            {
                navigate('/');
            }
            else
            {
                dispatch(getOrdersByUserId(currentUser.id));
            }
        }
    }, [currentUser, dispatch]);

    useEffect(() => {
        console.log("Orders:", orders);
    }, [orders]);

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Виконано";
            case 1:
                return "В роботі";
            case 2:
                return "Скасовано";
            default:
                return "Невідомий статус";
        }
    };

    return (
        <Container className="py-4">
            { !currentUser?.isAdmin ? <h1 className="mb-4">Ваші замовлення</h1> : <h1 className="mb-4">Замовлення користувачів</h1> }
            
            {error && <Alert variant="danger">{error}</Alert>}
            {orders?.length > 0 ? (
                orders.map((order) => {
                    const totalAmount = order.orderItems.reduce(
                        (sum, item) => sum + item.product.price * item.productCount,
                        0
                    );

                    return (
                        <Card key={order.id} className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Order ID: {order.id}</h5>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item) => (
                                        <ListGroup.Item key={item.product.id}>
                                            <Row className="align-items-center">
                                                <Col md={2}>
                                                    <Image
                                                        src={item.product.mainImage}
                                                        alt={item.product.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <h5>
                                                        <a href={"product/" + item.product.id}>
                                                            {item.product.name}
                                                        </a>
                                                    </h5>
                                                </Col>
                                                <Col md={2}>
                                                    <p className="mb-0">Кількість: {item.productCount}</p>
                                                </Col>
                                                <Col md={2}>
                                                    <p className="mb-0">
                                                        <strong>{item.product.price} грн</strong>
                                                    </p>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer>
                                <h5 className="mb-0">
                                    Загальна сумма: {totalAmount} грн | Статус: {getStatusText(order.status)}
                                </h5>
                            </Card.Footer>
                        </Card>
                    );
                })
            ) : (
                <Alert variant="info">
                    <h4 className="mb-0">No orders found.</h4>
                </Alert>
            )}
        </Container>
    );
};

export default OrderPage;