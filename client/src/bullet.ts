import { GunType } from "./data.enum";
import { arena, cameraState, ctx, currentMap, currentPhysics, currentPlayer, gunConfigurations, roomId, sprites } from "./general";
import { Vec2 } from "./interfaces.interface";
import { Player } from "./player";
import { ISpriteData } from "./sprite";
import { Tile } from "./tile";

export class Bullet {
    public bulletSprite: ISpriteData;
    public currentFrameOffsetX: number = 0;
    public isRight: boolean;


    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public speed: number;
    public initYPos: number;
    public hasHitObject: boolean = false;
    public gunType: GunType;

    constructor({ x, y, bulletType, gunType, isRight }: IBullet) {
        this.pos = {
            x,
            y
        };
        this.isRight = isRight;
        this.bulletSprite = sprites.bulletSprites[bulletType];
        this.width = (this.bulletSprite.recommendedWidth as number);
        this.height = (this.bulletSprite.recommendedHeight as number);

        this.vel = {
            x: 0,
            y: 0
        };

        this.initYPos = y;
        this.gunType = gunType;
        this.speed = gunConfigurations[gunType].bulletSpeed;
    }


    draw() {
        this.currentFrameOffsetX = this.bulletSprite.animate ? (this.bulletSprite.animation as any).frameCut * (this.bulletSprite.animation as any).frameX : 0;
        ctx.save();
        ctx.translate(this.width, 0);
        ctx.scale(this.isRight ? 1 : -1, 1);
        ctx.drawImage(sprites.sheet,
            this.bulletSprite.sX + this.currentFrameOffsetX,
            this.bulletSprite.sY,
            this.bulletSprite.cropWidth,
            this.bulletSprite.cropHeight,
            this.pos.x,
            this.pos.y,
            this.width,
            this.height
        );

        ctx.restore();
    }

    detectHits() {
        currentMap.players.forEach((player: Player) => {
            if (!player.isYou) {
                if (['left', 'right', 'top', 'bottom'].some(side => currentPhysics[side](this, player))) {
                    if (player.armorHp > 0) {
                        player.armorHp = Math.max(player.armorHp - gunConfigurations[this.gunType].damage, 0);
                    } else {
                        if(player.hp > 0) {
                            player.hp = Math.max(player.hp - gunConfigurations[this.gunType].damage, 0);
                        }
                    }
                    this.hasHitObject = true;
                }
            }
        });

        currentMap.tiles.forEach((tile: Tile) => {
            if (['left', 'right', 'top', 'bottom'].some(side => currentPhysics[side](this, tile))) {
                this.hasHitObject = true;
            }
        })
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // fix falling/rising effect when camera moves up/down
        if (cameraState == 'up' || cameraState == 'down') this.pos.y = currentPlayer.pos.y;

        this.pos.x += arena.pos.x;

        this.draw();
        this.detectHits();
    }
}

export interface IBullet {
    x: number;
    y: number;
    bulletType: string;
    gunType: GunType;
    isRight: boolean;
}