import { Actor } from 'app/Actor';
import { ActorSpeed } from 'app/ActorSpeed';

export interface ActorOptions<Attribute> {
    attribute: Attribute;
    parent?: Actor;
    rotation?: number;
    /* Pixels per second */
    speed: ActorSpeed;
    scale?: PIXI.Point;
    texture: PIXI.Texture;
}
