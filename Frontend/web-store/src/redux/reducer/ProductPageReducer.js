const initialState = {
    productCategoryId: null, 
    pageNumber: 1,
    sortBy: 0,
    totalPageCount: null,
    products: null,
    hasNext: false,
    loading: false,
    error: null
};

export const productPageReducer = (state = initialState, action) => {
    console.log(`Action: ${action.type}`, action);
    console.log("State before action:", state);

    let newState;

    switch (action.type) {
        case 'GET_PRODUCT_PAGE_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'GET_PRODUCT_PAGE_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                products: action.products,
                pageNumber: action.pageNumber,
                sortBy: action.sortBy, 
                hasNext: action.isHasNext,
                totalPageCount: action.totalPageCount,
                productCategoryId: action.productCategoryId
            };
        case 'GET_PRODUCT_PAGE_ERROR':
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case 'SET_SORT_TYPE':
            return {
                ...state,
                sortBy: action.sortBy
            };
        case 'MOVE_NEXT_PAGE':
            return {
                ...state,
                pageNumber: state.pageNumber + 1
            };
        case 'MOVE_PREV_PAGE':
            return {
                ...state,
                pageNumber: state.pageNumber - 1
            };
        case 'SET_PAGE_NUMBER':
            return {
                ...state,
                pageNumber: action.payload
            };
        default:
            newState = state;
    }

    console.log("State after action:", newState);

    return newState;
};