import { ctx, currentPlayer } from "./general";

export class Sprites {
    public sheet: HTMLImageElement;

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

            const width = 90;
            const height = 90;

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