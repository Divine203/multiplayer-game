import { arena, ctx, currentMap, currentPhysics, roomId } from "./general";
import { Vec2 } from "./interfaces.interface";
import { server } from "./main";
import { Player } from "./player";

export class Bullet {

    public pos: Vec2;
    public vel: Vec2;
    public width: number;
    public height: number;
    public speed: number;
    public initYPos: number;

    constructor({x, y, width, height}: IBullet) {
        this.pos = {
            x,
            y
        };
        this.width = width;
        this.height = height;

        this.vel = {
            x: 0,
            y: 0
        };

        this.initYPos = y;
        this.speed = 35;
    }


    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    detectHits() {
        currentMap.players.filter((p: Player) => !p.isYou).forEach((player: Player) => {
            if (['left', 'right', 'top', 'bottom'].some(side => currentPhysics[side](player, this))) {
                player.hp = player.hp - 4;

                server.host.emit('player-bullet-hit', {
                    playerId: player.id,
                    roomId: roomId
                });
            }
        });
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos.x += arena.pos.x;

        this.draw();
        this.detectHits();
    }
}



export interface IBullet {
    x: number;
    y: number;
    width: number;
    height: number;
}