import { ItemType } from "./data.enum";
import { arena, ctx, cameraState, sprites, currentMap, currentPhysics, _sound } from "./general";
import { Vec2 } from "./interfaces.interface";
import { gravity } from "./physics";
import { v4 as uuidv4 } from 'uuid';
import { ISpriteData } from "./sprite";
import { Player } from "./player";

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
    public explostionDamage: number = 50;

    public explosionPosX: number;
    public explosionPosY: number;

    public soundTheExplosion: boolean = true;

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
        this.explosionPosX = x;
        this.explosionPosY = y;
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

    detecExplosionHit() {
        currentMap.players.forEach((p: Player) => {
            if (currentPhysics.allSides(p, this)) {
                if (p.armorHp > 0) {
                    p.armorHp = Math.max(p.armorHp - this.explostionDamage, 0);
                } else {
                    if(p.hp > 0) {
                        p.hp = Math.max(p.hp - this.explostionDamage, 0);
                    }
                }
                p.vel.y -= 10;
            }
        });
    }

    explode() {
        if(this.soundTheExplosion) {
            _sound.playAudio(_sound.sound.explosion);
            this.soundTheExplosion = false;
        }
        this.isExploding = true;
        const { animate, animation, sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = this.grenadeSprite.explosionAnimation;
        const offsetX = animate ? (animation as any).frameCut * (animation as any).frameX : 0;
        this.pos.x = this.explosionPosX - 50;
        this.pos.y = (this.explosionPosY - recommendedHeight) + 40;  // add slight corrections (10 is for physics displacement)
        this.width = recommendedWidth,
        this.height = recommendedHeight;
        ctx.drawImage(sprites.sheet,
            sX + offsetX,
            sY,
            cropWidth,
            cropHeight,
            this.pos.x,
            this.pos.y,
            this.width,
            this.height
        );
        sprites.animate(this.grenadeSprite.explosionAnimation, false, false);
        this.detecExplosionHit();
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

        if (this.explodeCounter <= 0) {
            this.explode();
        }

        if (!this.isExploding) {
            this.explosionPosX = this.pos.x;
            this.explosionPosY = this.pos.y;
        }

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.explosionPosX += this.vel.x;
        this.explosionPosY += this.vel.y;

        this.pos.x += arena.pos.x;
        this.explosionPosX += arena.pos.x;

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