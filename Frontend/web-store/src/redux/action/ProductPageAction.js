export const getPageProduct = (productCategoryId, pageNumber, sortBy) => {
    return async (dispatch) => {
        dispatch({ type: 'GET_PRODUCT_PAGE_REQUEST' });

        try {
            const response = await fetch(`https://localhost:7106/api/product/getPage?productCategoryId=${productCategoryId}&pageNumber=${pageNumber}&sortBy=${sortBy}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`);
            }

            const productFromDb = await response.json();

            dispatch({
                type: 'GET_PRODUCT_PAGE_SUCCESS',
                products: productFromDb.productsOnPage,
                isHasNext: productFromDb.isHasNext,
                pageNumber: productFromDb.currentPageNumber,
                sortBy: productFromDb.sortBy, 
                hasNext: productFromDb.isHasNext,
                totalPageCount: productFromDb.totalPageCount,
                productCategoryId: productFromDb.category.id
            });
        } catch (error) {
            dispatch({
                type: 'GET_PRODUCT_PAGE_ERROR',
                error: error.message,
            });
        }
    };
};

export const setSortType = (newSortBy) =>
{
    return {
        type: "SET_SORT_TYPE",
        sortBy: newSortBy
    }
} 

export const moveNextPage = () =>
{
    return {
        type: "MOVE_NEXT_PAGE"
    }
}

export const movePrevPage = () =>
{
    return {
        type: "MOVE_PREV_PAGE"
    }
}

export const setPageNumber = (pageNumber) =>
{
    return {
        type: "SET_PAGE_NUMBER",
        payload: pageNumber,
    }
}