import React, {useState, useEffect} from 'react';
import {CssBaseline} from '@material-ui/core';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Navbar, Products, Cart, Filters} from './components';
import {commerce} from './lib/commerce';
import {Filter} from "@material-ui/icons";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from "@material-ui/styles";
import ScriptTag from 'react-script-tag';
// Import the MongoDB Realm Web SDK
import * as Realm from "realm-web";
import './styles.css';

// Connect to your MongoDB Realm app
/*const REALM_APP_ID = "webapplication-yoqap"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });*/
window.results = {
    id: null,
    group: null,
    startTime: new Date()
};
window.GROUPS = {
    ANFLVF:0,
    WBXIPB:1,
    NQQIPD:2,
    LLIBWR:3,
    UMUCAF:4,
    PXAMYY:5,
    ZUWTNW:6,
    LFXPVV:7,
    PRJJGN:8,
    DHHDTV:9,
    GWUVLU:10,
    KTIHKA:11,
    IVFQNT:12,
    VSABJG:13,
    IBVAUJ:14,
    AZDWTR:15,
    KXXNMZ:16,
    OACIJP:17,
    UYKREI:18,
    WBDUWM:19,
    WVXFNB:20,
    ETUZIS:21,
    LHOUNM:22,
    WDQGIM:23,
    GYJYZG:24,
    SCEFYK:25,
    SIPLQW:26,
    BIQOOT:27,
    NGLRPX:28,
    NSDJPY:29
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
        if(window.results.group) {
            const {data} = await commerce.products.list({
                limit: 150,
            });
            shuffleProducts(data);
            adjustPrices(data);
            setProducts(data);
        } else {
            setTimeout(fetchProducts,800);
        }
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
            limit:100,
        });
        shuffleProducts(data);
        adjustPrices(data);
        setProducts(data);
    };

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        const lineItems = item.cart.line_items;
        adjustPrices(lineItems);
        setCart(item.cart);
    };

    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, {quantity});
        const lineItems = response.cart.line_items;
        adjustPrices(lineItems);
        setCart(response.cart);
    };

    const handleRemoveFromCart = async (lineItemId) => {
        const response = await commerce.cart.remove(lineItemId);
        const lineItems = response.cart.line_items;
        adjustPrices(lineItems);
        setCart(response.cart);
    };

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();

        setCart(response.cart);
    };

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        const lineItems = newCart.line_items;
        adjustPrices(lineItems);
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

    const shuffleProducts = (products) => {
        var currentIndex = products.length,  randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [products[currentIndex], products[randomIndex]] = [
                products[randomIndex], products[currentIndex]];
        }

        return products;
    };

    const adjustPrice = (product) => {

        var baseline, correctionFactor, percentageInc, priceAdjustment;

        // While there remain elements to shuffle...
        product.price.raw = 100;
        product.price.formatted =  product.price.raw.toString();
        //product.price.formatted = product.price.raw.toString();

        return product;
    };

    const adjustPrices = (products) => {

        var priceAdjustment, priceAdjustmentFactors, productAttributes;
        var groupNR = getGroupNR(window.results.group);
        // While there remain elements to shuffle...
        products.map(product => {
            product.attributes ? productAttributes = product.attributes[0].value : productAttributes = product.sku;
            if(productAttributes.includes("S")) {
                priceAdjustmentFactors = extractValues(productAttributes);
                priceAdjustment = priceAdjustmentFactors[2] / (product.price.raw - (product.price.raw - priceAdjustmentFactors[2]) * priceAdjustmentFactors[1]);
                product.price.raw = roundPrice(product.price.raw + (product.price.raw * priceAdjustment * (groupNR - 1) * priceAdjustmentFactors[0]));
                product.price.formatted = product.price.raw.toString();
            }
        });
        return products;
    };

    const extractValues = (productID) => {
        var values = productID.match(/.{1,3}/g);
        var val3 = productID.substr(6, 4);
        var val4 = productID.substr(10, 3);
        return [addDotFirstSpot(values[0])/100,addDotFirstSpot(values[1]),addDotSecondSpot(val3),addDotFirstSpot(val4)];
    };

    const getGroupNR = (groupID) => {
      return window.GROUPS[groupID];
    };

    const addDotFirstSpot = (string) => {
        const pair = Array.from(string)
        pair.splice(1, 0, '.');
        const joinedPair = pair.join('');
        const floatNumber = parseFloat(joinedPair);
        return floatNumber;
    };

    const addDotSecondSpot = (string) => {
        const pair = Array.from(string)
        pair.splice(2, 0, '.');
        const joinedPair = pair.join('');
        const floatNumber = parseFloat(joinedPair);
        return floatNumber;
    };

    const roundPrice = (num) => {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return roundOnCleanNumber(Math.round(m) / 100 * Math.sign(num));
    };
    const roundOnCleanNumber = (num) => {
      return Math.round(num*2)/2 - 0.01;
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
