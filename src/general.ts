export const cvs: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = cvs.getContext('2d') as CanvasRenderingContext2D;

export const arena: any = {
    pos: {
        x: -600,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },

    speed: 8,
    width: 5120
}
