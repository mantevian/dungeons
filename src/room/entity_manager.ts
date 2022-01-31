import Entity from "../entity/entity";
import Room from "./room";
import Random from "../util/random";
import Mob from "../entity/mob";
import Vec2 from "../util/vec2";
import Game from "../game/game";
import Projectile from "../entity/projectile";
import Turret from "../entity/mob/turret";
import Swordsman from "../entity/mob/swordsman";
import Mage from "../entity/mob/mage";
import Archer from "../entity/mob/archer";

export default class EntityManager {
	readonly room: Room;
	private entities: Map<string, Entity>;
	readonly random: Random;

	constructor(room: Room) {
		this.room = room;
		this.entities = new Map<string, Entity>();
		this.random = new Random();

		for (let i = 0; i < this.random.next_int_ranged(0, 1) + this.random.next_int_ranged(0, this.room.difficulty); i++) {
			let mob = this.random.weighted_random([
				{
					item: new Turret(),
					weight: Math.max(4, 10 - this.room.difficulty) + this.room.biome.id == 'default' ? 5 : 0
				},
				{
					item: new Swordsman(),
					weight: Math.min(6, this.room.difficulty - 2) + this.room.biome.id == 'hell' ? 5 : 0
				},
				{
					item: new Mage(),
					weight: Math.min(6, this.room.difficulty - 1) + this.room.biome.id == 'desert' ? 5 : 0
				},
				{
					item: new Archer(),
					weight: Math.min(6, this.room.difficulty) + this.room.biome.id == 'snow' ? 5 : 0
				}
			]);
			let w = Game.width;
			mob.set_position(new Vec2(this.random.next_int_ranged(2, w - 3) + 0.5, this.random.next_int_ranged(2, w - 3) + 0.5));
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