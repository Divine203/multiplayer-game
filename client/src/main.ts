import { Player } from "./player";
import { cvs, ctx, arena, currentMap, currentPlayer, _ui, currentPhysics } from "./general";
import { IKeys } from "./interfaces.interface";
import { Tile } from "./tile";
import { Item } from "./item";
import Socket from "./socket";
export class Game {
    public cvsMinHeight = 840;

    public keys: IKeys = {
        right: { pressed: false },
        left: { pressed: false },
        a: { pressed: false },
        z: { pressed: false },
    };

    constructor() {
        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
        });
    }


    private render(): void {
        if (!_ui.isMainMenuActive && !_ui.inRoom) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Physics relationship
            if (currentPhysics) {
                currentMap.tiles.forEach((tile: Tile) => {
                    currentPhysics.add(currentPlayer, tile);
                    tile.update();

                    currentMap.items.forEach((item: Item) => {
                        currentPhysics.add(item, tile);
                        if (!item.isThrowable) {
                            currentPhysics.add(currentPlayer, item);
                        }
                    });
                });

                currentMap.items.forEach((item: Item) => {
                    currentMap.items.forEach((item2: Item) => {
                        currentPhysics.add(item, item2);
                    });
                    item.update();
                });

                currentMap.players.forEach((player: Player) => {
                    if (!player.isYou) {
                        player.udpate();
                    }
                });
            }
            //
            this.moveGame();
            currentPlayer.udpate();
        }

        _ui.update();
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