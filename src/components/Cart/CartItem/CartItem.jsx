import React, {useEffect, useState} from 'react';
import {Typography, Button, Card, CardActions, CardContent, CardMedia, IconButton} from '@material-ui/core';

import useStyles from './styles';
import {AddShoppingCart} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";
import EcoIcon from "../../../assets/icon.svg";
import {commerce} from "../../../lib/commerce";
import {useAsyncEffect} from "use-async-effect";

const CartItem = ({product, item, onUpdateCartQty, onRemoveFromCart}) => {

    const classes = useStyles();

    const svgIcon = (
        <Icon>
            <img src={EcoIcon} className={classes.iconImage}/>
        </Icon>

    );
    /* {item.categories.some(item => item.slug === 'sustainable') ? renderBanner() : null}*/

    const renderBanner = () => (
        <Chip className={classes.chip} icon={svgIcon} label="Sustainable"/>
    );

    const handleUpdateCartQty = (lineItemId, newQuantity) => onUpdateCartQty(lineItemId, newQuantity);

    const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);


    return (
        <Card className="cart-item">
            <CardMedia image={item.image.url} alt={item.name} className={classes.media}/>
            <CardContent className={classes.cardContent}>
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="h5">{item.price.formatted}€</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" size="small"
                            onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
                    <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                    <Button type="button" size="small"
                            onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="contained" type="button" color="secondary"
                        onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
            </CardActions>
        </Card>
    );
};


export default CartItem;
