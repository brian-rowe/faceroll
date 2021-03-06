import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Enemy extends ActorBase {
    constructor(
        protected app: Wrapper,
        protected options: ActorOptions<{}>,
    ) {
        super(app, options);
    }

    public handleCollision(other: Actor) {
        switch (other.actorType) {
            // Enemy running into enemy should do nothing, pass through:
            case ActorType.Enemy: {
                return;
            }

            // Player running into enemy should always kill player, not enemy
            case ActorType.Player: {
                return;
            }

            default: {
                // Award the killer some money
                if (other.rootParent) {
                    other.rootParent.money += 10e3;
                }

                this.dispose();
            }
        }
    }

    /** @override */
    public handleOutOfBounds() {
        this.bounce();
    }

    get actorType() {
        return ActorType.Enemy;
    }
}
