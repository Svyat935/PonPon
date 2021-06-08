import React, {useEffect, useState} from "react"
import {Stage, Layer, Rect, Text} from 'react-konva';
import Konva from 'konva';
import clsx from "clsx";
import AddCommentIcon from '@material-ui/icons/AddComment';
import LaunchIcon from '@material-ui/icons/Launch';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import "./Constructor.css";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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
    createBackground, createButtons,
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

async function generateShapes() {
    let token = JSON.parse(localStorage.getItem("localData"))["token"];
    let response = await fetch("scripts/get_scenario/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
        })
    }).then(response => response.json());
    let blocks = [...response].map((block) => ({
        id: block["command"],
        x: Math.random() * 500,
        y: Math.random() * 300,
        text: block["text"],
        buttons: block["buttons"] || []
    }));
    console.log(blocks);
    return blocks;
}

export const ConstructorPage = () => {
    const [blocks, setBlocks] = useState([]);
    const [stage, setStage] = useState(null);
    const [layer, setLayer] = useState(null);
    let current_block = null;
    const classes = useStyles();
    const history = useHistory();

    const launchBot = async (e) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/bots/start/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        })
        if (response.status == 200){
            alert("Bot active");
        }
        else{
            alert("Sorry, we have problem");
        }
    }

    const stopBot = async (e) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/bots/stop/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        })
        if (response.status == 200){
            alert("Bot stopped");
        }
        else{
            alert("Sorry, we have problem");
        }
    }

    const updateBots = async (e) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/scripts/update_bots/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        })
        if (response.status == 200){
            alert("Update bot");
        }
        else{
            alert("Sorry, we have problem");
        }
    }

    const saveBlocks = async (e) => {
        let blocks_to_send = []
        blocks.forEach((block) => {
            blocks_to_send.push({
                "command": block.id,
                "text": block.text,
                "buttons": block.buttons
            })
        })

        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/scripts/update/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                blocks: blocks_to_send
            })
        })
        if (response.status == 200){
            alert("New Scripts Update");
        }
        else{
            alert("Sorry, we have problem");
        }
    }

    const handleDragStart = (e) => {
        blocks.forEach((block) => {
            block.x = block.id === e.target.id() ? e.evt.offsetX : block.x;
            block.y = block.id === e.target.id() ? e.evt.offsetY : block.y
        });
        layer.find("Arrow").forEach((node) => node.destroy());
        layer.draw();
        //appendConnecting(layer, blocks);
    };

    const handleDrawerOpen = (e) => {
        history.push("/");
    };

    const handleApplyCurrentBlock = (e) => {
        current_block.text = $("#text").val();
        current_block.id = $("#command_name").val();
        layer.find("Group").forEach((node) => node.destroy());
        layer.draw();
        let new_blocks = blocks.map((node) => node);
        setBlocks(new_blocks);
        $("#action_block").hide(750);
    }

    useEffect(async () => {
        let main = $("#main")[0];
        let stage = new Konva.Stage({
            container: "stage",
            width: main.offsetWidth - 48,
            height: main.offsetHeight - 90,
        });
        let layer = new Konva.Layer();
        createBackground(layer);
        stage.add(layer);

        let new_blocks = await generateShapes();

        layer = new Konva.Layer();
        stage.add(layer);

        setStage(stage);
        setLayer(layer);
        setBlocks(new_blocks);
    }, [])

    const addNewBlock = () => {
        let copyBlock = blocks.concat([{
            id: "newBlock",
            x: Math.random() * 500,
            y: Math.random() * 300,
            text: "text",
            buttons: blocks[0].buttons
        }]);
        layer.find("Group").forEach((node) => {
            node.destroy();
        })
        setBlocks(copyBlock);
    }

    useEffect(() => {
        console.log(blocks);
        if (!!layer) {
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
                    $("#command_name").val(e.target.parent.getAttrs().id);
                    $("#text").val(e.target.parent.children[3].getAttrs().text);
                    $("#buttons").append(createButtons(blocks, e.target.parent.children))
                    blocks.forEach((block) => {
                        if (block.id == e.target.parent.getAttrs().id) {
                            current_block = block;
                        }
                    });
                })
                appendTitleBlock(group_block, block);
                appendTextBlock(group_block, block);
                appendButtons(group_block, block);

                layer.add(group_block);
            })

            //appendConnecting(layer, blocks);
        }
    }, [blocks]);


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
                                <input type="text" id={"command_name"} placeholder="Command name"/>
                            </div>
                        </div>
                    </div>
                    <div className="block_component">
                        <div className="component_content">
                            <span>Text for output:</span>
                            <div className="input_text">
                                <textarea id={"text"} placeholder="Text for output"/>
                            </div>
                        </div>
                    </div>
                    <div className="block_component">
                        <div id={"buttons"} className="component_content">
                            <span>Buttons:</span>

                        </div>
                    </div>
                    <IconButton style={{margin: "10px 10px 0px 0px"}} onClick={() => handleApplyCurrentBlock()}>
                        <CheckBoxIcon style={{fontSize: 30}}/>
                    </IconButton>
                </div>
            </div>
            <main id="main" className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container id="container" maxWidth="xl">
                    <div className={classes.buttons}>
                        <IconButton className={classes.button} onClick={() => addNewBlock()}>
                            <AddIcon style={{fontSize: 20}}/>
                        </IconButton>
                        <IconButton className={classes.button} onClick={() => saveBlocks()}>
                            <AddCommentIcon style={{fontSize: 20}}/>
                        </IconButton>
                        <IconButton className={classes.button} onClick={() => updateBots()}>
                            <LaunchIcon style={{fontSize: 20}}/>
                        </IconButton>
                        <IconButton className={classes.button} onClick={() => launchBot()}>
                            <PlayArrowIcon style={{fontSize: 20}}/>
                        </IconButton>
                        <IconButton className={classes.button} onClick={() => stopBot()}>
                            <StopIcon style={{fontSize: 20}}/>
                        </IconButton>
                    </div>
                    <div id={"stage"}></div>
                </Container>
            </main>
        </div>
    );
};
