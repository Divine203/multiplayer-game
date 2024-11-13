import { currentGame, currentPlayer } from "./general";

export class Controls {
    public initializeControls(): void {
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
                    if (currentPlayer.isYou) {
                        if (!currentGame.keys.z.pressed) {
                            currentGame.keys.a.pressed = true;
                        }
                        break
                    }

                case 'z':
                    if (currentPlayer.isYou) {
                        if (!currentGame.keys.a.pressed) {
                            currentGame.keys.z.pressed = true;
                        }
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
                        currentPlayer.throwItem();
                    }
                    break

                case 'z':
                    if (!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = false;
                        currentPlayer.throwItem();
                    }
                    break
            }
        });
    }
}