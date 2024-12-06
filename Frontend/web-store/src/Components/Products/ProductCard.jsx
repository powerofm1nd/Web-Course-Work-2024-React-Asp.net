import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ProductCard = ({ product }) => {
    const handleDetailsClick = () => {
        window.open(`/product/${product.id}`, '_blank');
    };
    
    return (
        <Card style={{ width: '17rem', margin: '5px', minWidth: '305px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative' }}>
                <Card.Img variant="top" src={product.mainImage} />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 140, 23, 0.9)',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    zIndex: 1
                }}>
                    {product.price} грн
                </div>
            </div>
            <Card.Body className="card-body-custom" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <div>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text style={{ textAlign: 'justify' }}>{product.shortDescription}</Card.Text>
                </div>
                <Button variant="primary w-100 mt-3" onClick={handleDetailsClick}>Детальніше</Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
