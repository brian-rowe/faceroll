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
        switch (other.actorType) {
            // Player running into enemy should always kill player, not enemy
            case ActorType.Player: {
                return;
            }

            default: {
                this.dispose();
            }
        }
    }

    /** @override */
    public handleOutOfBounds() {
        // bounce
        this.reverseXDirection();
        this.reverseYDirection();
    }

    get actorType() {
        return ActorType.Enemy;
    }
}
