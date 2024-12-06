const initialState = {
    order: null,
    orders: [],
    error: null,
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_ORDER':
            return {
                ...state,
                order: action.payload,
                error: null,
            };
        case 'CREATE_ORDER_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'REMOVE_LAST_ORDER':
            return {
                ...state,
                order: null,
                error: null,
            };
        case 'GET_ORDERS_BY_USER_ID':
            return {
                ...state,
                orders: action.payload,
                error: null,
            };
        case 'GET_ORDERS_BY_USER_ID_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'GET_ALL_ORDERS':
            return {
                ...state,
                orders: action.payload,
            };
        case 'GET_ALL_ORDERS_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'UPDATE_ORDER_STATUS':
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.id ? { ...order, status: action.payload.status } : order
                ),
                error: null,
            };
        case 'UPDATE_ORDER_STATUS_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default orderReducer;
