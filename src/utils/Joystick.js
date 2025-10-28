
export class Joystick {
    constructor (radius, innerRadius, posX, posY) {  
        this.posX = posX
        this.posY = posY
        this.radius = radius
        this.innerRadius = innerRadius
        this.makeJoystick(posX, posY)
    }
    makeJoystick(x, y) {
        this.gameObj = add([
            circle(this.radius),
            area(),
            anchor("center"),
            pos(x, y),
            fixed(true),
            color(0,0,0),
            opacity(0.3),
            "joystick",
            z(10)
        ])
        this.gameObj.add([
            rect(2, this.innerRadius),
            anchor("center"),
            color(0,0,0),
            opacity(0.7),
            pos(0, 0),
            "center",
        ])
        this.gameObj.add([
            rect(this.innerRadius, 2),
            anchor("center"),
            color(0,0,0),
            opacity(0.7),
            pos(0, 0),
            "center",
        ])
        this.gameObj.add([
            circle(this.radius - 10, {fill: false}),
            anchor("center"),
            outline(2,),
            opacity(0.3),
            pos(0, 0),
            "center",
        ])
        this.gameObj.add([
            circle(this.innerRadius),
            anchor("center"),
            color(255,255,255),
            opacity(0.3),
            pos(0, 0),
            "joystick-handle",
        ])

    } 

    handleMouseDown(mousePos) {
        const newPosX = mousePos.x - this.posX
        const newPosY = mousePos.y - this.posY

        const find_angle = () => {
            const AB = Math.sqrt(Math.pow(0-newPosX,2)+ Math.pow(0-newPosY,2));
            const BC = Math.sqrt(Math.pow(0-newPosX,2)+ Math.pow(0-newPosY,2));
            const AC = Math.sqrt(Math.pow(newPosX-newPosX,2)+ Math.pow(0-newPosY,2));
            return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
        }

        const angle = find_angle() 
        const dotX = Math.cos(angle) * this.radius;
        const dotY = Math.sin(angle) * this.radius;

        if (Math.abs(newPosY) < dotY) {
            this.gameObj.get("joystick-handle")[0].pos.y = newPosY
        } else {
            if (newPosY < 0) {
                this.gameObj.get("joystick-handle")[0].pos.y = -dotY
            } else if (newPosY >= 0) {
                this.gameObj.get("joystick-handle")[0].pos.y = dotY
            } else this.gameObj.get("joystick-handle")[0].pos.y = 0
        }

        if (Math.abs(newPosX) < dotX) {
            this.gameObj.get("joystick-handle")[0].pos.x = newPosX
        } else {
            if (newPosX < 0) {
                this.gameObj.get("joystick-handle")[0].pos.x = -dotX
            } else if (newPosX > 0) {
                this.gameObj.get("joystick-handle")[0].pos.x = dotX
            } else this.gameObj.get("joystick-handle")[0].pos.x = 0

        }

        if (this.gameObj.get("joystick-handle")[0].pos.x < 0) {
            return 'backward'
        } else return 'forward'

    }

    handleMousePress(mousePos) {
        // if (this.gameObj.hasPoint(vec2(mousePos.x < width()/2, mousePos.y))) 
        if (mousePos.x < width()/2) {
            return true
        } else {
            return false
        }
    }

    handleMouseRelease(posX = 0, posY = 0) {
        this.gameObj.get("joystick-handle")[0].pos.x = posX
        this.gameObj.get("joystick-handle")[0].pos.y = posY
    }

    getJoystickPos() {
        return {
            x: this.gameObj.get("joystick-handle")[0].pos.x, 
            y: this.gameObj.get("joystick-handle")[0].pos.y
        }
    }

    getAngle() {
        const angle = () => {
            const AB = Math.sqrt(Math.pow(-this.gameObj.get("joystick-handle")[0].pos.x,2)+ Math.pow(-this.gameObj.get("joystick-handle")[0].pos.y,2));
            const BC = Math.sqrt(Math.pow(-this.gameObj.get("joystick-handle")[0].pos.x,2));
            const AC = Math.sqrt(Math.pow(this.gameObj.get("joystick-handle")[0].pos.x-this.gameObj.get("joystick-handle")[0].pos.x,2)+ Math.pow(-this.gameObj.get("joystick-handle")[0].pos.y,2));
            return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
        }
        return {
            
            angle: angle(),
            x: this.gameObj.get("joystick-handle")[0].pos.x,
            y: this.gameObj.get("joystick-handle")[0].pos.y
        }

    }

    onClick(e) {
        this.gameObj.onClick(e)
    }

}