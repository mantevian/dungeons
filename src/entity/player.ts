import Game, { PlayerClass } from "../game/game";
import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import LivingEntity from "./living_entity";
import Mob from "./mob";
import Projectile from "./projectile";
import Arrow from "./projectile/arrow";
import Bullet from "./projectile/bullet";
import Fireball from "./projectile/fireball";
import Sword from "./projectile/sword";

export default class Player extends LivingEntity {
	attack_cooldown: number;
	max_attack_cooldown: number;
	attack_scale_duration: number;
	attack_projectile: typeof Projectile;
	projectile_anchored: boolean;
	projectile_speed: number;

	xp: number;

	constructor(game: Game, player_class: PlayerClass) {
		super();

		this.manager = game.room_manager.current_room.entities;
		this.size = new Vec2(0.8, 0.8);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.35;

		this.projectile_anchored = false;

		switch (player_class) {
			case PlayerClass.TURRET:
				this.attack_cooldown = 12;
				this.max_attack_cooldown = 12;
				this.attack_damage = 5;
				this.attack_scale_duration = 5;
				this.attack_projectile = Bullet;
				this.projectile_speed = 0.3;
				this.start_prepare_attack = 1;
				break;
			
			case PlayerClass.SWORDSMAN:
				this.attack_cooldown = 30;
				this.max_attack_cooldown = 30;
				this.attack_damage = 8;
				this.attack_scale_duration = 30;
				this.attack_projectile = Sword;
				this.projectile_anchored = true;
				this.projectile_speed = 0;
				this.start_prepare_attack = 3;
				this.max_health = 60;
				break;
			
			case PlayerClass.MAGE:
				this.attack_cooldown = 20;
				this.max_attack_cooldown = 20;
				this.attack_damage = 5;
				this.attack_scale_duration = 20;
				this.attack_projectile = Fireball;
				this.projectile_speed = 0.15;
				this.start_prepare_attack = 8;
				break;
			
			case PlayerClass.ARCHER:
				this.attack_cooldown = 24;
				this.max_attack_cooldown = 24;
				this.attack_damage = 6;
				this.attack_scale_duration = 24;
				this.attack_projectile = Arrow;
				this.projectile_speed = 0.25;
				this.start_prepare_attack = 5;
				this.max_health = 40;
				break;
		}
		
		this.health = this.max_health;
		this.xp = 0;
	}

	keyup(e: KeyboardEvent): void {

	}

	mousedown(e: MouseEvent): void {
		this.try_attack();
	}

	mouseup(e: MouseEvent): void {
		this.prepare_attack = -1;
	}

	tick(): void {
		super.tick();

		if (this.attack_cooldown > 0)
			this.attack_cooldown--;

		if (this.health < 0)
			this.manager.room.manager.game.stop_caused_by_death();
	}

	can_go_through(position: Vec2): boolean {
		return this.manager.room.manager.passable(position, this.size);
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

		Renderer.pointer(this);

		if (this.damage_invincibility_timer > 0)
			Renderer.rect(new Vec2(0, 0), new Vec2(100, 100), Color.RGBA(255, 100, 0, 32 * this.damage_invincibility_timer / this.max_damage_invincibility_timer), 0);
	}

	try_attack(): void {
		if (this.attack_cooldown > 0)
			return;

		super.try_attack();
	}

	attack(): void {
		this.scale = 1.1;
		let projectile = new this.attack_projectile(this, this.attack_damage);
		if (!this.projectile_anchored) projectile.rotation = this.facing;
		this.manager.spawn_projectile(projectile, this.facing, this.projectile_speed, this.projectile_anchored ? undefined : this.position);
		this.scale_over_time(1, this.attack_scale_duration);

		this.attack_cooldown = this.max_attack_cooldown;
	}

	on_kill(target: Entity): void {
		if (target instanceof Mob)
			this.xp += target.xp;
	}

	keydown(keys: Map<string, number>): void {
		let move = new Vec2(0, 0);

		for (let code of keys.keys())
			switch (code) {
				case 'KeyW':
					move = move.add(new Vec2(0, -1));
					break;

				case 'KeyA':
					move = move.add(new Vec2(-1, 0));
					break;

				case 'KeyS':
					move = move.add(new Vec2(0, 1));
					break;

				case 'KeyD':
					move = move.add(new Vec2(1, 0));
					break;
			}

		this.move(move);
	}

	
}