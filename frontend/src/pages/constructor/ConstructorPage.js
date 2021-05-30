import React, {useEffect} from "react"
import {Stage, Layer, Rect, Text} from 'react-konva';
import Konva from 'konva';
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import AddIcon from '@material-ui/icons/Add';
import $ from "jquery";

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
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    buttons: {
        position: "fixed",
        zIndex: 10,
        marginTop: "20px",
        marginLeft: "20px"
    },
    button: {
        background: "#DCDCDC",
        '&:hover': {
            background: "rgba(35,43,85,0.95)",
            color: "white"
        },
    }
}))

function generateShapes() {
    return [...Array(3)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * 500,
        y: Math.random() * 300,
        isDragging: false,
        text: i === 0 ? "Test" : i === 1 ? "Another Test" : "One more more more test",
        buttons: i === 2 ? [
            {text: "option1", link: 0},
            {text: "option2", link: 0},
            {text: "option3", link: 2}
        ] : []
    }));
}

const INITIAL_STATE = generateShapes();

function getRectangleBorderPoint(radians, size, sideOffset = 0) {
    const width = size.width + sideOffset * 2;

    const height = size.height + sideOffset * 2;

    radians %= 2 * Math.PI;
    if (radians < 0) {
        radians += Math.PI * 2;
    }

    const phi = Math.atan(height / width);

    let x, y;
    if (
        (radians >= 2 * Math.PI - phi && radians <= 2 * Math.PI) ||
        (radians >= 0 && radians <= phi)
    ) {
        x = width / 2;
        y = Math.tan(radians) * x;
    } else if (radians >= phi && radians <= Math.PI - phi) {
        y = height / 2;
        x = y / Math.tan(radians);
    } else if (radians >= Math.PI - phi && radians <= Math.PI + phi) {
        x = -width / 2;
        y = Math.tan(radians) * x;
    } else if (radians >= Math.PI + phi && radians <= 2 * Math.PI - phi) {
        y = -height / 2;
        x = y / Math.tan(radians);
    }

    return {
        x: -Math.round(x),
        y: Math.round(y)
    };
}

function getPoints(r1, r2) {
    const c1 = getCenter(r1);
    const c2 = getCenter(r2);

    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const angle = Math.atan2(-dy, dx);

    const startOffset = getRectangleBorderPoint(angle + Math.PI, r1.size());
    const endOffset = getRectangleBorderPoint(angle, r2.size());

    const start = {
        x: c1.x - startOffset.x,
        y: c1.y - startOffset.y
    };

    const end = {
        x: c2.x - endOffset.x,
        y: c2.y - endOffset.y
    };

    return [start.x, start.y, end.x, end.y]
}

function getCenter(node) {
    return {
        x: node.x() + node.width() / 2,
        y: node.y() + node.height() / 2,
    }
}

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
    };

    useEffect(() => {
        let main = $("#main")[0];
        let stage = new Konva.Stage({
            container: "stage",
            width: main.offsetWidth - 48,
            height: main.offsetHeight - 90,
        });

        let layer = new Konva.Layer();

        //Background
        layer.add(new Konva.Rect({
            x: 0,
            y: 0,
            fill: "#F8FAFF",
            width: window.innerWidth,
            height: window.innerHeight,
        }))
        for (let i = 0; i < 19; i++) {
            layer.add(new Konva.Line({
                points: [0, 88 * i, window.innerWidth, 88 * i],
                stroke: 'rgba(0,0,0,0.2)',
                strokeWidth: 1,
            }))
        }
        for (let i = 0; i < 19; i++) {
            layer.add(new Konva.Line({
                points: [88 * i, 0, 88 * i, window.innerHeight],
                stroke: 'rgba(0,0,0,0.2)',
                strokeWidth: 1,
            }))
        }

        //Blocks
        rects.forEach((rect) => {
            let group = new Konva.Group({
                key: rect.id,
                id: rect.id,
                x: rect.x,
                y: rect.y,
                draggable: true,
                onDragStart: handleDragStart,
                onDragEnd: handleDragEnd
            });

            /* START UPPER BLOCK */
            let upper_block = new Konva.Group({
                x: rect.x,
                y: rect.y,
                width: 200,
                height: 35,
            })
            upper_block.add(new Konva.Rect(
                {
                    fill: "#5199ff",
                    width: 200,
                    height: 35,
                    shadowColor: "black",
                    shadowBlur: 10,
                    shadowOpacity: 0.6,
                    shadowOffsetX: rect.isDragging ? -10 : -5,
                    shadowOffsetY: rect.isDragging ? 10 : 5,
                })
            );
            upper_block.add(new Konva.Text({
                text: rect.id,
                fontSize: 16,
                verticalAlign: 'middle',
                width: 200,
                height: 35,
                align: "center",
                fill: "white",
                fontFamily: "Arial"
            }))
            group.add(upper_block);
            /* END UPPER BLOCK */

            /* START CENTER BLOCK */
            let center_block = new Konva.Group({
                x: rect.x,
                y: rect.y + 40,
                width: 200,
                height: 50,
            })
            center_block.add(new Konva.Rect(
                {
                    fill: "#FFFFFF",
                    width: 200,
                    height: 50,
                    shadowColor: "black",
                    shadowBlur: 10,
                    stroke: 'rgba(0,0,0,0.5)',
                    strokeWidth: 1,
                    shadowOpacity: 0.6,
                    shadowOffsetX: rect.isDragging ? -10 : -5,
                    shadowOffsetY: rect.isDragging ? 10 : 5,
                })
            );
            center_block.add(new Konva.Text({
                text: rect.text,
                fontSize: 16,
                verticalAlign: 'middle',
                width: 200,
                height: 50,
                align: "center",
                fill: "black",
                fontFamily: "Arial"
            }))
            group.add(center_block);
            /* END CENTER BLOCK */

            // let current_height = 95
            let current_height = 0;

            /* START BOTTOM BLOCK */
            rect.buttons.map((button) => {
                let block = new Konva.Group({
                    x: rect.x,
                    y: rect.y + current_height + 100,
                    width: 200,
                    height: 35
                })
                block.add(new Konva.Rect({
                    fill: "#FFFFFF",
                    width: 200,
                    height: 35,
                    shadowColor: "black",
                    shadowBlur: 10,
                    stroke: "#5199ff",
                    strokeWidth: 2,
                    cornerRadius: 15,
                    shadowOpacity: 0.6,
                    shadowOffsetX: rect.isDragging ? -10 : -5,
                    shadowOffsetY: rect.isDragging ? 10 : 5,
                }))
                block.add(new Konva.Text({
                    text: button.text,
                    fontSize: 16,
                    verticalAlign: 'middle',
                    width: 200,
                    height: 35,
                    align: "center",
                    fill: "black",
                    fontFamily: "Arial"
                }))
                current_height += 40;
                group.add(block);
            })
            /* END BOTTOM BLOCK */

            layer.add(group);
        });

        //Connection
        //TODO ПИЗДА С КОНЕКТАМИ ЕБАННЫМИ
        let groups = layer.getChildren((node) => {
            return node.getClassName() === "Group";
        });
        rects.forEach((rect) => {
            if (rect.buttons.length){
                const buttons = rect.buttons;
                for(let i = 0; i < buttons.length; i++) {
                    let points = []

                    groups.forEach((group) => {
                        if (group.getAttrs().id == buttons[i].link){
                            points.push(group.x(), group.y());
                            console.log(group);
                        }
                        else if (group.getAttrs().id == rect.id){
                            points.push(group.x(), group.y());
                            console.log(group);
                        }
                    })

                    let line = new Konva.Line({
                        stroke: 'black',
                        fill: 'black',
                        points: points
                    })
                    layer.add(line);
                }
            }
        });

        stage.add(layer);
    });


    return (
        <div className={classes.root}>
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
            <main id="main" className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container id="container" maxWidth="xl">
                    <div className={classes.buttons}>
                        <IconButton className={classes.button}>
                            <AddIcon style={{fontSize: 20}}/>
                        </IconButton>
                    </div>
                    <div id={"stage"}></div>
                </Container>
            </main>
        </div>
    );
};
