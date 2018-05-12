import { ActorType } from 'app/ActorType';
import { Disposable } from 'app/Disposable';

export interface Actor extends Disposable {
    actorType: ActorType;
    parent?: Actor;
    x: number;
    y: number;
    vx: number;
    vy: number;
    detectCollision(other: Actor): boolean;
    handleCollision(other: Actor): void;
    getCenter(): PIXI.Point;
    moveTo(x: number, y: number): void;
}
