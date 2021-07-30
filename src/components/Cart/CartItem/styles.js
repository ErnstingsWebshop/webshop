import {makeStyles} from '@material-ui/core/styles';

export default makeStyles(() => ({
    root: {
        // maxWidth: 345, original width style
        maxWidth: '100%',
    },
    media: {
        height: 250,
        paddingTop: '56.25%', // 16:9
        backgroundRepeat: 'no-repeat',
        backgroundSize: 175,
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'center',
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 50,
    },
    buttons: {
        display: 'flex',
        alignItems: 'center',
    },
}));
