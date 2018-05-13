import { ActorType } from 'app/ActorType';
import { Disposable } from 'app/Disposable';

export interface Actor extends Disposable {
    actorType: ActorType;
    parent?: Actor;
    height: number;
    x: number;
    y: number;
    width: number;
    vx: number;
    vy: number;
    detectCollision(other: Actor): boolean;
    handleCollision(other: Actor): void;
    handleOutOfBounds(): void;
    getCenter(): PIXI.Point;
    moveTo(x: number, y: number): void;
}
