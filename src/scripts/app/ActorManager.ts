import { Actor } from 'app/Actor';

/** Singleton to keep track of all actors in memory */
export class ActorManager {
    public static addActor(actor: Actor) {
        this._actors.push(actor);
    }

    public static getActors() {
        return this._actors;
    }

    public static removeActor(actor: Actor) {
        const index = this._actors.indexOf(actor);

        if (index > -1) {
            this._actors.splice(index, 1);
        }
    }

    private static _actors: Actor[] = [];

    private constructor() {}
}
