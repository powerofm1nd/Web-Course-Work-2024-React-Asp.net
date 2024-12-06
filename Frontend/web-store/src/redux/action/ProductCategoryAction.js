export const fetchProductCategories = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_PRODUCT_CATEGORIES_REQUEST' });
    try {
      const response = await fetch('https://localhost:7106/api/product/categories');
      const products = await response.json();
      dispatch({ type: 'FETCH_PRODUCT_CATEGORIES_SUCCESS', payload: products });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCT_CATEGORIES_FAILURE', error: error.message });
    }
  };
};

export const setCurrentProductCategory = (categoryId) => {
  return {
    type: 'SET_CURRENT_PRODUCT_CATEGORY',
    newId: categoryId
  }
};