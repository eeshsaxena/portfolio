import EventEmitter from './EventEmitter';
import Application from '../Application';
export default class Mouse extends EventEmitter {
    x: number;
    y: number;
    inComputer: boolean;
    application: Application;

    constructor() {
        super();

        // Setup
        this.x = 0;
        this.y = 0;
        this.inComputer = false;

        // Mouse tracking
        this.on('mousemove', (event: any) => {
            if (event.clientX !== undefined && event.clientY !== undefined) {
                this.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }
            this.inComputer = event.inComputer ? true : false;
        });

        // Touch tracking — map first touch to normalized device coords
        window.addEventListener('touchmove', (event: TouchEvent) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true });

        window.addEventListener('touchstart', (event: TouchEvent) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true });
    }
}
