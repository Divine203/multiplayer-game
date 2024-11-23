import { arena, ctx, cameraState, sprites, currentMap } from "./general";
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
    public isThrowable: boolean;

    public noGravity: boolean = false;
    public xSpeed: number = 25;
    public ySpeed: number = 30;
    public isThrown: boolean = false;
    public isGrenade: boolean = false;
    public explodeCounter: number = 5;
    public throwRight: boolean = true;
    public friction: number = 0.05;
    public noFriction = false;  

    public grenadeSprite: any = {
        default: {
            ...sprites.createSprite(70, 1780, 50, 70),
            recommendedWidth: 20,
            recommendedHeight: 30
        },

        explosionAnimation :  {
            ...sprites.createSpriteAnimation(130, 1740, 160, 140, true, 9, 3, 180),
            recommendedWidth: 110,
            recommendedHeight: 110
        }
    };


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
        if(this.isGrenade && this.explodeCounter > 0) {
            this.width = this.grenadeSprite.default.recommendedWidth;
            this.height = this.grenadeSprite.default.recommendedHeight;
            ctx.drawImage(
                sprites.sheet,
                this.grenadeSprite.default.sX,
                this.grenadeSprite.default.sY,
                this.grenadeSprite.default.cropWidth,
                this.grenadeSprite.default.cropHeight,
                this.pos.x,
                this.pos.y + 10,
                this.width,
                this.height
            );
    
        }
    }

    explode() {
        const  { animate, animation, sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = this.grenadeSprite.explosionAnimation;
        const offsetX = animate ? (animation as any).frameCut * (animation as any).frameX : 0;
        
        ctx.drawImage(sprites.sheet,
            sX + offsetX,
            sY,
            cropWidth,
            cropHeight,
            this.pos.x - 50,
            (this.pos.y - recommendedHeight) + 40, // add slight corrections (10 is for physics displacement)
            recommendedWidth,
            recommendedHeight
        );

        sprites.animate(this.grenadeSprite.explosionAnimation, false, false);
        setTimeout(() => {
            currentMap.items = currentMap.items.filter((i: Item) => (i !== this));
        }, 1000);
    }

    updateThrow() {
        this.xSpeed *= 1 - this.friction;
        if (this.throwRight) {
            this.vel.x = this.xSpeed;
        } else if(!this.throwRight) {
            this.vel.x = -this.xSpeed;
        }

        if(this.isThrown) {
            this.explodeCounter -= 0.05;
        }

        if(this.explodeCounter <= 0) {
            this.explode();
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