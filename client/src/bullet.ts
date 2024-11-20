import { GunType } from "./data.enum";
import { arena, cameraState, ctx, currentMap, currentPhysics, currentPlayer, gunConfigurations, roomId, sprites } from "./general";
import { Vec2 } from "./interfaces.interface";
import { server } from "./main";
import { Player } from "./player";
import { ISpriteData } from "./sprite";

export class Bullet {

    public bulletSprite: ISpriteData;
    public currentFrameOffsetX: number = 0;
    public isRight: boolean;

    public bulletSprites: any = {
        pistol_bullet: {
            ...sprites.createSprite(90, 1450, 30, 10),
            recommendedWidth: 15,
            recommendedHeight: 5
        },
        ak47_bullet: {
            ...sprites.createSprite(260, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        smg_bullet: {
            ...sprites.createSprite(430, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        m14_bullet: {
            ...sprites.createSprite(610, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        shotgun_bullet: {
            ...sprites.createSprite(780, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        bazuka_bullet: {
            ...sprites.createSprite(970, 1440, 110, 30),
            recommendedWidth: 50,
            recommendedHeight: 15
        }
    }

    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public speed: number;
    public initYPos: number;

    public hasHitObject: boolean = false

    constructor({x, y, bulletType, gunType, isRight}: IBullet) {
        this.pos = {
            x,
            y
        };
        this.isRight = isRight;
        this.bulletSprite = this.bulletSprites[bulletType];
        this.width = (this.bulletSprite.recommendedWidth as number);
        this.height = (this.bulletSprite.recommendedHeight as number);

        this.vel = {
            x: 0,
            y: 0
        };

        this.initYPos = y;
    
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
            if (['left', 'right', 'top', 'bottom'].some(side => currentPhysics[side](player, this))) {
                if(player.hp > 0) {
                    player.hp = player.hp - 4;
                }
                this.hasHitObject = true;
            }
        });
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // fix falling/rising effect when camera moves up/down
        if(cameraState == 'up' || cameraState == 'down') this.pos.y = currentPlayer.pos.y;

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