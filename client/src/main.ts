import { Map1 } from "./map1";
import { Player } from "./player";
import { cvs, ctx, arena, currentMap, currentPlayer } from "./general";
import { Controls } from "./controls";
import { IKeys } from "./interfaces.interface";
import { Physics } from "./physics";
import { Tile } from "./tile";
import { Camera } from "./camera";
import { Gun } from "./gun";
import { GunType } from "./data.enum";
import { Item } from "./item";
import Socket from "./socket";
import { Line } from "./lines";

export class Game {
    public cvsMinHeight = 840;

    public keys: IKeys = {
        right: { pressed: false },
        left: { pressed: false },
        a: { pressed: false },
        z: { pressed: false },
    };
    public physics: Physics;

    constructor() {
        this.physics = new Physics();

        this.resize();
        // window.addEventListener("resize", () => {
        //     this.resize();
        // });
    }


    private render(): void {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Physics relationship
        currentMap.tiles.forEach((tile: Tile) => {
            this.physics.add(currentPlayer, tile);
            tile.update();

            currentMap.items.forEach((item: Item) => {
                this.physics.add(item, tile);
                if (!item.isThrowable) {
                    this.physics.add(currentPlayer, item);
                }
            });
        });

        currentMap.items.forEach((item: Item, index: number) => {
            currentMap.items.forEach((item2: Item) => {
                this.physics.add(item, item2);
            });
            item.update();
        });

        currentMap.players.forEach((player: Player) => {
            if (!player.isYou) {
                player.udpate();
                // currentMap.tiles.forEach((tile: Tile) => {
                //     this.physics.add(player, tile);
                // });
            }
        });
        //
        this.moveGame();
        currentPlayer.udpate();
    }

    private resize(): void {
        // const boundingBox = cvs.parentElement!.getBoundingClientRect();
        // const pixelRatio = window.devicePixelRatio;

        // cvs.width = boundingBox.width * pixelRatio;
        // cvs.height = boundingBox.height * pixelRatio >= this.cvsMinHeight ? boundingBox.height * pixelRatio : this.cvsMinHeight;
        // cvs.style.width = `${boundingBox.width}px`;
        // cvs.style.height = `${boundingBox.height >= this.cvsMinHeight / pixelRatio ? boundingBox.height : this.cvsMinHeight / pixelRatio}px`;
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