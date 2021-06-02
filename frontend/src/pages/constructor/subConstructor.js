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

// //Connection
// //TODO ПИЗДА С КОНЕКТАМИ ЕБАННЫМИ
// let groups = layer.getChildren((node) => {
//     return node.getClassName() === "Group";
// });
// rects.forEach((rect) => {
//     if (rect.buttons.length){
//         const buttons = rect.buttons;
//         for(let i = 0; i < buttons.length; i++) {
//             let points = []
//
//             groups.forEach((group) => {
//                 if (group.getAttrs().id == buttons[i].link){
//                     points.push(group.absolutePosition().x, group.absolutePosition().y);
//                     console.log("TO", group.absolutePosition().x, group.absolutePosition().y, rects);
//                 }
//                 else if (group.getAttrs().id == rect.id){
//                     points.push(group.absolutePosition().x, group.absolutePosition().y);
//                     console.log("FROM", group.x(), group.y(), rects);
//                 }
//             })
//
//             let arrow = new Konva.Arrow({
//                 stroke: 'black',
//                 fill: 'black',
//                 points: points
//             })
//             layer.add(arrow);
//         }
//     }
// });