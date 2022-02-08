import Renderer from "../game/renderer";
import EntityManager from "../room/entity_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import { v4 as uuid } from "uuid";
import Game from "../game/game";
import SAT from 'sat';

export default class Entity {
	manager: EntityManager;
	readonly uuid: string;

	position: Vec2;
	noclip: boolean;

	health: number;
	max_health: number;

	size: Vec2;
	rotation: number;
	color: Color;
	corner_radius: number;
	scale: number;
	scale_time: number;
	scale_per_tick: number;

	lifetime: number;

	parent: Entity;
	anchored: boolean;

	constructor(parent?: Entity) {
		this.uuid = uuid();

		this.position = Vec2.zero();
		this.noclip = true;

		this.size = new Vec2(0.5, 0.5);
		this.rotation = 0;
		this.color = Color.RGB(255, 255, 255);
		this.corner_radius = 0;
		this.scale = 1;
		this.scale_time = 0;
		this.scale_per_tick = 0;

		this.lifetime = 0;

		this.parent = parent;
		this.anchored = false;
	}

	move(vec: Vec2): void {
		if (vec.is_effectively_zero()) return;

		let new_length = this.trace_tiles(vec.rotation, vec.length, 0.001) * 1.05;
		vec = vec.multiply(new_length / vec.length);
		if (vec.is_effectively_zero()) return;

		let new_position = this.position.add(vec);

		if (new_position.x > Game.width || new_position.x < 0 || new_position.y > Game.width || new_position.y < 0) {
			this.on_tile_collision();
			return;
		}

		this.set_position(new_position);
	}

	move_to(vec: Vec2): void {
		this.move(vec.subtract(this.position));
	}

	step_to(vec: Vec2): void {
		this.move(Vec2.step(vec.subtract(this.position)));
	}

	tick(): void {
		this.lifetime++;

		if (!this.noclip) {
			for (let entity of this.manager.with_player().filter(e => !e.noclip)) {
				if (this.parent) {
					if (this.collides_with_entity(entity) && !entity.equals(this.parent))
						this.on_entity_collision(entity);
				}
				else {
					if (this.collides_with_entity(entity))
						this.on_entity_collision(entity);
				}
			}
		}

		if (!this.can_go_through(this.position) && !this.noclip)
			this.on_tile_collision();

		this.render();

		if (this.anchored)
			this.follow();
		
		if (this.health <= 0)
			this.destroy();
	}

	sat_polygon(): SAT.Polygon {
		return new SAT.Polygon(this.position.sat_vector(), [new SAT.Vector(-this.size.x * this.scale / 2, -this.size.y * this.scale / 2),
		new SAT.Vector(this.size.x * this.scale / 2, -this.size.y * this.scale / 2),
		new SAT.Vector(this.size.x * this.scale / 2, this.size.y * this.scale / 2),
		new SAT.Vector(-this.size.x * this.scale / 2, this.size.y * this.scale / 2)]).rotate(this.rotation * Math.PI / 180);
	}

	collides_with_entity(entity: Entity): boolean {
		return !this.equals(entity) && SAT.testPolygonPolygon(this.sat_polygon(), entity.sat_polygon());
	}

	on_tile_collision(): void {

	}

	on_entity_collision(entity: Entity): void {

	}

	can_go_through(position: Vec2): boolean {
		let polygon = new SAT.Polygon(position.sat_vector(), this.sat_polygon().points);
		return this.manager.room.tiles.passable(polygon);
	}

	destroy(source?: Entity): void {
		this.manager.remove(this.uuid);

		if (source)
			source.on_kill(this);
	}

	on_kill(target: Entity): void {

	}

	render(): void {
		if (this.scale_time > 0) {
			this.scale_time--;
			this.scale += this.scale_per_tick;
		}
		else {
			this.scale = 1;
			this.scale_per_tick = 0;
		}

		Renderer.rect(this.position, this.size, this.color, this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}

	equals(entity: Entity): boolean {
		return this.uuid === entity.uuid;
	}

	set_position(position: Vec2): void {
		if (this.parent && this.anchored)
			this.position.copy(position.add(this.parent.position));
		else
			this.position.copy(position);
	}

	scale_over_time(scale: number, time: number): void {
		this.scale_per_tick = (scale - this.scale) / time;
		this.scale_time = time;
	}

	follow(): void {

	}

	trace_tiles(angle: number, max_distance = 10, step = 0.05): number {
		let current = this.position;
		let vec = Vec2.from_angle(angle).multiply(step);

		let distance = 0;

		while (distance < max_distance) {
			current = current.add(vec);
			distance += step;
			let polygon = new SAT.Polygon(current.sat_vector(), this.sat_polygon().points)
			if (!this.manager.room.tiles.passable(polygon)) break;
		}

		return distance;
	}

	distance_to(entity: Entity): number {
		return entity.position.subtract(this.position).length;
	}
}