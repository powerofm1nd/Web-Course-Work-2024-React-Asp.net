const initialState = {
    categories: [],               
    currentCategory: null,
    loading: false,               
    error: null                   
};

export const productCategoryReducer = (state = initialState, action) => {
    console.log(`Action: ${action.type}`, action);
    console.log("State before action:", state);

    let nextState; 

    switch (action.type) {
        case 'FETCH_PRODUCT_CATEGORIES_REQUEST':
            nextState = {
                ...state,
                loading: true,
            };
            break;
        case 'FETCH_PRODUCT_CATEGORIES_SUCCESS':
            nextState = {
                ...state,
                loading: false,
                categories: action.payload,
                currentCategory: action.payload[0],
            };
            break;
        case 'FETCH_PRODUCT_CATEGORIES_FAILURE':
            nextState = {
                ...state,
                loading: false,
                error: action.error,
            };
            break;
        case 'SET_CURRENT_PRODUCT_CATEGORY':
            nextState = {
                ...state,
                currentCategory: state.categories.filter(x => x.id === action.newId)[0]
            };
            break;
        default:
            nextState = state;  
    }

    console.log("State after action:", nextState);

    return nextState;
};
