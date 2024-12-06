import React, { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchProductCategories, setCurrentProductCategory } from '../../redux/action/ProductCategoryAction';
import ProductCategoriesCard from './ProductCategoriesCard.jsx';
import Container from 'react-bootstrap/Container';

const ProductCategories = () => 
{
  console.log('ProductCategories component rendered');

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.productCategory);

  //Завантажуємо категорії під час монтування компонента
  useEffect(() => {
    console.log('useEffect triggered');
    dispatch(fetchProductCategories());
  }, [dispatch]);

  if (loading) return <div className="d-flex justify-content-center">Loading categories...</div>;
  if (error) return <div className="d-flex justify-content-center">Error occured while fetching categories: {error}</div>;

  if (categories.length > 0)
  {
    return (
      <Container>
            <div className="d-flex flex-wrap justify-content-center">
              {categories.map((category) => <ProductCategoriesCard key={category.id} category={category}/>)}
            </div>
      </Container>
    );
  }
};

export default ProductCategories;