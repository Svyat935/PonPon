import React from "react"
import "./Constructor.css";
import {Stage, Layer, Rect, Text} from 'react-konva';
import Konva from 'konva';
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import {useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    appBar: {
        background: "rgba(35,43,85,0.95)",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        flexGrow: 1,
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
    menuButton: {
        marginRight: 36,
    }
}))

function generateShapes() {
    return [...Array(1)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

export const ConstructorPage = () => {
    const [rects, setRects] = React.useState(INITIAL_STATE);
    const classes = useStyles();
    const history = useHistory();

    const handleDragStart = (e) => {
        const id = e.target.id();
        setRects(
            rects.map((rect) => {
                return {
                    ...rect,
                    isDragging: rect.id === id,
                };
            })
        );
    };
    const handleDragEnd = (e) => {
        setRects(
            rects.map((rect) => {
                return {
                    ...rect,
                    isDragging: false,
                };
            })
        );
    };
    const handleDrawerOpen = (e) => {
        history.push("/");
    }

    return (
        <div>
            <AppBar position="absolute" className={clsx(classes.appBar)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton)}
                    >
                        <ArrowBackIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {"Constructor"}
                    </Typography>
                    <IconButton color="inherit"/>
                </Toolbar>
            </AppBar>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {rects.map((rect) => (
                        <Rect
                            key={rect.id}
                            id={rect.id}
                            x={rect.x}
                            y={rect.y}
                            fill="#89b717"
                            draggable
                            width={200}
                            height={100}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.6}
                            shadowOffsetX={rect.isDragging ? -10 : -5}
                            shadowOffsetY={rect.isDragging ? 10 : 5}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};
