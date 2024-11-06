import { arena, cvs, currentGame, currentPlayer, currentMap } from "./general";
import { IKeys } from "./interfaces.interface";
import { Game } from "./main";
import { Item } from "./item";
import { Player } from "./player";
import { Tile } from "./tile";

export class Controls {
    constructor() {
        this.controls();
    }

    public controls(): void {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    currentPlayer.isJumping = true;
                    currentPlayer.vel.y -= 35;
                    break;
                case 'ArrowLeft':
                    if (!currentGame.keys.right.pressed) {
                        currentGame.keys.left.pressed = true;

                        currentPlayer.state.isRight = false;
                        currentPlayer.state.isLeft = true;
                    }
                    break;
                case 'ArrowRight':
                    if (!currentGame.keys.left.pressed) {
                        currentGame.keys.right.pressed = true;

                        currentPlayer.state.isRight = true;
                        currentPlayer.state.isLeft = false;
                    }
                    break;

                case 'x':
                    currentPlayer.primaryGun.shoot();
                    break

                case 'y':
                    currentPlayer.throwItem();
                    break

                case 'a':
                    if (!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = true;
                    }
                    break
                
                case 'z':
                    if (!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = true;
                    }
                    break
                   
            }   
        });
    
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowLeft':
                    if (!currentGame.keys.right.pressed) {
                        currentGame.keys.left.pressed = false;
                    }
                    break;
                case 'ArrowRight':
                    if (!currentGame.keys.left.pressed) {
                        currentGame.keys.right.pressed = false;
                    }
                    break;
                case 'a':
                    if(!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = false;
                        currentPlayer.throwItem();

                    }
                    break
                
                case 'z':
                    if(!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = false;
                        currentPlayer.throwItem();
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