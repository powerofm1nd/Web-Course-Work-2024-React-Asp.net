export const registerNewUser = (user) => {
    return async (dispatch) => {
        console.log('Calling API to register user');
        try {
            const response = await fetch('https://localhost:7106/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            });


            if (!response.ok) {
                const responseBody = await response.text();
                console.error("Error response body: ", responseBody);

                console.log("Cookies after registration response:", document.cookie);

                throw new Error(`Error: ${responseBody}`);
            }

            const userFromDb = await response.json();
            console.log("RegisterNewUser RESPONSE:", userFromDb);

            console.log("Cookies after successful registration:", document.cookie);

            dispatch({
                type: 'REGISTER_NEW_USER',
                payload: userFromDb,
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            dispatch({
                type: 'REGISTER_NEW_USER_ERROR',
                register_error: error.message || error,
            });
        }
    };
};

export const getUser = (user) => {
    return async (dispatch) => {
        console.log('Calling API to get user');

        dispatch({ type: 'GET_USER_LOADING', loading: true });

        try {
            const response = await fetch('https://localhost:7106/api/auth/currentUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            });

            if (!response.ok) {
                const responseBody = await response.text();
                console.error("Error response body: ", responseBody);

                console.log("Cookies after error getting user:", document.cookie);

                throw new Error(`Error: ${responseBody}`);
            }

            const userFromDb = await response.json();

            dispatch({
                type: 'GET_USER',
                payload: userFromDb,
            });
        } catch (error) {
            console.error('Error during user getting:', error);

            dispatch({
                type: 'GET_USER_ERROR',
                get_user_error: error.message || error,
            });
        } finally {
            dispatch({ type: 'GET_USER_LOADING', loading: false });
        }
    };
};

export const logout = () => {
    return async (dispatch) => {
        console.log('Calling API to logout');

        try {
            const response = await fetch('https://localhost:7106/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const responseBody = await response.text();
                console.error("Error response body: ", responseBody);

                console.log("Cookies after error getting user:", document.cookie);

                throw new Error(`Error: ${responseBody}`);
            }

            const logout = await response.json();
            console.log("Logout RESPONSE:", logout);

            dispatch({
                type: 'LOGOUT_USER'
            });
        } catch (error) {
            console.error('Error during logout process:', error);
        }
    };
};

export const login = (user) => {
    return async (dispatch) => {
        try {
            const response = await fetch('https://localhost:7106/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            });

            if (!response.ok) {
                const responseBody = await response.text();
                throw new Error(`Error: ${responseBody}`);
            }

            const userFromDb = await response.json();

            dispatch({ type: 'AUTH_USER', payload: userFromDb, });
        } catch (error) {
            dispatch({
                type: 'AUTH_USER_ERROR',
                register_error: error.message || error,
            });
        }
    };
};

export const authUser = (user) => {
    return async (dispatch) => {
        console.log('Calling API to auth user');
        try {
            const response = await fetch('https://localhost:7106/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            });


            if (!response.ok) {
                const responseBody = await response.text();
                console.error("Error response body: ", responseBody);

                console.log("Cookies after auth response:", document.cookie);


                throw new Error(`Error: ${responseBody}`);
            }

            const userFromDb = await response.json();
            console.log("AuthUser RESPONSE:", userFromDb);

            console.log("Cookies after successful authorization:", document.cookie);

            dispatch({
                type: 'AUTH_USER',
                payload: userFromDb,
            });
        } catch (error) {
            console.error('Error during user authorization:', error);
            dispatch({
                type: 'AUTH_USER_ERROR',
                register_error: error.message || error,
            });
        }
    };
};