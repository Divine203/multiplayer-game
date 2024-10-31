import { Map1 } from "./map1";
import { Player } from "./player";
import { cvs, ctx } from "./general";
import { Controls } from "./controls";
import { IKeys } from "./interfaces.interface";
import { Physics } from "./physics";
import { Tile } from "./tile";

export class Game {
    public map: Map1;
    public player: Player;

    public keys: IKeys = {
        right: { pressed: false },
        left: { pressed: false }
    };
    public controls: Controls;
    public physics: Physics;

    constructor() {
        this.map = new Map1();
        this.player = new Player(this);
        this.controls = new Controls(this);
        this.physics = new Physics(this);

        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    private moveCameraAndPlayer(): void {
        if (this.keys.right.pressed) {
            this.player.vel.x = this.player.speed

        } else if (this.keys.left.pressed) {
            this.player.vel.x = -this.player.speed
        } else {
            this.player.vel.x = 0
        }
    }

    private render(): void {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.map.tiles.forEach((tile: Tile) => {
            tile.update();
            const ph = this.physics.addPhysics(this.player, tile);
            this.player.pos = ph.pos;
            this.player.vel = ph.vel;

        });
        this.moveCameraAndPlayer();
        this.player.udpate();


    }

    private resize(): void {
        const boundingBox = cvs.parentElement!.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;

        cvs.width = boundingBox.width * pixelRatio;
        cvs.height = boundingBox.height * pixelRatio;
        cvs.style.width = `${boundingBox.width}px`;
        cvs.style.height = `${boundingBox.height}px`;

    }

    public update(): void {
        this.render();
    }
}

export const game: Game = new Game();


const animate = () => {
    game.update();
    requestAnimationFrame(animate);
}

animate();