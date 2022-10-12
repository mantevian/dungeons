import Game from "../game/game";
import Renderer from "../game/renderer";
import DamageCountParticle from "../particle/damage_count";
import Vec2 from "../util/vec2";
import StatusEffect from "./effect/status_effect";
import StatusEffectManager from "./effect/status_effect_manager";
import Entity from "./entity";
import Player from "./player";

export default class LivingEntity extends Entity {
	facing: number;

	move_timeout: number;
	max_move_timeout: number;
	moving: Vec2;

	last_attacker: Entity;

	effects: StatusEffectManager;

	constructor() {
		super();
		
		this.noclip = false;

		this.facing = 0;

		this.move_timeout = 0;
		this.max_move_timeout = 10;
		this.moving = Vec2.zero();

		this.last_attacker = null;

		this.effects = new StatusEffectManager(this);
	}

	tick(): void {
		this.lifetime++;

		this.effects.tick();

		if (this.move_timeout > 0) {
			this.move_timeout--;
			this.set_position(this.position.add(this.moving));
		}
		else
			this.moving = Vec2.zero();

		this.health.tick();

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
		else
			this.on_tile_collision();
	}

	look(pos: Vec2): void {
		let canvas_position = Renderer.canvas_coords(this.position);
		let vec = pos.subtract(canvas_position);
		this.facing = Math.atan2(vec.y, vec.x) * 180 / Math.PI;
	}

	try_attack(): void {

	}

	attack(): void {

	}

	damage(damage: number, source?: Entity, timer?: number): void {
		damage = this.health.damage(damage, timer);
		
		if (damage == 0)
			return;

		this.manager.room.particles.spawn(new DamageCountParticle(this.position.add(new Vec2(0, this.size.y * -0.5)), damage));

		if (source)
			this.last_attacker = source;
	}

	destroy(): void {
		super.destroy();
		if (this.last_attacker)
			this.last_attacker.on_kill(this);
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

		Renderer.rect(this.position, this.size, this.color.lighten(this.health.invincibility_timer_ratio), this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}

	apply_status_effect(effect: StatusEffect): void {
		let current = this.effects.find(e => e.id == effect.id);
		if (current) {
			current.ticks = 0;
			current.duration = Math.max(current.duration, effect.duration);
		}
		else
			this.effects.apply(effect);
	}
}