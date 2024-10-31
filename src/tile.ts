import { Vec2 } from "./interfaces.interface";
import { ctx } from "./general";

export class Tile {
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;

    constructor({ x, y, width, height }: ITile) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0};
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.draw();
    }
}


export interface ITile {
    x: number,
    y: number,
    width: number,
    height: number
}

