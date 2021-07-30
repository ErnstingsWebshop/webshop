import React, {useState, useEffect} from 'react';
import {CssBaseline} from '@material-ui/core';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Navbar, Products, Cart, Filters} from './components';
import {commerce} from './lib/commerce';
import {Filter} from "@material-ui/icons";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from "@material-ui/styles";

// Import the MongoDB Realm Web SDK
import * as Realm from "realm-web";

// Connect to your MongoDB Realm app
/*const REALM_APP_ID = "webapplication-yoqap"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });*/
window.results = {
    id: null,
    startTime: new Date()
};

const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [filterState, setfitlerState] = useState({
            men : false,
            women: false,
            kids: false,
            s: false,
            m: false,
            l: false,
            xl: false,
            sustainable: false
    });


    const [errorMessage, setErrorMessage] = useState('');


    const fetchProducts = async () => {
        const {data} = await commerce.products.list({
            limit:70,
        });
        setProducts(data);
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    };

    const filterProducts = async (keys) => {
        const keyArr = Object.keys(keys).reduce((acc, key) => {
            if (keys[key]) {
                acc.push(key);
            }
            return acc;
        },[]);
        const {data} = await commerce.products.list({
            category_slug: keyArr,
            limit:70,
        });
        setProducts(data);
    };

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);

        setCart(item.cart);
    };

    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, {quantity});

        setCart(response.cart);
    };

    const handleRemoveFromCart = async (lineItemId) => {
        const response = await commerce.cart.remove(lineItemId);

        setCart(response.cart);
    };

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();

        setCart(response.cart);
    };

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    };

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);

            refreshCart();
        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const theme = createMuiTheme({
        typography: {
            h5: {
                fontWeight: 500,
            },
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <Router>
            <div style={{display: 'flex'}}>
                <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle}/>
                <Switch>
                    <Route exact path="/webshop">
                        <Filters filterProducts={filterProducts} keys={filterState}/>
                        <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty/>
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}
                              onEmptyCart={handleEmptyCart}/>
                    </Route>
                </Switch>
                </ThemeProvider>
            </div>
        </Router>
    );
};

export default App;
