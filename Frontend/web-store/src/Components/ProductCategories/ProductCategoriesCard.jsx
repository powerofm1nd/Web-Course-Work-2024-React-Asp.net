import { useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { setCurrentProductCategory } from '../../redux/action/ProductCategoryAction';
import { setPageNumber } from '../../redux/action/ProductPageAction';

const ProductCategoriesCard = ({ category }) => {
  const dispatch = useDispatch();

  return (
    <Card style={{ width: '17rem', margin: '5px', minWidth: '305px' }}>
      <Card.Img variant="top" src={"data:image/png;base64," + category.image} />
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <Card.Text style={{ textAlign: 'justify' }}>{category.description}</Card.Text>
        <Button
          variant="primary w-100"
          onClick={() => {
            dispatch(setPageNumber(1));
            dispatch(setCurrentProductCategory(category.id));
          }}
        >
          Показати
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCategoriesCard;
