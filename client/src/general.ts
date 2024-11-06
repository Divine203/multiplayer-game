import { IKeys } from "./interfaces.interface";
import { Game } from "./main";
import { Map1 } from "./map1";
import { Player } from "./player";

export const cvs: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = cvs.getContext('2d') as CanvasRenderingContext2D;

export const arena: any = {
    pos: {
        x: 0,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },

    speed: 8,
    width: 5120
}

export let cameraState: string = ''; // 'up', 'down', '',
export let currentGame: any;
export let currentPlayer: any;
export let currentMap: any;
export let keys: IKeys = {
    right: { pressed: false },
    left: { pressed: false },
    a: { pressed: false },
    z: { pressed: false },
};

export const setCameraState = (state: string): void => {
    cameraState = state;
}

export const setGame = (game: Game): void => {
    currentGame = game;
}

export const setPlayer = (player: Player): void => {
    currentPlayer = player;
}

export const setMap = (map: Map1): void => {
    currentMap = map;
}