export interface Vec2 {
    x: number,
    y: number
}

export interface Entity {
    pos: Vec2,
    vel: Vec2,
    width: number,
    height: number
}

export interface IKeys {
    right: { pressed: boolean },
    left: { pressed: boolean },
    a: { pressed: boolean },
    z: { pressed: boolean }
}
