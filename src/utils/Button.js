export default function addButton(width, posX, posY, spriteName, iconPosX = 0, iconPosY = 0, iconWidth) {
    // add a parent background object
    let isTimerActive = false
    const btn = add([
        circle(width/2),
        pos(posX, posY),
        area(),
        scale(1),
        anchor("center"),
        fixed(true),
        color(255,255,255),
        opacity(0.3),
        z(10)
    ]);

    // add a child object that displays the text
    btn.add([
        sprite(spriteName, {
            width: iconWidth
        }),
        anchor("center"),
        pos(iconPosX, iconPosY),
        scale(0.5)
    ]);
    btn.add([
        circle(width/2 - 10, {fill: false}),
        anchor("center"),
        outline(2),
        opacity(0.3),
        pos(0, 0),
        "center",
    ])

    // onHoverUpdate() comes from area() component
    // it runs every frame when the object is being hovered
    // btn.onHoverUpdate(() => {
    //     const t = time() * 10;
    //     btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
    //     btn.scale = vec2(1.2);
    //     setCursor("pointer");
    // });

    // onHoverEnd() comes from area() component
    // it runs once when the object stopped being hovered
    // btn.onHoverEnd(() => {
    //     btn.scale = vec2(1);
    //     btn.color = rgb();
    // });

    // onClick() comes from area() component
    // it runs once when the object is clicked
    btn.onClick((f) => f);
    btn.onMouseDown((f) => f);

    btn.startTimer = (time) => {
        if (isTimerActive) {
            return
        } else {
            isTimerActive = true
            btn.color = rgb(0,0,0)
            wait(time, () => {
                btn.color = rgb(255,255,255)
                isTimerActive = false
            })
        }

    }

    return btn;
}