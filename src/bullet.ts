import { arena, ctx } from "./general";
import { Vec2 } from "./interfaces.interface";

export class Bullet {

    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public speed: number;
    public initYPos: number;

    constructor({x, y, width, height}: IBullet) {
        this.pos = {
            x,
            y
        };
        this.width = width;
        this.height = height;

        this.vel = {
            x: 0,
            y: 0
        };

        this.initYPos = y;
        this.speed = 35;
    }


    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos.x += arena.pos.x;

        this.draw();
    }
}



export interface IBullet {
    x: number;
    y: number;
    width: number;
    height: number;
}