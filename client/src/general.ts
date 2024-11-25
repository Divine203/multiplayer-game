import { Controls } from "./controls";
import { GunType } from "./data.enum";
import { Gun } from "./gun";
import { Item } from "./item";
import { Game } from "./main";
import { Map1 } from "./map1";
import { Physics } from "./physics";
import { Player } from "./player";
import { Sound } from "./sound";
import { Sprites } from "./sprite";
import { Tile } from "./tile";
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

export const spawn = (xLoc: number): void => {
    currentMap.tiles.forEach((t: Tile) => t.pos.x += xLoc);
    currentMap.items.forEach((i: Item) => i.pos.x += xLoc);
    currentMap.players.forEach((p: Player) => p.pos.x += xLoc);
    currentMap.guns.forEach((g: Gun) => g.pos.x += xLoc);
}

export let sprites: Sprites;
export let roomId: string = '';
export let currentPhysics: any;
export let currentControls: any;
export let cameraState: string = ''; // 'up', 'down', '',
export let currentGame: any;
export let currentPlayer: any;
export let currentMap: any;
export let _ui: any;
export let _sound: Sound = new Sound();

export const setSprites = (sp: Sprites): void => {
    sprites = sp;
}

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

export const setSound = (sound: any): void => {
    _sound = sound;
}

export const MAP_BASE: number = 700;
export const gunConfigurations: any = {
    [GunType.PISTOL]: {
        bulletSpeed: 35,
        fireRate: 4, // shots per second
        damage: 5,
        mag: 100,
        sound: _sound.sound.pistol
    },
    [GunType.AK47]: {
        bulletSpeed: 40,
        fireRate: 18,
        damage: 5,
        mag: 400,
        sound: _sound.sound.ak471
    },
    [GunType.M14]: {
        bulletSpeed: 40,
        fireRate: 8,
        damage: 5,
        mag: 400,
        sound: _sound.sound.m142
        
    },
    [GunType.SMG]: {
        bulletSpeed: 45,
        fireRate: 12,
        damage: 4,
        mag: 500,
        sound: _sound.sound.smg1
    },
    [GunType.SHOTGUN]: {
        bulletSpeed: 65,
        fireRate: 2,
        damage: 20,
        mag: 50,
        sound: _sound.sound.shotGun1
    },
    [GunType.BAZUKA]: {
        bulletSpeed: 20,
        fireRate: 1,
        damage: 30,
        mag: 10,
        sound: _sound.sound.bazooka
    }
};