export interface Actor {
    sprite: PIXI.Sprite;
    x: number;
    y: number;
    vx: number;
    vy: number;
    moveTo(x: number, y: number): void;
}
