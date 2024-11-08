import { arena, ctx } from "./general";
import { Vec2 } from "./interfaces.interface";


export class Line {
    public start: Vec2;
    public end: Vec2;

    public vel: Vec2;

    public color: string;

    public followArena: boolean;

    public initStart: Vec2;
    public initEnd: Vec2;

    constructor({ x1, y1, x2, y2, color = 'red', followArena = true }: ILine) {
        this.start = { x: x1, y: y1 };
        this.end = { x: x2, y: y2 };

        this.initStart = { x: x1, y: y1 };
        this.initEnd = { x: x2, y: y2 };

        this.vel = { x: 0, y: 0 };
        this.color = color;
        this.followArena = followArena;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update() {
        this.start.x += this.vel.x;
        this.start.y += this.vel.y;
        this.end.x += this.vel.x;
        this.end.y += this.vel.y;

        if(this.followArena) {
            this.start.x += arena.pos.x;
            this.start.y = arena.pos.y + this.initStart.y;

            this.end.x += arena.pos.x;
            this.end.y = arena.pos.y + this.initEnd.y;
        }

        this.draw();
    }
}

export interface ILine {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string,
    followArena?: boolean
}