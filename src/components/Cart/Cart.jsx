import React, {useEffect, useState} from 'react';
import {Button, Container, Grid, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {commerce} from './../../lib/commerce';

import CartItem from './CartItem/CartItem';
import useStyles from './styles';
import axios from 'axios';
import ThankYou from "../Modal/ThankYou";


const Cart = ({cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleEmptyCart = () => onEmptyCart();
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    const renderProducts = async () => {
        if (cart.line_items) {
            const data = await Promise.all(cart.line_items.map(async (item) => {
               return item;
             //   return commerce.products.retrieve(item.product_id);
            }));
            setProducts(data);
        }
    };
    const calcSubtotal = async () => {
        var subtotal = 0;
        if (cart.line_items) {
            cart.line_items.forEach((item) => {
                subtotal+=item.price.raw*item.quantity;
                //   return commerce.products.retrieve(item.product_id);
            });
            setSubtotal(roundPrice(subtotal));
        }
    };
    const roundPrice = (num) => {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    };
    const renderEmptyCart = () => (
        <div>
            <Typography variant="subtitle1">You have no items in your shopping cart,
                <Link className={classes.link} to="/webshop"> start adding some</Link>!
            </Typography>
            <Button className={classes.checkoutButtonEmptyCart} size="large" type="button" variant="contained"
                    color="primary" component={Link} to="/webshop">Back</Button>
            <Button className={classes.checkoutButtonEmptyCart} onClick={handleOpen} size="large"
                    type="button" variant="contained" color="primary">Checkout</Button>
        </div>
    );

    useEffect(() => {
        renderProducts();
        calcSubtotal();
    }, cart.line_items);

    if (!cart.line_items) return 'Loading';

    const renderCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((lineItem, index) => (
                    <Grid item xs={12} sm={4} key={lineItem.id}>
                        <CartItem product={products[index]} item={lineItem} onUpdateCartQty={onUpdateCartQty}
                                  onRemoveFromCart={onRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">Subtotal: {subtotal}€</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained"
                            color="primary" component={Link} to="/webshop">Back</Button>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained"
                            color="secondary" onClick={handleEmptyCart}>Empty cart</Button>
                    <Button className={classes.checkoutButton} onClick={handleOpen} size="large"
                            type="button" variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    );


    const handleOpen = async () => {
        let productItems = await Promise.all(cart.line_items.map(async (item) => {
            return {product: await commerce.products.retrieve(item.product_id),item};
        }));
        const sustainableItemCounter = productItems.reduce((acc, productItem) => {
            if (productItem.product.categories.map(category => category.slug).includes("sustainable")) {
                acc += productItem.item.quantity;
            }
            return acc
        }, 0);
        const sustainableItemPrice = productItems.reduce((acc, productItem) => {
            if (productItem.product.categories.map(category => category.slug).includes("sustainable")) {
                acc += productItem.item.price.raw*productItem.item.quantity;
            }
            return acc
        }, 0);

        for (var i=0;i<cart.total_unique_items;i++) {

            var jsonObj = {
                participant_id: window.results.id,
                group_id: window.results.group,
                product_id:cart.line_items[i].sku,
                product_qnty:cart.line_items[i].quantity,
                product_price:cart.line_items[i].price.raw,
                startTime: window.results.startTime,
                timePassedSec: (new Date().getTime() - window.results.startTime.getTime()) / 1000,
                products: cart.line_items,
                total_items: cart.total_items,
                total_unique_items: cart.total_unique_items,
                total_items_sustainable: sustainableItemCounter,
                subtotal_sustainable: sustainableItemPrice,
                subtotal: cart.subtotal.raw
            };
            /*cart.line_items.forEach(item => {
                jsonObj["product_"+item.index()+"_id"]=item.id;
                jsonObj["product_"+item.index()+"quantity"]=item.quantity;
                jsonObj["product_"+item.index()+"_price"]=item.price.raw;
            })*/

            axios.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/webapplication-yoqap/service/PostData/incoming_webhook/postParticipantData",
                jsonObj).then(res => {
                console.log(res);
            });
        }
        handleClickOpen();
        //setOpen(true);
        // });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <Container>
            <ThankYou open={open} setOpen={setOpen}/>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
            {!cart.line_items.length ? renderEmptyCart() : renderCart()}
        </Container>
    );
};

export default Cart;
