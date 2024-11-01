import { Vec2 } from "./interfaces.interface";
import { ctx, arena } from "./general";

export class Tile {
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public initYPos: number;

    constructor({ x, y, width, height }: ITile) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0};
        this.width = width;
        this.height = height;
        this.initYPos = y;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos.x += arena.pos.x;
        this.pos.y = arena.pos.y + this.initYPos;

        this.draw();
    }
}


export interface ITile {
    x: number,
    y: number,
    width: number,
    height: number,
}

