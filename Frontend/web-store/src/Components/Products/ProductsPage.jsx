import { useSelector, useDispatch } from "react-redux";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect } from "react";
import { getPageProduct, setSortType, moveNextPage, movePrevPage } from '../../redux/action/ProductPageAction';
import ProductCard from "./ProductCard";
import { Button } from "react-bootstrap";

const ProductsPage = () => 
{
    const dispatch = useDispatch();
    const { pageNumber, sortBy, products, hasNext, loading, error } = useSelector((state) => state.productPage);
    const { currentCategory } = useSelector((state) => state.productCategory);

    const scrollToHeadline = () => {
        const headlineElement = document.getElementById('productsHeadline');
        if (headlineElement) {
          headlineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        dispatch(getPageProduct(currentCategory?.id, pageNumber, sortBy))
    }, [dispatch, currentCategory, sortBy, pageNumber]);

    useEffect(() => {
        if (!loading)
        {
            scrollToHeadline()
        }
    }, [loading]);

    const funcHandleOnChangeSortType = (e) => {
        dispatch(setSortType(e.target.value))
    };

    if (loading) return (<Container><h1>The page with products is loading!</h1></Container>);
    if (error) return (<Container><h1>An error has occurred while loading products!</h1></Container>);

    return (
        <Container>
            <Row>
                <Col md={9}>
                    <h1 id="productsHeadline" className="mt-4 mb-4">
                        {currentCategory?.name}
                    </h1>
                </Col>
                <Col md={3}>
                    <Form.Select
                        className="mt-5 mb-4"
                        onChange={funcHandleOnChangeSortType}
                        value={sortBy} 
                    >
                        <option value="0">Сортування за зростанням ціни</option>
                        <option value="1">Сортування за спаданням ціни</option>
                    </Form.Select>
                </Col>
            </Row>
            <div className="d-flex flex-wrap justify-content-center">
                { products?.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            <Row className="mt-3">
                <Col md={5} className="d-flex flex-wrap justify-content-end">
                    <Button disabled={pageNumber === 1} onClick={()=>{dispatch(movePrevPage())}}>&lt;</Button>
                </Col>
                <Col md={2} className="d-flex flex-wrap justify-content-center">
                    <h3>{pageNumber}</h3>
                </Col>
                <Col md={5} className="d-flex flex-wrap justify-content-start">
                    <Button disabled={!hasNext} onClick={()=>{dispatch(moveNextPage())}}>&gt;</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductsPage;