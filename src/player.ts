import { IKeys, Vec2 } from "./interfaces.interface";
import { arena, ctx, cvs } from "./general";
import { Physics } from "./physics";
import { Game } from "./main";
import { PlatformElevation } from "./elevation.enum";

export class Player {
    public game: Game;
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;
    public speed: number = 8;
    public keys: IKeys;
    public physics: Physics;
    public currentElevation: PlatformElevation;
    public prevElevation: PlatformElevation;
    public isJumping: boolean = false;
    public camera:any = {
        pos: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0
        },
        width: 1000,
        height: 500,
    };
    
    constructor(game: Game) {
        this.init();    
        this.game = game;
        this.keys = game.keys;
        this.physics = new Physics(game);   
        this.width = 60;
        this.height = 60;
        this.currentElevation = PlatformElevation.ELEVATION_0;
        this.prevElevation = PlatformElevation.ELEVATION_0;
    }

    public updateCamera() {
        this.camera = {
            pos: {
                x: this.pos.x - (this.camera.width / 2 - (this.width / 2)),
                y: this.pos.y - 200
            },
            vel: {
                x: 0,
                y: 0
            },
            width: 1000,
            height: 500,
        }
        if(this.currentElevation == PlatformElevation.ELEVATION_3) {
            if(arena.pos.y < 600) {
                arena.vel.y = arena.speed;
            } else if(arena.pos.y > 600) {
                arena.vel.y = -arena.speed;
            } else if(arena.pos.y == 600) {
                arena.vel.y = 0;
            }
        }
        else if(this.currentElevation == PlatformElevation.ELEVATION_2) {
            if(arena.pos.y < 400) {
                arena.vel.y = arena.speed;
            } else if(arena.pos.y > 400) {
                arena.vel.y = -arena.speed;
            } else if(arena.pos.y == 400) {
                arena.vel.y = 0;
            }
        }
        else if(this.currentElevation == PlatformElevation.ELEVATION_1) {
            if(arena.pos.y < 200) {
                arena.vel.y = arena.speed;
            } else if(arena.pos.y > 200) {
                arena.vel.y = -arena.speed;
            } else if (arena.pos.y == 200) {
                arena.vel.y = 0;
            }
        } else if(this.currentElevation == PlatformElevation.ELEVATION_0) {
            if(arena.pos.y < 0) {
                arena.vel.y = arena.speed;
            } else if (arena.pos.y > 0) {
                arena.vel.y = -arena.speed;
            } else if (arena.pos.y == 0){
                arena.vel.y = 0;
            }
        }
    }

    public isCamLeft() {
        const cameraRight = this.camera.pos.x + this.camera.width;
        return (cameraRight >= cvs.width);
    }

    public isCamRight() {
        const cameraLeft = this.camera.pos.x;
        return (cameraLeft <= 0);
    }

    public init() {
        this.pos = { x: 400, y: 30 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        // ctx.fillStyle = 'rgba(0, 0, 255 , 0.3)';
        // ctx.fillRect(this.camera.pos.x, this.camera.pos.y, this.camera.width, this.camera.height);
    }
    
    public udpate() {
        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.vel.y += this.physics.gravity;

        if(this.vel.y == 0) this.isJumping = false;

        this.updateCamera();
        this.draw();
    }
}