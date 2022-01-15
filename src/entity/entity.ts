import Renderer from "../game/renderer";
import EntityManager from "../room/entity_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import { v4 as uuid } from "uuid";
import Player from "./player";
import Game from "../game/game";

export default class Entity {
	manager: EntityManager;
	readonly uuid: string;

	readonly position: Vec2;
	velocity: Vec2;

	size: Vec2;
	color: Color;
	corner_radius: number;

	lifetime: number;

	move_timeout: number;
	current_move_timeout: number;

	facing: number;

	health: number;
	max_health: number;
	damage_invincibility_timer: number;
	max_damage_invincibility_timer: number;

	anchor: Entity;

	constructor(anchor?: Entity) {
		this.uuid = uuid();

		this.position = Vec2.zero();
		this.velocity = Vec2.zero();

		this.size = new Vec2(0.5, 0.5);
		this.color = Color.RGB(255, 255, 255);
		this.corner_radius = 0;

		this.lifetime = 0;

		this.move_timeout = 5;
		this.current_move_timeout = 0;

		this.facing = 0;

		this.health = 20;
		this.max_health = 20;

		this.max_damage_invincibility_timer = 20;
		this.damage_invincibility_timer = 0;

		this.anchor = anchor;
	}

	/** Force position this Entity */
	set_position(position: Vec2): void {
		if (this.anchor)
			this.position.copy(position.add(this.anchor.position));
		else
			this.position.copy(position);
	}

	get_position(): Vec2 {
		return this.position.modulus_room();
	}

	move(vec: Vec2, timeout = true): void {
		if (this.current_move_timeout > 0)
			return;

		let new_position = this.position.add(vec);

		if (!(this instanceof Player))
			if (new_position.x > Game.width || new_position.x < 0 || new_position.y > Game.width || new_position.y < 0)
				this.on_moved_into_obstacle();

		if (this.can_go_through(new_position))
			this.set_position(new_position);
		else {
			this.set_position(this.position.add(new Vec2(-0.5, -0.5).round()));
			this.on_moved_into_obstacle();
		}

		if (timeout)
			this.current_move_timeout = this.move_timeout;
	}

	/** Tick this Entity */
	tick(): void {
		this.lifetime++;

		if (this.current_move_timeout > 0)
			this.current_move_timeout = Math.floor(this.current_move_timeout - 1);

		this.move(this.velocity, false);

		if (this.damage_invincibility_timer > 0)
			this.damage_invincibility_timer--;

		if (this.health <= 0)
			this.destroy();

		this.render();
	}

	collides_with_entity(entity: Entity): boolean {
		return entity.uuid != this.uuid &&
			this.get_position().x - this.size.x * 0.5 < entity.get_position().x + entity.size.x * 0.5 &&
			this.get_position().x + this.size.x * 0.5 > entity.get_position().x - entity.size.x * 0.5 &&
			this.get_position().y - this.size.x * 0.5 < entity.get_position().y + entity.size.y * 0.5 &&
			this.get_position().y + this.size.y * 0.5 > entity.get_position().y - entity.size.y * 0.5;
	}

	collides_with_tiles(): boolean {
		return !this.can_go_through(new Vec2(this.get_position().x - this.size.x * 0.5, this.get_position().y - this.size.y * 0.5))
			|| !this.can_go_through(new Vec2(this.get_position().x - this.size.x * 0.5, this.get_position().y + this.size.y * 0.5))
			|| !this.can_go_through(new Vec2(this.get_position().x + this.size.x * 0.5, this.get_position().y - this.size.y * 0.5))
			|| !this.can_go_through(new Vec2(this.get_position().x + this.size.x * 0.5, this.get_position().y + this.size.y * 0.5));
	}

	on_moved_into_obstacle(): void {

	}

	can_go_through(position: Vec2): boolean {
		return this.manager.room.passable(position);
	}

	look(pos: Vec2): void {
		let canvas_position = Renderer.canvas_coords(this.get_position());
		let vec = pos.subtract(canvas_position);
		this.facing = Math.atan2(vec.y, vec.x) * 180 / Math.PI;
	}

	damage(damage: number, timer = this.max_damage_invincibility_timer): void {
		this.health -= damage;
		this.max_damage_invincibility_timer = timer;
		this.damage_invincibility_timer = timer;
	}

	destroy(): void {
		this.manager.remove(this.uuid);
	}

	render(): void {
		let color = this.color.lighten(this.damage_invincibility_timer / this.max_damage_invincibility_timer);

		Renderer.rect(this.get_position(), this.size, color, this.corner_radius);
	}
}