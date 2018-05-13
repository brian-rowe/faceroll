import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Powerup extends ActorBase {
    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);
    }

    public handleCollision(other: Actor) {
        if (other.actorType === ActorType.Player) {
            this.dispose();
        }
    }

    public respondToCollision(other: Actor) {
        if (other.actorType === ActorType.Player) {
            this.dispose();
        }
    }

    get actorType() {
        return ActorType.Powerup;
    }
}
