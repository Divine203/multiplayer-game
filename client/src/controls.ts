import { arena, cvs, currentGame, currentMap, keys } from "./general";
import { IKeys } from "./interfaces.interface";
import { Player } from "./player";
import { Tile } from "./tile";

export class Controls {
    public player: Player;
    constructor(player: Player) {
        this.player = player;
        this.controls();
    }

    public controls(): void {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.player.isJumping = true;
                    this.player.vel.y -= 35;
                    break;
                case 'ArrowLeft':
                    if (!currentGame.keys.right.pressed) {
                        currentGame.keys.left.pressed = true;

                        this.player.state.isRight = false;
                        this.player.state.isLeft = true;
                    }
                    break;
                case 'ArrowRight':
                    if (!currentGame.keys.left.pressed) {
                        currentGame.keys.right.pressed = true;

                        this.player.state.isRight = true;
                        this.player.state.isLeft = false;
                    }
                    break;

                case 'x':
                    this.player.primaryGun.shoot();
                    break

                case 'y':
                    this.player.throwItem();
                    break

                case 'a':
                    console.log('a');
                    if (!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = true;
                    }
                    break

                case 'z':
                    console.log('z');
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
                    if (!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = false;
                        this.player.throwItem();

                    }
                    break

                case 'z':
                    if (!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = false;
                        this.player.throwItem();
                    }
                    break
            }
        });    
    }
}