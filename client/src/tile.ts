import { Vec2 } from "./interfaces.interface";
import { ctx, arena } from "./general";

export class Tile {
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public initYPos: number;
    public initXPos: number;
    public color: string;
    public isIndicatorTile: boolean = false;

    constructor({ x, y, width, height, color = '#252e2c', isIndicatorTile = false }: ITile) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.initYPos = y;
        this.initXPos = x;
        this.color = color;
        this.isIndicatorTile = isIndicatorTile;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update() {
        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

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
    color?: string,
    isIndicatorTile?: boolean
}

