import Game from "../game/game";
import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import LivingEntity from "./living_entity";
import PlayerClasses, { PlayerClass } from "./player_class";
import Weapons, { Weapon } from "./weapon";

export default class Player extends LivingEntity {
	class: PlayerClass;
	weapon: Weapon;

	vitality: number;
	strength: number;
	intelligence: number;

	gold: number;

	constructor(game: Game, player_class: string) {
		super();

		this.manager = game.room_manager.current_room.entities;
		this.size = new Vec2(0.8, 0.8);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.35;

		this.vitality = 5;
		this.strength = 1;
		this.intelligence = 1;

		this.class = PlayerClasses.from_id(player_class);
		this.weapon = Weapons.from_id(this.class.weapon, this);
		
		this.gold = 0;
	}

	keyup(e: KeyboardEvent): void {

	}

	mousedown(e: MouseEvent): void {
		this.try_attack();
	}

	mouseup(e: MouseEvent): void {
		this.weapon.prepare_attack = -1;
	}

	set_vitality(vitality: number) {
		this.vitality = vitality;
		this.max_health = Math.floor(this.vitality * this.class.vitality_multiplier);
	}

	tick(): void {
		super.tick();

		this.weapon.tick();

		if (this.weapon.attack_cooldown > 0)
			this.weapon.attack_cooldown--;
		
		if (this.weapon.prepare_attack > -1)
			this.weapon.prepare_attack--;

		if (this.weapon.prepare_attack == 0)
			this.attack();

		if (this.health < 0)
			this.manager.room.manager.game.stop_caused_by_death();
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
		if (this.weapon.attack_cooldown > 0)
			return;

		this.weapon.prepare_attack = this.weapon.start_prepare_attack;
		this.scale_over_time(1.1, this.weapon.start_prepare_attack);
	}

	attack(): void {
		this.scale = 1.1;
		let projectile = this.weapon.attack();
		if (!this.weapon.projectile_anchored) projectile.rotation = this.facing;
		this.manager.spawn_projectile(projectile, this.facing, this.weapon.projectile_speed, this.weapon.projectile_anchored ? undefined : this.position);
		this.scale_over_time(1, 5);

		this.weapon.attack_cooldown = this.weapon.max_attack_cooldown;
	}

	on_kill(target: Entity): void {

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