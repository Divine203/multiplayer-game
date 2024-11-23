import { ItemType } from "./data.enum";
import { ctx, currentPlayer } from "./general";

export class Sprites {
    public sheet: HTMLImageElement;

    public gunSprites: any = {
        pistol: {
            ...this.createSprite(30, 1300, 90, 60),
            recommendedWidth: 40,
            recommendedHeight: 25
        },
        ak47: {
            ...this.createSprite(160, 1300, 160, 70),
            recommendedWidth: 75,
            recommendedHeight: 25
        },
        smg: {
            ...this.createSprite(340, 1290, 150, 90),
            recommendedWidth: 55,
            recommendedHeight: 35
        },
        m14: {
            ...this.createSprite(500, 1290, 160, 80),
            recommendedWidth: 75,
            recommendedHeight: 30
        },
        shotgun: {
            ...this.createSprite(680, 1310, 150, 50),
            recommendedWidth: 75,
            recommendedHeight: 25
        },
        bazuka: {
            ...this.createSprite(840, 1290, 240, 80),
            recommendedWidth: 115,
            recommendedHeight: 35
        }
    };

    public gunFireSprites: any = {
        machinGunFire1: {
            ...this.createSprite(2510, 1150, 180, 260),
            recommendedWidth: 55,
            recommendedHeight: 75
        },
        machinGunFire2: {
            ...this.createSprite(2450, 1500, 240, 130),
            recommendedWidth: 95,
            recommendedHeight: 45
        },

        pistolFire: {
            ...this.createSprite(2850, 1240, 60, 70),
            recommendedWidth: 25,
            recommendedHeight: 30
        },

        shotGunFire: {
            ...this.createSprite(2460, 1750, 240, 110),
            recommendedWidth: 95,
            recommendedHeight: 35
        },

        smallExplosion: {
            ...this.createSprite(2830, 1500, 100, 100),
            recommendedWidth: 50,
            recommendedHeight: 50,
        }
    };

    public itemSprites: any = {
        [ItemType.GRENADE]: {
            ...this.createSprite(70, 1780, 50, 70),
            recommendedWidth: 20,
            recommendedHeight: 30
        },
        [ItemType.HEALTH]: {
            ...this.createSprite(70, 1940, 70, 60),
            recommendedWidth: 40,
            recommendedHeight: 35
        },
        [ItemType.AMMO]: {
            ...this.createSprite(180, 1930, 80, 70),
            recommendedWidth: 40,
            recommendedHeight: 35
        },
        [ItemType.ARMOR]: {
            ...this.createSprite(290, 1930, 80, 70),
            recommendedWidth: 55,
            recommendedHeight: 50
        },
        [ItemType.BARREL]: {
            ...this.createSprite(70, 2040, 80, 100),
            recommendedWidth: 55,
            recommendedHeight: 70
        }
    };

    public bulletSprites: any = {
        pistol_bullet: {
            ...this.createSprite(90, 1450, 30, 10),
            recommendedWidth: 15,
            recommendedHeight: 5
        },
        ak47_bullet: {
            ...this.createSprite(260, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        smg_bullet: {
            ...this.createSprite(430, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        m14_bullet: {
            ...this.createSprite(610, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        shotgun_bullet: {
            ...this.createSprite(780, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        bazuka_bullet: {
            ...this.createSprite(970, 1440, 110, 30),
            recommendedWidth: 50,
            recommendedHeight: 15
        }
    }

    public explosionAnimation: ISpriteData = {
        ...this.createSpriteAnimation(130, 1740, 160, 140, true, 9, 5, 180),
    }

    constructor() {
        this.sheet = new Image();
        this.sheet.src = "/assets/sheet.png";
    }

    
    public createSprite(sX: number, sY: number, cropWidth: number, cropHeight: number): ISpriteData {
        return {
            sX,
            sY,
            cropWidth,
            cropHeight,
            animate: false,
        };
    }

    public createSpriteAnimation(
        sX: number,
        sY: number,
        cropWidth: number,
        cropHeight: number,
        animate: boolean,
        frames: number,
        staggerFrames: number,
        frameCut: number,
        reverse: boolean = false): ISpriteData {

        return {
            sX,
            sY,
            cropWidth,
            cropHeight,
            animate,
            animation: {
                frames,
                staggerFrames,
                frameCut,
                frameX: !reverse ? 0 : frames + 1, // if it's in reverse, start from the last frame
                gameFrame: 0
            },
        };
    }

    public testDraw(sprite: ISpriteData) {

        if (this.sheet.complete) {
            const offsetX = sprite.animate ? (sprite.animation as any).frameCut * (sprite.animation as any).frameX : 0;

            const width = 55;
            const height = 70;

            ctx.fillStyle = 'lime';
            ctx.fillRect(75, 75, 150, 150);

            ctx.strokeStyle = 'red';
            ctx.strokeRect(75,  75, width, height);

            ctx.drawImage(this.sheet,
                sprite.sX + offsetX,
                sprite.sY,
                sprite.cropWidth,
                sprite.cropHeight,
                75,
                75,
                width,
                height
            );


        };

        this.sheet.onerror = () => {
            console.error('Failed to load the image.');
        };
    }

    public animate(sprite: ISpriteData, reverse: boolean = false, loop: boolean = true) {
        if (sprite.animate) {
            let sa: any = sprite.animation;
            if (sa.gameFrame % sa.staggerFrames == 0) {
                if (!reverse) {
                    if (sa.frameX < sa.frames) {
                        sa.frameX++;
                    } else {
                        if(loop) sa.frameX = 0;
                    };
                } else {
                    if (sa.frameX > 0) {
                        sa.frameX--;
                    } else {
                        if(loop) sa.frameX = sa.frames;
                    };
                }
            }
            sa.gameFrame++;
        }
    }

}

export interface ISpriteData {
    sX: number,
    sY: number,
    cropWidth: number,
    cropHeight: number,
    animate: boolean,
    recommendedWidth?: number, // based on default player height 120
    recommendedHeight?: number, // only special cases like slide
    animation?: {
        frames: number,
        staggerFrames: number,
        frameCut: number,
        frameX: number,
        gameFrame: number
    },
}