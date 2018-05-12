export interface Actor {
    x: number;
    y: number;
    vx: number;
    vy: number;
    addTo(container: PIXI.Container): void;
    moveTo(x: number, y: number): void;
}
