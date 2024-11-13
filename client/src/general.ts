import { Controls } from "./controls";
import { IKeys } from "./interfaces.interface";
import { Game } from "./main";
import { Map1 } from "./map1";
import { Physics } from "./physics";
import { Player } from "./player";
import { UI } from "./ui";

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

export let roomId: string = '';
export let currentPhysics: any;
export let currentControls: any;
export let cameraState: string = ''; // 'up', 'down', '',
export let currentGame: any;
export let currentPlayer: any;
export let currentMap: any;
export let _ui: any;
export let keys: IKeys = {
    right: { pressed: false },
    left: { pressed: false },
    a: { pressed: false },
    z: { pressed: false },
};

export const setPhysics = (physics: Physics): void => {
    currentPhysics = physics;
}

export const setControls = (controls: Controls): void => {
    currentControls = controls;
}

export const setRoomId = (id: string): void => {
    roomId = id;
}

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

export const setUI = (ui: UI): void => {
    _ui = ui;
}

export const MAP_BASE: number = 700;