import { ItemType } from "./data.enum";
import { arena, ctx, cameraState, sprites, currentMap } from "./general";
import { Vec2 } from "./interfaces.interface";
import { gravity } from "./physics";
import { v4 as uuidv4 } from 'uuid';
import { ISpriteData } from "./sprite";

export class Item {
    public _id: string | any = uuidv4();
    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public initYPos: number;

    public isPlayer: boolean = false;
    public isRest: boolean = false;
    public isThrowable: boolean;

    public noGravity: boolean = false;
    public xSpeed: number = 25;
    public ySpeed: number = 30;
    public isThrown: boolean = false;

    public itemType: ItemType;

    public explodeCounter: number = 5;
    public hasPhysics: boolean = false;
    public throwRight: boolean = true;
    public friction: number = 0.05;
    public noFriction = false;

    public isExploding: boolean = false;

    public grenadeSprite: any = {
        explosionAnimation: {
            ...sprites.createSpriteAnimation(130, 1740, 160, 140, true, 9, 3, 180),
            recommendedWidth: 110,
            recommendedHeight: 110
        }
    };

    constructor({ x, y, width, height, itemType, hasPhysics = false, isThrowable = false, throwRight = false }: IItem) {
        this.pos = { x, y } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
        this.width = width;
        this.height = height;
        this.initYPos = y;
        this.isThrowable = isThrowable;
        this.itemType = itemType;
        this.hasPhysics = hasPhysics;
        if (this.isThrowable) {
            this.throwRight = throwRight;
        };

    }

    draw() {
        let sprite: ISpriteData = sprites.itemSprites[this.itemType];
        if (!this.isExploding && this.explodeCounter > 0)  {
            let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = sprite;
            this.width = recommendedWidth as number;
            this.height = recommendedHeight as number;
            ctx.drawImage(
                sprites.sheet,
                sX,
                sY,
                cropWidth,
                cropHeight,
                this.pos.x,
                this.isThrowable || this.itemType == ItemType.BARREL ? this.pos.y + 10 : this.pos.y + 10,
                this.width,
                this.height
            );
        }
    }

    explode() {
        const { animate, animation, sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = this.grenadeSprite.explosionAnimation;
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
        this.isExploding = true;
        setTimeout(() => {
            currentMap.items = currentMap.items.filter((i: Item) => (i !== this));
        }, 300);
    }

    updateThrow() {
        this.xSpeed *= 1 - this.friction;
        if (this.throwRight) {
            this.vel.x = this.xSpeed;
        } else if (!this.throwRight) {
            this.vel.x = -this.xSpeed;
        }

        if (this.isThrown) {
            this.explodeCounter -= 0.05;
        }

        if (this.explodeCounter <= 0) {
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
        this.draw();
        if (this.isThrown) {
            this.updateThrow();
        }

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.pos.x += arena.pos.x;
        if (!this.noGravity) this.vel.y += gravity;

        // fix bouncing effect as platform moves with camera
        if (cameraState == 'up') {
            this.pos.y += arena.speed;
            if (!this.isThrown) this.noGravity = true;

        } else if (cameraState == 'down') {
            this.pos.y -= arena.speed;
            if (!this.isThrown) this.noGravity = true;

        } else if (cameraState == '') {
            if (!this.isThrown) this.noGravity = false;
        }
    }
}

export interface IItem {
    x: number;
    y: number;
    width: number;
    height: number;
    itemType: ItemType;
    hasPhysics?: boolean;
    isThrowable?: boolean;
    throwRight?: boolean;
}