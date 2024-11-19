export interface Vec2 {
    x: number,
    y: number
}

export interface Vec4 {
    x1: number,
    y1: number,
    x2: number,
    y2: number
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
    z: { pressed: boolean },
    t: { pressed: boolean },
    y: { pressed: boolean }
}
