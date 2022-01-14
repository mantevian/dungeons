import Entity from "../entity/entity";
import { v4 as uuid } from "uuid";
import Room from "./room";
import Random from "../util/random";
import BasicMob from "../entity/basic_mob";
import Vec2 from "../util/vec2";

export default class EntityManager {
	readonly room: Room;
	private entities: Map<string, Entity>;
	readonly random: Random;

	constructor(room: Room) {
		this.room = room;
		this.entities = new Map<string, Entity>();
		this.random = new Random();

		for (let i = 0; i < this.random.next_int_ranged(0, 2); i++) {
			let mob = new BasicMob();
			mob.set_position(new Vec2(this.random.next_int_ranged(2, 18), this.random.next_int_ranged(2, 18)));
			this.spawn(mob);
		}
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
		entity.manager = this;
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