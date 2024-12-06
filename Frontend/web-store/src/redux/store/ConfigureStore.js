import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { basketReducer } from "../reducer/BasketReducer";
import { productCategoryReducer } from "../reducer/ProductCategoryReducer";
import { productReducer } from "../reducer/ProductReducer";
import { productPageReducer } from "../reducer/ProductPageReducer";
import { userReducer } from "../reducer/UserReducer";
import  orderReducer from "../reducer/OrderReducer";

const basketPersistConfig = {
    key: 'basket',
    storage,
};

const persistedBasketReducer = persistReducer(basketPersistConfig, basketReducer);

const rootReducer = combineReducers({
    basket: persistedBasketReducer,
    order: orderReducer,
    productCategory: productCategoryReducer,
    product: productReducer,
    productPage: productPageReducer,
    user: userReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);
export default store;