import { Actor } from 'app/Actor';
import { ActorType } from 'app/ActorType';

/** Singleton to keep track of all actors in memory */
export class ActorManager {
    public static addActor(actor: Actor) {
        if (!this._actors[actor.actorType]) {
            this._actors[actor.actorType] = [];
        }

        this._actors[actor.actorType].push(actor);
    }

    public static getActors(): Actor[] {
        return Array.prototype.concat.apply([], Object.keys(this._actors).map((key: string) => this._actors[parseInt(key, 10)]));
    }

    public static getActorsByType(actorType: ActorType) {
        return this._actors[actorType] || [];
    }

    public static playerIsDead(): boolean {
        return this.getActorsByType(ActorType.Player).length === 0;
    }

    public static removeActor(actor: Actor) {
        const index = this._actors[actor.actorType].indexOf(actor);

        if (index > -1) {
            this._actors[actor.actorType].splice(index, 1);
            actor.dispose();
        }
    }

    public static removeAllActors() {
        this.getActors().forEach(actor => this.removeActor(actor));
    }

    public static removeAllEnemies() {
        this.getActorsByType(ActorType.Enemy).forEach(enemy => this.removeActor(enemy));
    }

    private static _actors: { [actorType: number]: Actor[] } = {};

    private constructor() {}
}
