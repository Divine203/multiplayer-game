export class Sound {

    public userVolume: number = 50;
    public soundPath: string | any = '../assets/sound/';

    constructor() {}

    public sound = {
        ak471: {
            file: new Audio(`${this.soundPath}ak47-1.mp3`),
            baseVolume: 0.3
        },
        ak472: {
            file: new Audio(`${this.soundPath}ak47-2.mp3`),
            baseVolume: 0.3
        },
        bazooka: {
            file: new Audio(`${this.soundPath}bazooka-1.mp3`),
            baseVolume: 0.5
        },
        m14: {
            file: new Audio(`${this.soundPath}m14-1.mp3`),
            baseVolume: 0.5
        },
        m142: {
            file: new Audio(`${this.soundPath}m14-2.mp3`),
            baseVolume: 0.8
        },
        pistol: {
            file: new Audio(`${this.soundPath}pistol-1.mp3`),
            baseVolume: 0.8
        },
        reload: {
            file: new Audio(`${this.soundPath}reload-1.mp3`),
            baseVolume: 0.5
        },
        reload2: {
            file: new Audio(`${this.soundPath}reload-2.mp3`),
            baseVolume: 0.5
        },
        shotGun1: {
            file: new Audio(`${this.soundPath}shot-gun-1.mp3`),
            baseVolume: 0.8
        },
        smg1: {
            file: new Audio(`${this.soundPath}smg-1.mp3`),
            baseVolume: 0.5
        },
        bulletHitPlayer: {
            file: new Audio(`${this.soundPath}bullet-hit-player-1.mp3`),
            baseVolume: 0.5
        },
        deathEuh: {
            file: new Audio(`${this.soundPath}death-euh.mp3`),
            baseVolume: 0.5
        },
        explosion: {
            file: new Audio(`${this.soundPath}explosion.mp3`),
            baseVolume: 2
        },
        footsteps: {
            file: new Audio(`${this.soundPath}footsteps.mp3`),
            baseVolume: 0.5
        },
        healthUp: {
            file: new Audio(`${this.soundPath}health-up.mp3`),
            baseVolume: 0.8
        },
        slide: {
            file: new Audio(`${this.soundPath}slide.mp3`),
            baseVolume: 2
        }
    }

    private adjustVolume(baseVolume: number): number {
        return (this.userVolume / 100) * baseVolume;
    }

    public playAudio(audio_file: AudioObj): void {
        audio_file.file.volume = this.adjustVolume(audio_file.baseVolume); // Adjust volume
        if (audio_file.file.volume === 0) {
            return
        }
        audio_file.file.play().then();
        if (!audio_file.file.ended || !audio_file.file.paused) {
            audio_file.file.currentTime = 0;
            audio_file.file.play().then();
        }
    }
}

export interface AudioObj {
    file: HTMLAudioElement,
    baseVolume: number // base volume for each sound
}
