import { Actor } from 'app/Actor';
import { ActorSpeed } from 'app/ActorSpeed';

export interface ActorOptions {
    parent?: Actor;
    rotation?: number;
    /* Pixels per second */
    speed: ActorSpeed;
    scale?: PIXI.Point;
    texture: PIXI.Texture;
}
