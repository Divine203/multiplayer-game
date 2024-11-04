import { arena, cvs } from "./general";
import { IKeys } from "./interfaces.interface";
import { Game } from "./main";
import { Item } from "./item";
import { Player } from "./player";
import { Tile } from "./tile";

export class Controls {
    public game: any;

    constructor(Game: Game) {
        this.game = Game;
        this.controls();
    }

    public controls(): void {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.game.player.isJumping = true;
                    this.game.player.vel.y -= 35;
                    break;
                case 'ArrowLeft':
                    if (!this.game.keys.right.pressed) {
                        this.game.keys.left.pressed = true;

                        this.game.player.state.isRight = false;
                        this.game.player.state.isLeft = true;
                    }
                    break;
                case 'ArrowRight':
                    if (!this.game.keys.left.pressed) {
                        this.game.keys.right.pressed = true;

                        this.game.player.state.isRight = true;
                        this.game.player.state.isLeft = false;
                    }
                    break;

                case 'x':
                    this.game.player.primaryGun.shoot();
                    break

                case 'y':
                    this.game.player.throwItem();
                    break

                case 'a':
                    if (!this.game.keys.z.pressed) {
                        this.game.keys.a.pressed = true;
                    }
                    break
                
                case 'z':
                    if (!this.game.keys.a.pressed) {
                        this.game.keys.z.pressed = true;
                    }
                    break
                   
            }   
        });
    
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowLeft':
                    if (!this.game.keys.right.pressed) {
                        this.game.keys.left.pressed = false;
                    }
                    break;
                case 'ArrowRight':
                    if (!this.game.keys.left.pressed) {
                        this.game.keys.right.pressed = false;
                    }
                    break;
                case 'a':
                    if(!this.game.keys.z.pressed) {
                        this.game.keys.a.pressed = false;
                        this.game.player.throwItem();

                    }
                    break
                
                case 'z':
                    if(!this.game.keys.a.pressed) {
                        this.game.keys.z.pressed = false;
                        this.game.player.throwItem();
                    }
                    break
            }
        });    
    }


    public moveCameraAndPlayer(player: Player, keys: IKeys): void {
        if (keys.right.pressed) {
            player.vel.x = player.speed
            if (player.camera.isCamLeft()) {
                player.vel.x = 0;
                if (player.camera.pos.x + player.camera.width < arena.width) {
                    player.camera.vel.x = -(player.speed);
                }
            }

        } else if (keys.left.pressed) {
            player.vel.x = -player.speed;
            if (player.camera.isCamRight()) {
                player.vel.x = 0;
                player.camera.vel.x = (player.speed);
            }

        } else {
            player.vel.x = 0;
        }
    }

}