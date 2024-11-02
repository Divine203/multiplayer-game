import { Map1 } from "./map1";
import { Player } from "./player";
import { cvs, ctx, arena } from "./general";
import { Controls } from "./controls";
import { IKeys } from "./interfaces.interface";
import { Physics } from "./physics";
import { Tile } from "./tile";
import { Camera } from "./camera";
import { Gun } from "./gun";
import { GunType } from "./data.enum";
import { Item } from "./object";

const Matter = require('matter-js');
const { Engine, Render, Runner, Bodies, World } = Matter;

export class Game {
    public cvsMinHeight = 840;
    public map: Map1;
    public player: Player;

    public keys: IKeys = {
        right: { pressed: false },
        left: { pressed: false }
    };
    public camera: Camera;
    public primaryGun: Gun;
    public controls: Controls;
    public physics: Physics;

    constructor() {
        this.map = new Map1();
        this.player = new Player(this);

        this.camera = new Camera(this);
        this.primaryGun = new Gun(this, GunType.PISTOL);
        this.player.camera = this.camera;
        this.player.primaryGun = this.primaryGun;

        this.controls = new Controls(this);
        this.physics = new Physics(this);

        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
        });
    }


    private render(): void {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // this.map.tiles.forEach((tile: Tile) => {
        //     this.physics.add(this.player, tile);
        //     tile.update();

        //     this.map.items.forEach((item: Item) => {
        //         this.physics.add(item, tile);
        //         this.physics.add(this.player, item);
        //     });    
        // });

        this.map.tiles.forEach((tile: Tile, index: number) => {
            tile.update();
        });

        this.map.items.forEach((item: Item, index: number) => {
            item.pos.x = this.physics.worldEntities[4].position.x;
            item.pos.y = this.physics.worldEntities[4].position.y;
            this.physics.worldEntities[4].position.x;
            item.update();
        });

        this.physics.runEngine();

        this.controls.moveCameraAndPlayer(this.player, this.keys);
        this.moveGame();
        // this.player.udpate();


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
        arena.pos.x = this.player.camera.vel.x;
        arena.pos.y += arena.vel.y;
    }

    public update(): void {
        this.render();
    }
}

const game: Game = new Game();


const animate = () => {
    game.update();
    requestAnimationFrame(animate);
}

animate();