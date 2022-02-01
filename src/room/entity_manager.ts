import Entity from "../entity/entity";
import Room from "./room";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Projectile from "../entity/projectile";
import Mobs from "../entity/mobs";

export default class EntityManager {
	readonly room: Room;
	private entities: Map<string, Entity>;
	readonly random: Random;

	constructor(room: Room, data: Map<string, string>) {
		this.room = room;
		this.entities = new Map<string, Entity>();
		this.random = new Random();

		for (let entry of data) {	
			let pos = Vec2.parse(entry[0]);
			let mob = Mobs.from_id(entry[1]);
			if (!entry[1])
				mob = Mobs.from_id(this.room.biome.next_mob());
			mob.set_position(pos.add(new Vec2(0.5, 0.5)));

			mob.max_health = Math.floor(mob.max_health * (1 + this.room.difficulty / 10));
			mob.attack_damage = Math.floor(mob.attack_damage * (1 + this.room.difficulty / 10));

			this.spawn(mob);
		}
	}

	/** Get an Entity by a uuid */
	get(uuid: string): Entity {
		return this.entities.get(uuid);
	}

	/** Find an Entity using a function predicate. Returns the first found result */
	find(filter: (entity: Entity) => boolean): Entity {
		if (this.size() == 0) return undefined;
		return [...this.entities.entries()].find((value: [string, Entity]) => filter(value[1]))[1];
	}

	/** Add a new Entity */
	spawn(entity: Entity): void {
		entity.manager = this;
		this.entities.set(entity.uuid, entity);
	}

	spawn_projectile(projectile: Projectile, angle: number, speed = 0, position?: Vec2): void {
		if (position) projectile.set_position(position);
		projectile.velocity = Vec2.from_angle(angle).multiply(speed);
		this.spawn(projectile);
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

	/** Get all Entities that fit the filter condition */
	filter(filter: (entity: Entity) => boolean): [string, Entity][] {
		return [...this.entities.entries()].filter((value: [string, Entity]) => filter(value[1]));
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

	with_player(): Array<Entity> {
		return [...this.entities.values(), this.room.manager.game.player];
	}
}