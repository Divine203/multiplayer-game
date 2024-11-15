import { arena, ctx, cameraState } from "./general";
import { Vec2 } from "./interfaces.interface";
import { gravity } from "./physics";
import { v4 as uuidv4 } from 'uuid';

export class Item {
    public _id: string | any = uuidv4();
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public initYPos: number;
    public color: string;

    public isPlayer: boolean = false;

    public isRest: boolean = false;

    public noGravity: boolean = false;

    public isThrowable: boolean;
    public xSpeed: number = 25;
    public ySpeed: number = 30;
    public isThrown: boolean = false;
    public throwRight: boolean = true;
    public friction: number = 0.02;
    public noFriction = false;


    constructor({ x, y, width, height, color = 'yellow', isThrowable = false, throwRight = false }: IItem) {
        this.pos = { x, y } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
        this.width = width;
        this.height = height;
        this.initYPos = y;
        this.color = color;
        this.isThrowable = isThrowable;
        if (this.isThrowable) {
            this.throwRight = throwRight;
        };

    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    updateThrow() {
        this.xSpeed *= 1 - this.friction;
        if (this.throwRight) {
            this.vel.x = this.xSpeed;
        } else if(!this.throwRight) {
            this.vel.x = -this.xSpeed;
        }
    }

    throw(angle: number, speed: number) {
        if (this.isThrowable) {
            const angleInRadians = (angle * Math.PI) / 180;
            
            this.xSpeed = speed * Math.cos(angleInRadians);
            this.ySpeed = speed * Math.sin(angleInRadians);

            this.vel.x = this.throwRight ? this.xSpeed : -this.xSpeed;
            this.vel.y = -this.ySpeed;
    
            this.isThrown = true;
        }
    }

    update() {
        if(this.isThrown) {
            this.updateThrow();
        }

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.pos.x += arena.pos.x;
        if (!this.noGravity) this.vel.y += gravity;

        // fix bouncing effect as platform moves with camera
        if (cameraState == 'up') {
            this.pos.y += arena.speed;
            if(!this.isThrown)  this.noGravity = true;
            
        } else if (cameraState == 'down') {
            this.pos.y -= arena.speed;
             if(!this.isThrown)this.noGravity = true;

        } else if (cameraState == '') {
            if(!this.isThrown) this.noGravity = false;
        }

        this.draw();
    }
}

export interface IItem {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    isThrowable?: boolean;
    throwRight?: boolean;
}