import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorOptions } from 'app/ActorOptions';

export class Enemy extends ActorBase {
    constructor(
        protected options: ActorOptions,
    ) {
        super(options);
    }
}
