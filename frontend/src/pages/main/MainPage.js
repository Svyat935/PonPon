import React from "react"
import clsx from 'clsx';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Navbar} from "../../components/navbar";
import AlbumIcon from '@material-ui/icons/Album';
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import blue from "@material-ui/core/colors/blue";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    imageIcon: {
        height: '100%'
    },
}));


export function MainPage() {
    const history = useHistory();
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const handleGmailBot = () => {
        history.push("/build");
    }
    const handleTelegramBot = () => {
        history.push("/build");
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Navbar navbarTitle={"Main Page"}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth={false} className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper>
                                <List>
                                    <ListItem button key={"gmail-bot"} onClick={()=> handleGmailBot()}>
                                        <ListItemIcon>
                                            <AlbumIcon style={{ fontSize: 50, color: red[800] }} />
                                        </ListItemIcon>
                                        <ListItemText primary={"Gmail-bot. It's awesome bro!"}/>
                                    </ListItem>
                                    <ListItem button key={"telegram-bot"} onClick={()=> handleTelegramBot()}>
                                        <ListItemIcon>
                                            <AlbumIcon style={{ fontSize: 50, color: blue[700] }} />
                                        </ListItemIcon>
                                        <ListItemText primary={"Telegram-Bot. It's double-awesome bro!"}/>
                                    </ListItem>
                                    <ListItem button key={"what'sUp-bot"}>
                                        <ListItemIcon>
                                            <AlbumIcon style={{ fontSize: 50, color: green[900] }} />
                                        </ListItemIcon>
                                        <ListItemText primary={"What'sUp-bot. Om....Okey bro!"}/>
                                    </ListItem>
                                    <ListItem button key={"viber-bot"}>
                                        <ListItemIcon>
                                            <AlbumIcon style={{ fontSize: 50, color: purple[800] }} />
                                        </ListItemIcon>
                                        <ListItemText primary={"Viber-Bot. It's horny bro!"}/>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    )
}