import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';

export class Player implements Actor {
    private _sprite: PIXI.Sprite;

    constructor(
       private options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
    }
    
    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    get sprite() {
        return this._sprite;
    }

    get x() {
        return this._sprite.position.x;
    }

    get y() {
        return this._sprite.position.y;
    }
}
