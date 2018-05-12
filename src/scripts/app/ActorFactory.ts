import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Enemy } from 'app/Enemy';
import { Player } from 'app/Player';
import { Projectile } from 'app/Projectile';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorFactory {
    constructor(
        private app: Wrapper,
    ) {
    }

    public createActor(actorType: ActorType, options: ActorOptions): Actor {
        switch (actorType) {
            case ActorType.Enemy:
                return new Enemy(this.app, options);

            case ActorType.Player:
                return new Player(this.app, options);

            case ActorType.Projectile:
                return new Projectile(this.app, options);

            default:
                throw new Error('Invalid actor type!');
        }
    }
}
