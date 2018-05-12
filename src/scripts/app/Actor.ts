export interface Actor {
    x: number;
    y: number;
    vx: number;
    vy: number;
    moveTo(x: number, y: number): void;
}
