import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Enemy extends ActorBase {
    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);
    }

    public handleCollision(other: Actor) {
        if (other.actorType === ActorType.Player) {
            return;
        }

        this.dispose();
    }

    /** @override */
    public handleOutOfBounds() {
        // bounce
        this._vx = -this._vx;
        this._vy = -this.vy;
    }

    get actorType() {
        return ActorType.Enemy;
    }
}
