import Konva from "konva";

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
    for (let i = 0; i < 19; i++) {
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
            let from_group = groups.filter((group) => group.getAttrs().id == block.id)[0],
                to_group = groups.filter((group) => group.getAttrs().id == button.link)[0];

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