import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AppsIcon from "@material-ui/icons/Apps";
import SettingsIcon from "@material-ui/icons/Settings";
import React, {useContext} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AuthContext} from "../pages/auth/AuthContext";
import {useHistory} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        background: "rgba(35,43,85,0.95)",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
}))

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();


    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleExit = () => {
        auth.logout();
    }
    const handleProfile = () => {
        history.push("/test1");
    }
    const handleSettings = () => {
        history.push("/test2");
    }
    const handleConstructor = () => {
        history.push("/test1");
    }

    return (
        <div className={clsx(classes.root)}>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Main Page
                    </Typography>
                    <IconButton color="inherit">
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List classess={classes.lists}>
                    <ListItem button key={"profile"} onClick={()=> handleProfile()}>
                        <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                        <ListItemText primary={"Profile"}/>
                    </ListItem>
                    <ListItem button key={"exit"} onClick={() => handleExit()}>
                        <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                        <ListItemText primary={"Exit"}/>
                    </ListItem>
                    <Divider/>
                    <ListItem button key={"constructors"} onClick={() => handleConstructor()}>
                        <ListItemIcon><AppsIcon/></ListItemIcon>
                        <ListItemText primary={"Constructors"}/>
                    </ListItem>
                    <ListItem button key={"settings"} onClick={() => handleSettings()}>
                        <ListItemIcon><SettingsIcon/></ListItemIcon>
                        <ListItemText primary={"Settings"}/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}