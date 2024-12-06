export const addProductIntoBasket = (product, count) => {
    return {
        type: "ADD_PRODUCT_INTO_BASKET",
        payload: { product, count }
    }
}

export const clearBasket = () => {
    return {
        type: "CLEAR_BASKET"
    }
}

export const removeProductFromBasket = (product) => {
    return {
        type: "REMOVE_PRODUCT_FROM_BASKET",
        payload: product
    }
}