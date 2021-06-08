import Konva from "konva";
import React from "react";

export function createBackground(layer) {
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
    for (let i = 0; i < 30; i++) {
        layer.add(new Konva.Line({
            points: [88 * i, 0, 88 * i, window.innerHeight],
            stroke: 'rgba(0,0,0,0.2)',
            strokeWidth: 1,
        }))
    }
}

export function appendTitleBlock(group, block) {
    group.add(new Konva.Rect({
        id: block.id,
        x: block.x,
        y: block.y,
        fill: "#5199ff",
        width: 200,
        height: 35,
        shadowColor: "black",
        shadowBlur: 10,
        shadowOpacity: 0.6,
        shadowOffsetX: block.isDragging ? -10 : -5,
        shadowOffsetY: block.isDragging ? 10 : 5,
    }));
    group.add(new Konva.Text({
        x: block.x,
        y: block.y,
        text: block.id,
        fontSize: 16,
        verticalAlign: 'middle',
        width: 200,
        height: 35,
        align: "center",
        fill: "white",
        fontFamily: "Arial"
    }))
}

export function appendTextBlock(group, block) {
    group.add(new Konva.Rect(
        {
            x: block.x,
            y: block.y + 40,
            fill: "#FFFFFF",
            width: 200,
            height: 50,
            shadowColor: "black",
            shadowBlur: 10,
            stroke: 'rgba(0,0,0,0.5)',
            strokeWidth: 1,
            shadowOpacity: 0.6,
            shadowOffsetX: block.isDragging ? -10 : -5,
            shadowOffsetY: block.isDragging ? 10 : 5,
        })
    );
    group.add(new Konva.Text({
        x: block.x,
        y: block.y + 40,
        text: block.text,
        fontSize: 16,
        verticalAlign: 'middle',
        width: 200,
        height: 50,
        align: "center",
        fill: "black",
        fontFamily: "Arial"
    }))
}

export function appendButtons(group, block) {
    let current_height = 0;

    block.buttons.forEach((button) => {
        group.add(new Konva.Rect({
            id: button.id,
            x: block.x,
            y: block.y + current_height + 100,
            fill: "#FFFFFF",
            width: 200,
            height: 35,
            shadowColor: "black",
            shadowBlur: 10,
            stroke: "#5199ff",
            strokeWidth: 2,
            cornerRadius: 15,
            shadowOpacity: 0.6,
            shadowOffsetX: block.isDragging ? -10 : -5,
            shadowOffsetY: block.isDragging ? 10 : 5,
        }))
        group.add(new Konva.Text({
            x: block.x,
            y: block.y + current_height + 100,
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
    })
}

export function updateConnecting(layer, blocks) {
    let groups = layer.getChildren((node) => {
        return node.getClassName() === "Group";
    });
    blocks.forEach((block) => {
        block.buttons.forEach((button) => {
            let from_group = groups.filter((group) => group.getAttrs().id == block.id)[0],
                to_group = groups.filter((group) => group.getAttrs().id == button.link)[0];

            let to_rect = to_group.getChildren()[0],
                from_rect = from_group.getChildren((node) => {
                    return node.getAttrs().id == button.id
                })[0];

            console.log(to_rect.x(), to_rect.y(), from_rect.x(), from_rect.y());
        })
    })
}

export function appendConnecting(layer, blocks) {
    let groups = layer.getChildren((node) => {
        return node.getClassName() === "Group";
    });
    blocks.forEach((block) => {
        block.buttons.forEach((button) => {
            //debugger;
            let from_group = groups.filter((group) => group.getAttrs().id == block.id)[0],
                to_group = groups.filter((group) => "/" + group.getAttrs().id == button.link)[0];

            let to_rect = to_group.getChildren()[0],
                from_rect = from_group.getChildren((node) => {
                    return node.getAttrs().id == button.id
                })[0];

            let arrow = new Konva.Arrow({
                stroke: 'black',
                fill: 'black',
            });
            arrow.points([from_rect.x(), from_rect.y(), to_rect.x(), to_rect.y()]);

            layer.add(arrow);
        })
    })
}

export function addNewBlocks(layer) {

}

export function createButtons(blocks, children) {
    let selects = [];
    blocks.forEach((block) => {
        selects.push(
            <option value={block.id}>{block.id}</option>
        )
    });

    let output = [];
    let index = 5;
    while (children[index]){
        output.push(
            <div className="content-button">
                <div className="button_name">
                    <input type="text" placeholder="Button name">{children[index].getAttrs().text}</input>
                </div>
                <div className="button_link">
                    <span>Link:</span>
                    <select className="link">
                        {selects}
                    </select>
                </div>
            </div>
        )
        index += 2;
    }

    return output;
}

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
