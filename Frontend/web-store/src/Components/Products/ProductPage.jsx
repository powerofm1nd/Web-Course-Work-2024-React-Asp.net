import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Image, Form, InputGroup, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../redux/action/ProductAction';
import { fetchProductCategories } from '../../redux/action/ProductCategoryAction';
import { addProductIntoBasket } from '../../redux/action/BasketAction';
import { deleteProduct } from '../../redux/action/ProductAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
    const { id } = useParams();
    const { currentProduct, loading, error } = useSelector((state) => state.product);
    const { currentUser } = useSelector((state) => state.user);
    const { categories } = useSelector((state) => state.productCategory);
    const [productCategoryName, setProductCategoryName] = useState(null);
    const [productCountToBuy, setProductCountToBuy] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(fetchProductCategories());
    }, [dispatch]);

    useEffect(() => {
        if (categories && currentProduct) {
            const category = categories.find((x) => x.id === currentProduct.productCategoryId);
            setProductCategoryName(category?.name || 'Невідома категорія');
            document.title = currentProduct?.name + ' | ' + currentProduct?.price + 'грн';
        }
    }, [categories, currentProduct]);
    

    const addProductToBuy = () => {
        setProductCountToBuy(productCountToBuy + 1);
    };

    const reduceProductToBuy = () => {
        if (productCountToBuy > 1) {
            setProductCountToBuy(productCountToBuy - 1);
        }
    };

    const addProductToBasket = () => {
        dispatch(addProductIntoBasket(currentProduct, productCountToBuy));
        toast.success(`${currentProduct.name} ${productCountToBuy} шт. додано в кошик!`);
    };

    const deleteProductHandler = () => {
        if (window.confirm('Ви впевнені, що хочете видалити цей продукт?')) {
            dispatch(deleteProduct(currentProduct.id));
        }
    };

    if (currentProduct == null) {
        return (<><Container><h1>Такого товару не існує</h1></Container></>);
    }

    const buttonsForUser = () => {
        return (
            <>
                <Container className="p-0 mt-1">
                    <Row>
                        <Form className="w-100">
                            <InputGroup>
                                <Button variant="outline-secondary" onClick={reduceProductToBuy}>-</Button>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={productCountToBuy}
                                    style={{ textAlign: 'center' }}
                                />
                                <Button variant="outline-secondary" onClick={addProductToBuy}>+</Button>
                            </InputGroup>
                        </Form>
                    </Row>
                </Container>
                <Button className="w-100 mt-1" onClick={addProductToBasket}>
                    Додати у кошик
                </Button>
            </>
        );
    };

    const buttonsForAdmin = () => {
        return (
            <>
                {/* <Button className="w-100 mt-1" variant="warning">
                    Редагувати
                </Button> */}
                <Button className="w-100 mt-1" variant="danger" onClick={deleteProductHandler}>
                    Видалити
                </Button>
            </>
        );
    };

    return (
        <Container>
            <h1>{currentProduct?.name}</h1>
            <Row>
                <Col md={4}>
                    <Image src={currentProduct?.mainImage} className="w-100" rounded />
                    {currentUser?.isAdmin ? buttonsForAdmin() : buttonsForUser()}
                </Col>
                <Col md={8}>
                    <p style={{ textAlign: 'justify' }}>{currentProduct?.fullDescription}</p>
                    <div
                        style={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: 'gray',
                            margin: '10px 0px',
                        }}
                    ></div>
                    <p>Категорія: {productCategoryName} | Ціна: {currentProduct?.price} грн.</p>
                    { error != null ? <Alert variant="danger">{error}</Alert> : ""}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage;