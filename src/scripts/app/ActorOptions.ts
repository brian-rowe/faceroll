import { Actor } from 'app/Actor';

export interface ActorOptions {
    parent?: Actor;
    rotation?: number;
    /* Pixels per second */
    speed?: number;
    scale?: PIXI.Point;
    texture: PIXI.Texture;
}
