import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';

export class Projectile extends ActorBase {
    constructor(
        protected options: ActorOptions,
    ) {
        super(options);
        this._vx = 20;
    }
}
