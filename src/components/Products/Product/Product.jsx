import React from 'react';
import {Card, CardMedia, CardContent, CardActions, Typography, IconButton, Button, Container} from '@material-ui/core';
import {AddShoppingCart} from '@material-ui/icons';

import useStyles from './styles';
import './styles.css';
import Chip from "@material-ui/core/Chip";
//import EcoIcon from '@material-ui/icons/Eco';
import EcoIcon from '../../../assets/icon.svg'
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";

const Product = ({product, onAddToCart}) => {
    const classes = useStyles();

    const handleAddToCart = () => onAddToCart(product.id, 1);
    const svgIcon = (
        <Icon>
            <img src={EcoIcon} className={classes.iconImage}/>
        </Icon>

    );

    const renderBanner = () => (
        <span className="tooltip"><Chip className={classes.chip} icon={svgIcon} label="Sustainable"/> <span
            className="tooltiptext">For products labelled as “sustainable”, certified, organic materials are used.</span></span>
    );
    /* <Buton aria-label="Add to Cart" onClick={handleAddToCart}>
                    <AddShoppingCart/>
                    Add to Cart
                </Buton>
                         <Button
                    variant="contained"
                    className={classes.button}
                    startIcon={<AddShoppingCart />}
                    onClick={handleAddToCart}
                 >
                    Add to Cart
                </Button>*/
    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media} image={product.image.url} title={product.name}/>
            <CardContent>
                <div className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.price.formatted}€
                    </Typography>
                </div>
                <Typography dangerouslySetInnerHTML={{__html: product.description}} variant="body2"
                            color="textSecondary" component="p"/>
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
                {product.categories.some(item => item.slug === 'sustainable') ? renderBanner() : null}
                <IconButton aria-label="Add to Cart" onClick={handleAddToCart}>
                    <AddShoppingCart />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default Product;

