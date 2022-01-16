import Game from "../game/game";
import Renderer from "../game/renderer";
import DamageCountParticle from "../particle/damage_count";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import Player from "./player";
import Projectile from "./projectile";

export default class LivingEntity extends Entity {
	facing: number;

	move_timeout: number;
	max_move_timeout: number;
	moving: Vec2;

	health: number;
	max_health: number;
	damage_invincibility_timer: number;
	max_damage_invincibility_timer: number;

	attack_damage: number;

	last_attacker: Entity;

	constructor(anchor?: Entity) {
		super(anchor);

		this.noclip = false;

		this.facing = 0;

		this.move_timeout = 0;
		this.max_move_timeout = 10;
		this.moving = Vec2.zero();

		this.health = 20;
		this.max_health = 20;

		this.attack_damage = 1;

		this.max_damage_invincibility_timer = 20;
		this.damage_invincibility_timer = 0;

		this.last_attacker = null;
	}

	tick(): void {
		this.lifetime++;

		if (this.damage_invincibility_timer > 0)
			this.damage_invincibility_timer--;

		if (this.move_timeout > 0) {
			this.move_timeout--;
			this.set_position(this.position.add(this.moving));
		}
		else
			this.moving = Vec2.zero();
		
		if (this.health > this.max_health)
			this.health = this.max_health;

		if (this.health <= 0)
			this.destroy(this.last_attacker);

		this.render();
	}

	move(vec: Vec2): void {
		if (vec.equals(Vec2.zero()))
			return;

		if (this.move_timeout > 0)
			return;

		let new_position = this.position.add(vec);
		let new_position_no_x = this.position.add(vec.multiply_vector(new Vec2(0, 1)));
		let new_position_no_y = this.position.add(vec.multiply_vector(new Vec2(1, 0)));

		if (!(this instanceof Player))
			if (new_position.x > Game.width - 1 || new_position.x < 0 || new_position.y > Game.width - 1 || new_position.y < 0) {
				this.on_tile_collision();
				return;
			}

		if ((this.can_go_through(new_position) && this.can_go_through(new_position_no_x) && this.can_go_through(new_position_no_y)) || this.noclip) {
			this.moving = vec.multiply(1 / this.max_move_timeout);
			this.move_timeout = this.max_move_timeout;
		}
		else {
			this.on_tile_collision();
		}
	}

	look(pos: Vec2): void {
		let canvas_position = Renderer.canvas_coords(this.room_pos());
		let vec = pos.subtract(canvas_position);
		this.facing = Math.atan2(vec.y, vec.x) * 180 / Math.PI;
	}

	attack(): void {
		this.manager.spawn_projectile(this.room_pos(), new Projectile(this, this.attack_damage), this.facing, 0.2);
		this.scale = 1.1;
	}

	damage(damage: number, source: Entity, timer = this.max_damage_invincibility_timer): void {
		this.health -= damage;
		this.max_damage_invincibility_timer = timer;
		this.damage_invincibility_timer = timer;

		this.manager.room.particles.spawn(new DamageCountParticle(this.room_pos().add(new Vec2(0, this.size.y * -0.5)), damage));

		this.last_attacker = source;
	}

	render(): void {
		if (this.scale > 1)
			this.scale -= 0.01;
		else this.scale = 1;

		Renderer.rect(this.room_pos(), this.size, this.color.lighten(this.damage_invincibility_timer / this.max_damage_invincibility_timer), this.corner_radius, this.scale);
	}
}