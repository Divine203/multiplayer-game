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

export const readableTextByGunType: Record<GunType, string> = {
    [GunType.PISTOL]: "Pistol",
    [GunType.AK47]: "AK47",
    [GunType.SMG]: "SMG",
    [GunType.M14]: "M14",
    [GunType.SHOTGUN]: "Shotgun",
    [GunType.BAZUKA]: "Bazooka",
};

export enum ItemType {
    GRENADE = 'grenade',
    HEALTH = 'health',
    ARMOR = 'armor',
    AMMO = 'ammo',
    BARREL = 'barrel',
}
