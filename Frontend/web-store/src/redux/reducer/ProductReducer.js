const initialState = {
    currentProduct: null,
    loading: false,
    error: null,
};

export const productReducer = (state = initialState, action) => {
    console.log(`Action: ${action.type}`, action);
    console.log("State before action:", state);

    let newState;

    switch (action.type) {
        case 'CREATE_PRODUCT':
            newState = {
                ...state,
                currentProduct: action.newProduct,
            };
            break;
        case 'GET_PRODUCT_REQUEST':
            newState = {
                ...state,
                loading: true,
                error: null,
            };
            break;
        case 'GET_PRODUCT_SUCCESS':
            newState = {
                ...state,
                currentProduct: action.newCurrentProduct,
                loading: false,
                error: null,
            };
            break;
        case 'GET_PRODUCT_ERROR':
            newState = {
                ...state,
                loading: false,
                error: action.error,
            };
            break;

        case 'DELETE_PRODUCT_REQUEST':
            newState = {
                ...state,
                loading: true,
                error: null,
            };
            break;

        case 'DELETE_PRODUCT_SUCCESS':
            newState = {
                ...state,
                loading: false,
                error: null,
                currentProduct: null,
            };
            break;

        case 'DELETE_PRODUCT_ERROR':
            newState = {
                ...state,
                loading: false,
                error: action.error,
            };
            break;

        default:
            newState = state;
    }

    console.log("State after action:", newState);

    return newState;
};