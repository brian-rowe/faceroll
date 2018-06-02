import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Projectile extends ActorBase {
    private _pierce: boolean = false;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);
    }

    public handleCollision(other: Actor) {
        // nada
    }

    public handleCollided(other: Actor) {
        switch (other.actorType) {
            case ActorType.Enemy: {
                // Destroy the bullet
                this.dispose();
            }

            default: {
                return;
            }
        }
    }

    get actorType() {
        return ActorType.Projectile;
    }
}
