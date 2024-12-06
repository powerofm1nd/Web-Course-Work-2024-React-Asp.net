const initialState = {
    products: [],
};

export const basketReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PRODUCT_INTO_BASKET":
        {
            const newProduct = action.payload.product;
            const productIndex = state.products.findIndex(p => p.id === newProduct.id);

            if (productIndex !== -1) {
                const updatedProducts = [...state.products];
                updatedProducts[productIndex] = {
                    ...updatedProducts[productIndex],
                    count: updatedProducts[productIndex].count + action.payload.count,
                };
                return { ...state, products: updatedProducts };
            }
            else 
            {
                return { ...state, products: [...state.products, {...newProduct, count: action.payload.count}] };
            }
        }
        case "CLEAR_BASKET":
            return { ...state, products: [] };
        case "REMOVE_PRODUCT_FROM_BASKET":
        {
            const productToDelete = action.payload;
            const productIndex = state.products.findIndex(p => p.id === productToDelete.id);
            
            if (productIndex !== -1) {
                let updatedProducts = [...state.products];
                updatedProducts.splice(productIndex, 1);
                return { ...state, products: updatedProducts };
            }
            else 
            {
                return { state };
            }
        }
        default:
            return state;
    }
};
