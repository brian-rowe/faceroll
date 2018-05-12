import { Disposable } from 'app/Disposable';

export interface Actor extends Disposable {
    x: number;
    y: number;
    vx: number;
    vy: number;
    detectCollision(other: Actor): boolean;
    getCenter(): PIXI.Point;
    moveTo(x: number, y: number): void;
}
