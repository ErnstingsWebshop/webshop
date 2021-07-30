import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";


const Filters = ({filterProducts, keys}) => {
    const drawerWidth = 190;
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 5
        },
        drawerPaper: {
            width: drawerWidth,
            top:'8%',
        },
        drawerContainer: {
            marginTop: 30,
            padding: 20,
            overflow: 'hidden',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }));

    const [value, setValue] = React.useState(keys.men ? 'men': keys.women ? 'women': '');
    const classes = useStyles();

    const handleChange = (e) => {
        setValue(e.target.value);
        if(e.target.value === 'men') {
            keys['men'] = e.currentTarget.checked;
            keys['women'] = false;
        } else {
            keys['women'] = e.currentTarget.checked;
            keys['men'] = false;
        }
        filterProducts(keys);
    };
    const handleFilterProducts = (e) => {
        keys[e.currentTarget.name] = e.currentTarget.checked;
        filterProducts(keys);
    };

    return (
        <>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerContainer}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                            <FormControlLabel value="women" control={<Radio />} label="Women" />
                            <FormControlLabel value="men" control={<Radio />} label="Men" />
                        </RadioGroup>
                        <FormLabel component="legend">Size</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={keys.s} onChange={handleFilterProducts} name="s" />}
                                label="S"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={keys.m} onChange={handleFilterProducts} name="m" />}
                                label="M"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={keys.l} onChange={handleFilterProducts} name="l" />}
                                label="L"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={keys.xl} onChange={handleFilterProducts} name="xl" />}
                                label="XL"
                            />
                        </FormGroup>
                        <FormLabel component="legend">Tags</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={keys.sustainable} onChange={handleFilterProducts} name="sustainable" />}
                                label="Sustainable"
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </Drawer>
        </>
    );
};

export default Filters;


/*
           <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">SIZES</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={false} onChange={handleFilterProducts()} name="s" />}
                                label="S"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={false} onChange={handleFilterProducts()} name="m" />}
                                label="M"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={false} onChange={handleFilterProducts()} name="l" />}
                                label="L"
                            />
                        </FormGroup>
                    </FormControl>
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

    const mobileMenuId = 'primary-search-account-menu-mobile';

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
    });


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    <div className="row">
                        <Button onClick={handleFilterProducts('s')}>Test</Button>
                        <div className="col-2 d-none d-lg-block position-relative"><p
                            className="font-size-title font-weight-medium mb-3">Type</p>
                            <div className="mb-5">
                                <div className="d-flex"><p
                                    className="mb-2 position-relative cursor-pointer">Men</p></div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className="row">
                        <div className="col-2 d-none d-lg-block position-relative"><p
                            className="font-size-title font-weight-medium mb-3">Size</p>
                            <div className="mb-5">
                                <div className="d-flex"><p
                                    className="mb-2 position-relative cursor-pointer">S</p></div>
                            </div>
                        </div>
                    </div>


    */



