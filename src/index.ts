const cvs = document.getElementById('c') as HTMLCanvasElement;
const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;


class Game {
    public ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx  = ctx;

        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, cvs.width, cvs.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);
    }

    resize() {
        const boundingBox = cvs.parentElement!.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;

        cvs.width = boundingBox.width * pixelRatio;
        cvs.height = boundingBox.height * pixelRatio;
        cvs.style.width = `${boundingBox.width}px`;
        cvs.style.height = `${boundingBox.height}px`;
        
    }

    update() {
        this.draw();
    }
}

const game = new Game(ctx);
const animate = () => {
    game.update();
    requestAnimationFrame(animate);
}

animate();