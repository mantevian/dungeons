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

	damage_invincibility_timer: number;
	max_damage_invincibility_timer: number;

	attack_damage: number;
	prepare_attack: number;
	start_prepare_attack: number;

	last_attacker: Entity;

	effects: StatusEffectManager;

	constructor(anchor?: Entity) {
		super(anchor);

		this.noclip = false;

		this.facing = 0;

		this.move_timeout = 0;
		this.max_move_timeout = 10;
		this.moving = Vec2.zero();

		this.health = 50;
		this.max_health = 50;

		this.attack_damage = 5;
		this.prepare_attack = -1;
		this.start_prepare_attack = 1;

		this.max_damage_invincibility_timer = 20;
		this.damage_invincibility_timer = 0;

		this.last_attacker = null;

		this.effects = new StatusEffectManager(this);
	}

	tick(): void {
		this.lifetime++;

		this.effects.tick();

		if (this.damage_invincibility_timer > 0)
			this.damage_invincibility_timer--;

		if (this.move_timeout > 0) {
			this.move_timeout--;
			this.set_position(this.position.add(this.moving));
		}
		else
			this.moving = Vec2.zero();

		if (this.prepare_attack > -1)
			this.prepare_attack--;

		if (this.prepare_attack == 0)
			this.attack();

		if (this.health > this.max_health)
			this.health = this.max_health;

		if (this.health < 1)
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
		let canvas_position = Renderer.canvas_coords(this.position);
		let vec = pos.subtract(canvas_position);
		this.facing = Math.atan2(vec.y, vec.x) * 180 / Math.PI;
	}

	try_attack(): void {
		this.prepare_attack = this.start_prepare_attack;
		this.scale_over_time(1.1, this.start_prepare_attack);
	}

	attack(): void {

	}

	damage(damage: number, source?: Entity, timer = this.max_damage_invincibility_timer): void {
		if (this.damage_invincibility_timer > 0)
			return;

		damage = Math.floor(damage);
		this.health -= damage;
		this.max_damage_invincibility_timer = timer;
		this.damage_invincibility_timer = timer;

		this.manager.room.particles.spawn(new DamageCountParticle(this.position.add(new Vec2(0, this.size.y * -0.5)), damage));

		this.last_attacker = source;
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

		Renderer.rect(this.position, this.size, this.color.lighten(this.damage_invincibility_timer / this.max_damage_invincibility_timer), this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}

	apply_status_effect(effect: StatusEffect) {
		let current = this.effects.find(e => e.id == effect.id);
		if (current) {
			current.ticks = 0;
			current.duration = Math.max(current.duration, effect.duration);
		}
		else
			this.effects.apply(effect);
	}
}