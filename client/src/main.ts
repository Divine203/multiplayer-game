import { Player } from "./player";
import { cvs, ctx, arena, currentMap, currentPlayer, _ui, currentPhysics } from "./general";
import { IKeys } from "./interfaces.interface";
import { Tile } from "./tile";
import { Item } from "./item";
import Socket from "./socket";
import { Gun } from "./gun";
import { ItemType } from "./data.enum";
export class Game {
    public cvsMinHeight = 840;

    public keys: IKeys = {
        right: { pressed: false },
        left: { pressed: false },
        a: { pressed: false },
        z: { pressed: false },
        t: { pressed: false },
        y: { pressed: false }
    };

    constructor() {
        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
        });
        window.addEventListener('mousedown', (e) => {
            let mouseX = e.clientX - cvs.getBoundingClientRect().left;
            let mouseY = e.clientY - cvs.getBoundingClientRect().top;

            currentMap.items.push(new Item({ x: mouseX, y: mouseY, width: 100, height: 100, itemType: ItemType.HEALTH, hasPhysics : true, isBox: true }));
    
        });
    }

    private render(): void {
        if (!_ui.isMainMenuActive && !_ui.inRoom) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.fillStyle = "#495250";
            // ctx.fillStyle = "#";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Physics relationship
            if (currentPhysics) {
                currentMap.tiles.forEach((tile: Tile) => {
                    currentPhysics.add(currentPlayer, tile);
                    tile.update();

                    currentMap.items.forEach((item: Item) => {
                        currentPhysics.add(item, tile);

                    });
                });
                currentMap.guns.forEach((gun: Gun, index: number) => {

                    currentMap.tiles.forEach((tile: Tile) => {
                        currentPhysics.add(gun, tile);
                    });
                    if (!gun.isPicked) {
                        if (currentPhysics.allSides(currentPlayer, gun)) {
                            currentPlayer.viewedGun = [gun, index];
                        }
                    }

                    if (gun) {
                        gun.update();
                    }
                });
                currentMap.items.forEach((item: Item) => {
                    currentMap.items.forEach((item2: Item) => {
                        if (item.hasPhysics && item2.hasPhysics) {
                            currentPhysics.add(item, item2);
                        }
                    });
                    item.update();
                });
                currentMap.players.forEach((player: Player) => {
                    if (!player.isYou) {
                        player.udpate();
                    }
                });
            }




            this.moveGame();
            currentPlayer.udpate();
        }

        // _ui.update();
    }

    private resize(): void {
        const boundingBox = cvs.parentElement!.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;

        cvs.width = boundingBox.width * pixelRatio;
        cvs.height = boundingBox.height * pixelRatio >= this.cvsMinHeight ? boundingBox.height * pixelRatio : this.cvsMinHeight;
        cvs.style.width = `${boundingBox.width}px`;
        cvs.style.height = `${boundingBox.height >= this.cvsMinHeight / pixelRatio ? boundingBox.height : this.cvsMinHeight / pixelRatio}px`;
    }

    public moveGame = () => {
        arena.pos.x = currentPlayer.camera.vel.x;
        arena.pos.y += arena.vel.y;
    }

    public update(): void {
        this.render();
    }
}

export const server = new Socket();

const animate = () => {
    server.update();
    requestAnimationFrame(animate);
}

animate();










const sheet: any = {};


const sprites = {
    runRight: {
        ...sheet.createSprite(1970, 0, 50, 160),
        recommendedWidth: 140,
        recommendedHeight: 120
    },
    runLeft: {
        ...sheet.createSprite(1900, 50, 250, 160),
        recommendedWidth: 140,
        recommendedHeight: 120
    },
    jumpRight: {
        ...sheet.createSprite(4532, 0, 50, 120),
        recommendedWidth: 60,
        recommendedHeight: 100
    },
    jumpLeft: {
        ...sheet.createSprite(4732, 230, 50, 320),
        recommendedWidth: 60,
        recommendedHeight: 100
    },
    dieRight: {
        sprite: 'dieRight.png',
        recommendedWidth: 75,
        recommendedHeight: 120,
    },
    dieLeft: {
        sprite: 'dieLeft.png',
        recommendedWidth: 75,
        recommendedHeight: 120
    },
};


const sprite: any = {};
const width = 100;
const height = 100;



ctx.drawImage(sheet,
    sprite.sX,
    sprite.sY,
    sprite.cropWidth,
    sprite.cropHeight,
    75,
    75,
    width,
    height
);

