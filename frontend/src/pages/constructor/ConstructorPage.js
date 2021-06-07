import React, {useEffect} from "react"
import {Stage, Layer, Rect, Text} from 'react-konva';
import Konva from 'konva';
import clsx from "clsx";
import "./Constructor.css";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import AddIcon from '@material-ui/icons/Add';
import $ from "jquery";
import {
    appendConnecting,
    appendButtons,
    appendTextBlock,
    appendTitleBlock,
    createBackground,
} from "./subConstructor";

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
        id: i.toString() == 0 ? "/start" : i.toString() == 1 ? "/continue" : "/ok",
        x: Math.random() * 500,
        y: Math.random() * 300,
        text: i === 0 ? "Test" : i === 1 ? "Another Test" : "One more more more test",
        buttons: i === 2 ? [
            {id: 0, text: "option1", link: "/start"},
            {id: 1, text: "option2", link: "/continue"},
            {id: 2, text: "option3", link: "/start"}
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
    const [blocks, setRects] = React.useState(INITIAL_STATE);
    const classes = useStyles();
    const history = useHistory();

    const handleDragStart = (e) => {
        console.log(e);
        setRects(
            blocks.map((rect) => {
                return {
                    ...rect,
                    x: rect.id === e.target.id() ? e.evt.offsetX : rect.x,
                    y: rect.id === e.target.id() ? e.evt.offsetY : rect.y,
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

        createBackground(layer)

        blocks.forEach((block) => {
            let group_block = new Konva.Group({
                id: block.id,
                draggable: true,
            })
            group_block.on("dragmove", handleDragStart);
            group_block.on('mouseenter', function () {
                stage.container().style.cursor = 'pointer';
            });
            group_block.on('mouseleave', function () {
                stage.container().style.cursor = 'default';
            });
            group_block.on("click", (e) => {
                $("#action_block").show(750);
            })
            appendTitleBlock(group_block, block);
            appendTextBlock(group_block, block);
            appendButtons(group_block, block);

            layer.add(group_block);
        })

        appendConnecting(layer, blocks);
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
            <div id="action_block">
                <div className="block_header">
                    <span className="block_name">Commands settings</span>
                    <div className="block_header_buttons">
                        <IconButton onClick={() => {
                            $("#action_block").hide(750);
                        }}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="block_content">
                    <div className="block_component">
                        <div className="component_content">
                            <span>Command name:</span>
                            <div className="input_name">
                                <input type="text" placeholder="Command name"/>
                            </div>
                        </div>
                    </div>
                    <div className="block_component">
                        <div className="component_content">
                            <span>Text for output:</span>
                            <div className="input_text">
                                <textarea placeholder="Text for output"/>
                            </div>
                        </div>
                    </div>
                    <div className="block_component">
                        <div className="component_content">
                            <span>Buttons:</span>
                            <div className="content-button">
                                <div className="button_name">
                                    <input type="text" placeholder="Button name"/>
                                </div>
                                <div className="button_link">
                                    <span>Link:</span>
                                    <select className="link">
                                        <option value="id 1">id 1</option>
                                        <option value="id 2">id 2</option>
                                        <option value="id 3">id 3</option>
                                    </select>
                                </div>
                            </div>
                            <div className="content-button">
                                <div className="button_name">
                                    <input type="text" placeholder="Button name"/>
                                </div>
                                <div className="button_link">
                                    <span>Link:</span>
                                    <select className="link">
                                        <option value="id 1">id 1</option>
                                        <option value="id 2">id 2</option>
                                        <option value="id 3">id 3</option>
                                    </select>
                                </div>
                            </div>
                            <div className="content-button">
                                <div className="button_name">
                                    <input type="text" placeholder="Button name"/>
                                </div>
                                <div className="button_link">
                                    <span>Link:</span>
                                    <select className="link">
                                        <option value="id 1">id 1</option>
                                        <option value="id 2">id 2</option>
                                        <option value="id 3">id 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
