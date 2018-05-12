import { Actor } from 'app/Actor';

export interface ActorOptions {
    parent?: Actor;
    rotation?: number;
    speed?: number;
    scale?: PIXI.Point;
    texture: PIXI.Texture;
}
