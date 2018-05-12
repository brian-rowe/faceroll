import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Projectile extends ActorBase {
    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);
        this._vx = 20;
    }

    public handleCollision() {
        // keep flying
    }
}
