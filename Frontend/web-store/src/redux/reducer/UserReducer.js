const initialState = {
    currentUser: null,          
    register_error: null,       
    auth_error: null,           
    get_user_error: null,       
    loading: false              
};

export const userReducer = (state = initialState, action) => {
    console.log(`Action: ${action.type}`, action); 
    console.log("State before action:", state);

    let newState = { ...state };

    switch (action.type) {
        case 'AUTH_USER':
            newState.currentUser = action.payload; 
            newState.auth_error = null; 
            break;
        case 'AUTH_USER_ERROR':
            newState.auth_error = action.auth_error; 
            newState.currentUser = null;
            break;
        case 'REGISTER_NEW_USER':
            newState.currentUser = action.payload;
            newState.register_error = null; 
            break;
        case 'REGISTER_NEW_USER_ERROR':
            newState.register_error = action.register_error; 
            newState.currentUser = null;
            break;
        case 'GET_USER':
            newState.currentUser = action.payload; 
            newState.get_user_error = null;
            break;
        case 'GET_USER_ERROR':
            newState.get_user_error = action.get_user_error; 
            break;
        case 'GET_USER_LOADING':
            return {
                ...state,
                loading: action.loading,
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                currentUser: null,
                register_error: null,
                get_user_error: null,       
                loading: false
            };
        default:
            return state;
    }

    console.log("State after action:", newState); 
    return newState;
};