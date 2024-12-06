export const createOrder = (orderItems) => {
    return async (dispatch) => {
        try {
            const response = await fetch('https://localhost:7106/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify(orderItems),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const createdOrder = await response.json();

            dispatch({
                type: 'CREATE_ORDER',
                payload: createdOrder,
            });
        }
        catch (error) {
            console.error('Error creating order:', error);
            dispatch({
                type: 'CREATE_ORDER_ERROR',
                payload: error.message,
            });
        }
    };
};

export const removeLastOrder = () => 
{
    return {
        type: "REMOVE_LAST_ORDER"
    }
}

export const getOrdersByUserId = (userId) => 
{
    return async (dispatch) => {
        try 
        {
            const response = await fetch(`https://localhost:7106/api/order/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            });

            if (!response.ok) {
                throw new Error('Failed to get orders');
            }

            const orders = await response.json();

            dispatch({
                type: 'GET_ORDERS_BY_USER_ID',
                payload: orders,
            });
        }
        catch (error) {
            console.error('Error creating order:', error);
            dispatch({
                type: 'GET_ORDERS_BY_USER_ID_ERROR',
                payload: error.message,
            });
        }
    };
}

export const getAllOrders = () => 
{
    return async (dispatch) => {
        try 
        {
            const response = await fetch(`https://localhost:7106/api/order/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            });

            if (!response.ok) {
                throw new Error('Failed to get orders');
            }

            const orders = await response.json();

            dispatch({
                type: 'GET_ALL_ORDERS',
                payload: orders,
            });
        }
        catch (error) {
            console.error('Error creating order:', error);
            dispatch({
                type: 'GET_ALL_ORDERS_ERROR',
                payload: error.message,
            });
        }
    };
}

export const updateOrderStatus = (orderId, newStatus) => {
    return async (dispatch) => {
        try {
            const response = await fetch('https://localhost:7106/api/order/updateStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    OrderId: orderId,
                    NewStatus: newStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrder = await response.json();


            dispatch({
                type: 'UPDATE_ORDER_STATUS',
                payload: updatedOrder,
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            dispatch({
                type: 'UPDATE_ORDER_STATUS_ERROR',
                payload: error.message,
            });
        }
    };
};