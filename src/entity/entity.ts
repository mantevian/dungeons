import Renderer from "../game/renderer";
import EntityManager from "../room/entity_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import { v4 as uuid } from "uuid";
import Game from "../game/game";

export default class Entity {
	manager: EntityManager;
	readonly uuid: string;

	position: Vec2;
	noclip: boolean;

	size: Vec2;
	color: Color;
	corner_radius: number;
	scale: number;

	lifetime: number;

	parent: Entity;
	anchored: boolean;

	constructor(parent?: Entity) {
		this.uuid = uuid();

		this.position = Vec2.zero();
		this.noclip = true;

		this.size = new Vec2(0.5, 0.5);
		this.color = Color.RGB(255, 255, 255);
		this.corner_radius = 0;
		this.scale = 1;

		this.lifetime = 0;

		this.parent = parent;
		this.anchored = false;
	}

	move(vec: Vec2): void {
		if (vec.equals(Vec2.zero()))
			return;

		let new_position = this.position.add(vec);
		let new_position_no_x = this.position.add(vec.multiply_vector(new Vec2(0, 1)));
		let new_position_no_y = this.position.add(vec.multiply_vector(new Vec2(1, 0)));

		if (new_position.x > Game.width - 1 || new_position.x < 0 || new_position.y > Game.width - 1 || new_position.y < 0) {
			this.on_tile_collision();
			return;
		}

		if ((this.can_go_through(new_position) && this.can_go_through(new_position_no_x) && this.can_go_through(new_position_no_y)) || this.noclip)
			this.set_position(new_position);
		else
			this.on_tile_collision();
	}

	tick(): void {
		this.lifetime++;

		if (!this.noclip) {
			for (let entity of this.manager.with_player().filter(e => !e.noclip)) {
				if (this.collides_with_entity(entity) && !entity.equals(this.parent))
					this.on_entity_collision(entity);
			}
		}

		this.render();
	}

	collides_with_entity(entity: Entity): boolean {
		return !this.equals(entity) &&
			this.room_pos().x - this.size.x * 0.5 < entity.room_pos().x + entity.size.x * 0.5 &&
			this.room_pos().x + this.size.x * 0.5 > entity.room_pos().x - entity.size.x * 0.5 &&
			this.room_pos().y - this.size.x * 0.5 < entity.room_pos().y + entity.size.y * 0.5 &&
			this.room_pos().y + this.size.y * 0.5 > entity.room_pos().y - entity.size.y * 0.5;
	}

	on_tile_collision(): void {

	}

	on_entity_collision(entity: Entity): void {

	}

	can_go_through(position: Vec2): boolean {
		return this.manager.room.tiles.passable(position, this.size);
	}

	destroy(source?: Entity): void {
		this.manager.remove(this.uuid);

		if (source)
			source.on_kill(this);
	}

	on_kill(target: Entity): void {

	}

	render(): void {
		Renderer.rect(this.room_pos(), this.size, this.color, this.corner_radius, this.scale);
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

	room_pos(): Vec2 {
		return this.position.modulus_room();
	}
}