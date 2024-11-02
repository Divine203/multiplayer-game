import { arena, ctx } from "./general";
import { Vec2 } from "./interfaces.interface";
import { gravity } from "./physics";

export class Item {
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public initYPos: number;

    public isPlayer: boolean = false;

    public color: string;

    constructor({x, y, width, height, color = 'yellow'}: IItem) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.initYPos = y;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update(): void {
        // this.pos.y += this.vel.y;
        // this.pos.x += this.vel.x;

        this.pos.x += arena.pos.x;
        // this.pos.y = arena.pos.y + this.initYPos;

        // this.vel.y += gravity;
        this.draw();
    }
}

export interface IItem {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}