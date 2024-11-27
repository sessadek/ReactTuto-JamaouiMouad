export default function productReducer (state, action) {
    switch (action.type) {
        case 'ERROR':
            return {
                ...state,
                error: action.error
            }
        case 'LOADING':
            return {
                ...state,
                loading: action.loading
            }
        case 'PRODUCTS':
            return {
                ...state,
                productList: action.productList
            }
        case 'CATEGORIES':
            return {
                ...state,
                categoryList: action.categoryList
            }
        default:
            return state;
    }
};