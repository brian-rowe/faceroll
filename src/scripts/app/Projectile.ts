import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { ProjectileAttribute } from 'app/ProjectileAttribute';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Projectile extends ActorBase {
    // number of enemies to pierce
    private _pierce: number = 0;

    // number of enemies has already pierced
    private _pierced: number = 0;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions<ProjectileAttribute>,
    ) {
        super(app, options);

        if (this.options.attribute.PIERCE) {
            this._pierce = this.options.attribute.PIERCE;
        }
    }

    public handleCollision(other: Actor) {
        // nada
    }

    public handleCollided(other: Actor) {
        switch (other.actorType) {
            case ActorType.Enemy: {
                // Pierce up to the pierce level on the attribute
                if (this._pierced < this._pierce) {
                    this._pierced++;
                    return;
                }

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
