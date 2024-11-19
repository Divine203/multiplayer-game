import { sprites } from "./general";

export enum UIEvent {
    CREATED_ROOM = 'createdRoom',
    JOINED_ROOM = 'joinedRoom',
    INITIALIZED_PLAYERS = 'initializedPlayers',
    START_GAME = 'startGame',
    
    ERR_CREATING_ROOM = 'errorCreatingRoom',
    ERR_JOINING_ROOM = 'errorJoiningRoom',
}

export enum GunType {
    PISTOL = 'pistol',
    AK47 = 'ak47',
    SMG = 'smg',
    M14 = 'm14',
    SHOTGUN = 'shotgun',
    BAZUKA = 'bazuka',
}
