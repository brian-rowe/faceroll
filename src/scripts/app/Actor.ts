export interface Actor {
    sprite: PIXI.Sprite;
    x: number;
    y: number;
    moveTo(x: number, y: number): void;
}
