import Entity from "../entity/entity";
import { v4 as uuid } from "uuid";

export default class EntityManager {
	private entities: Map<string, Entity>;

	constructor() {
		this.entities = new Map<string, Entity>();
	}

	/** Get an Entity by a uuid */
	get(uuid: string): Entity {
		return this.entities.get(uuid);
	}

	/** Find an Entity using a function predicate. Returns the first found result */
	find(filter: (entity: Entity) => boolean): Entity {
		return [...this.entities.entries()].find((value: [string, Entity]) => filter(value[1]))[1];
	}

	/** Add a new Entity */
	spawn(entity: Entity): void {
		this.entities.set(uuid(), entity);
	}

	/** Remove an Entity by a uuid */
	remove(uuid: string): void {
		this.entities.delete(uuid);
	}

	/** Remove all entities that fit the filter condition */
	prune(filter: (entity: Entity) => boolean): void {
		for (let entry of [...this.entities.entries()].filter((value: [string, Entity]) => filter(value[1])))
			this.entities.delete(entry[0]);
	}

	/** The amount of entities */
	size(): number {
		return this.entities.size;
	}

	/** Parse as an array */
	array(): Array<Entity> {
		return [...this.entities.values()];
	}

	/** Tick every Entity */
	tick(): void {
		for (let entity of this.array())
			entity.tick();
	}
}