import { ActorType } from 'app/ActorType';
import { Disposable } from 'app/Disposable';

export interface Actor extends Disposable {
    actorType: ActorType;
    parent?: Actor;
    rootParent?: Actor;
    height: number;
    money: number;
    x: number;
    y: number;
    width: number;
    vx: number;
    vy: number;
    detectCollision(other: Actor): boolean;

    /** What happens if something touches the center of this? */
    handleCollision(other: Actor): void;

    /** What happens if this touched the center of something? */
    handleCollided(other: Actor): void;

    /** What happens if this leaves the playing area? */
    handleOutOfBounds(): void;

    getCenter(): PIXI.Point;
    moveTo(x: number, y: number): void;
}
