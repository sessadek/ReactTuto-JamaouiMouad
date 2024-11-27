import { useEffect, useReducer, useState } from "react";

import ProductRow from "./ProductRow";

import INIT_STATE from "./productState";

import productReducer from "./productReducer";

/**
 * useFetch Custom Hook
 */
// Custom hook using reducer

/**
 * 
 * @param {string} url 
 * @param {string} type 
 * @returns 
 */
const useFetch = (url, type = 'PRODUCTS') => {
    const [productState, dispatch] = useReducer(productReducer, INIT_STATE);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'LOADING' });

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.url} not found`);
                }
                const result = await response.json();

                // Dispatch the fetched data to the reducer
                if (type === 'PRODUCTS') {
                    dispatch({ type: 'PRODUCTS', productList: result });
                } else if (type === 'CATEGORIES') {
                    dispatch({ type: 'CATEGORIES', categoryList: result });
                }
            } catch (error) {
                dispatch({ type: 'ERROR', error: error.message });
            }
        };

        if (url) {
            fetchData();
        }
    }, [url, type]);

    return productState; // Returns the state (loading, error, products, categories)
};




/**
 * 
 * @returns 
 */
export default function ProductList() {

    const [search, setSearch] = useState(null);
    const [searchByCategory, setSearchByCategory] = useState(null);
    let [resetProductList, setResetProductList] = useState(false);

    /**
     * Reducer
     */
    // const [productState, dispatch] = useReducer(productReducer, INIT_STATE);

    /**
     * useFetch Custom Hook
     */

    const { loading, error, productList } = useFetch('https://fakestoreapi.com/products');

    const { categoryList } = useFetch('https://fakestoreapi.com/products/categories', 'CATEGORIES');


    const displayProduct = () => {
        if(productList.length) {
            var tempProductList = productList;
            if(search) {
                tempProductList = tempProductList.filter((product) => product.title.includes(search) || product.description.includes(search));
            }
            if(searchByCategory) {
                tempProductList = tempProductList.filter((product) => product.category === searchByCategory);
            }
            if(resetProductList && productList.length > tempProductList.length) {
                setResetProductList(false);
                return productList.map((product, key) => <ProductRow product={product} key={key} />);
            }
            if(tempProductList.length > 0) {
                return tempProductList.map((product, key) => <ProductRow product={product} key={key} />);
            }
            return <tr><td colSpan={7}>No Items after Filter</td></tr>
        }
        return <tr><td colSpan={7}>No Items in the API</td></tr>
    };

    const displayCategory = () => {
        if(categoryList.length) {
            return categoryList.map((category, key) => <button className={ category === searchByCategory ? "is-active" : "" } onClick={handleFilterByCategory} key={key}>{category}</button>);
        }
        return <div className="alert alert-danger">has no categories</div>
    };

    /**
     * 
     * @param {Event} e 
     */
    const handleSearch = (e) => {
        e.preventDefault();
        const searchInput = document.querySelector('#search').value;
        setSearch(searchInput);
    }

    /**
     * 
     * @param {Event} e 
     */
    const handleFilterByCategory = (e) => {
        setSearchByCategory(e.target.innerText);
        
    }

    /**
     * 
     * @param {Event} e 
     */
    const handleReset = (e) => {
        e.preventDefault();
        setResetProductList(true);
        setSearch(null);
        setSearchByCategory(null);
        document.querySelector('#search').value = '';
    }

    /**
     * 
     */
    useEffect(() => {

    }, []);

    /**
     * 
     */
    return (
        <div className="container my-4">
            {loading && <div className="d-flex align-items-center">
                <strong role="status">Loading...</strong>
                <div className="spinner-border ms-auto" aria-hidden="true"></div>
                </div>
            }
            {error && <div className="alert alert-danger">{error}</div> }
            <h1>Page Product List : </h1>
            <form>
                <input type="text" id="search"/>
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleReset}>Reset</button>
            </form>
            <div>
            { displayCategory() }
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    { displayProduct() }
                </tbody>
            </table>
        </div>
    )
}