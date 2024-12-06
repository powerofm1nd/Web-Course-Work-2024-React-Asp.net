import React, { useEffect, useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductCategories } from '../../redux/action/ProductCategoryAction';
import { createProduct } from '../../redux/action/ProductAction';
import { useNavigate } from 'react-router-dom';
import styles from './AddProduct.module.css'; 

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.productCategory);
    const { currentProduct } = useSelector((state) => state.product);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductCategories());
    }, [dispatch]);

    useEffect(() => {
        if (currentProduct?.id) {
            navigate(`/product/${currentProduct.id}`);
        }
    }, [currentProduct, navigate]);

    const [product, setProduct] = useState({
        name: '',
        fullDescription: '',
        shortDescription: '',
        price: '',
        mainImage: '',
        productCategoryId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    mainImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createProduct(product));
    };

    return (
        <Container className={styles.container}>
            <h1 className={styles.title}>Додати товар</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className={`${styles.formGroup}`} controlId="formProductName">
                    <Form.Label className={styles.label}>Назва товару:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введіть назву товару"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className={styles.input}
                    />
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="formFullDescription">
                    <Form.Label className={styles.label}>Повний опис товару:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Введіть повний опис товару"
                        name="fullDescription"
                        value={product.fullDescription}
                        onChange={handleChange}
                        required
                        maxLength={2000}
                        className={`${styles.input} ${styles.textarea}`}
                    />
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="formShortDescription">
                    <Form.Label className={styles.label}>Короткий опис товару:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Введіть короткий опис товару"
                        name="shortDescription"
                        value={product.shortDescription}
                        onChange={handleChange}
                        required
                        maxLength={250}
                        className={`${styles.input} ${styles.textarea}`}
                    />
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="formPrice">
                    <Form.Label className={styles.label}>Ціна товару:</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        placeholder="Введіть ціну товару"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="formMainImage">
                    <Form.Label className={styles.label}>Зображення товару:</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                    />
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="formProductCategoryId">
                    <Form.Label className={styles.label}>Категорія товару:</Form.Label>
                    <Form.Select
                        name="productCategoryId"
                        value={product.productCategoryId}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Оберіть категорію</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button className={styles.submitButton} variant="primary" type="submit">Додати товар</Button>
            </Form>
        </Container>
    );
};

export default AddProduct;