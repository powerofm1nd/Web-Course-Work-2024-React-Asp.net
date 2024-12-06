import { useDispatch } from "react-redux";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { addProductIntoBasket, removeProductFromBasket } from '../../redux/action/BasketAction';

const BasketItem = ({product}) => {
    const dispatch = useDispatch();

    const addProductToBuy = (() => 
    {
        dispatch(addProductIntoBasket(product, 1))
    })

    const reduceProductToBuy = (() => 
    {
        if (product.count > 1)
        {
            dispatch(addProductIntoBasket(product, -1))
        }
    })

    return (
        <Row className="align-items-center my-3">
            <Col md={2} className="text-center">
                <Image 
                    src={product.mainImage} 
                    rounded 
                    style={{ maxWidth: '150px', height: 'auto' }} 
                    alt={product.name} 
                />
            </Col>
            <Col md={5} className="d-flex flex-column">
                <h5 className="mb-1"><a href={"product/" + product.id}>{product.name}</a></h5>
                <h3 className="text-muted">{product.price} грн за 1 шт.</h3>
            </Col>
            <Col md={5}>
                <div className="d-flex flex-column align-items-center">
                    <div className="d-flex align-items-center mb-2">
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="me-2"
                            onClick={reduceProductToBuy}
                        >
                            -
                        </Button>
                        <span className="mx-2">{product.count}</span>
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="ms-2"
                            onClick={addProductToBuy}
                        >
                            +
                        </Button>
                    </div>
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="mt-2"
                        onClick={()=>
                        { 
                            dispatch(removeProductFromBasket(product))
                        }}
                    >
                        Видалити з кошику
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default BasketItem;