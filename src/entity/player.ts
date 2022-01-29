import Game from "../game/game";
import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import LivingEntity from "./living_entity";
import Mob from "./mob";
import Bullet from "./projectile/bullet";
import Sword from "./projectile/sword";

export default class Player extends LivingEntity {
	attack_cooldown: number;
	max_attack_cooldown: number;

	xp: number;

	constructor(game: Game) {
		super();

		this.manager = game.room_manager.current_room.entities;
		this.size = new Vec2(0.8, 0.8);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.35;

		this.attack_cooldown = 30;
		this.max_attack_cooldown = 30;

		switch (game.player_class) {
			case 'swordsman':
				this.attack_damage = 8;
				break;

			case 'turret':
				this.attack_damage = 12;
				break;
		}
		
		this.xp = 0;
	}

	keyup(e: KeyboardEvent): void {

	}

	mousedown(e: MouseEvent): void {
		this.try_attack();
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

		switch (this.manager.room.manager.game.player_class) {
			case 'swordsman':
				console.log(this.attack_damage)
				this.manager.spawn_projectile(new Sword(this, this.attack_damage), this.facing);
				this.scale_over_time(1, 30);
				break;
			
			case 'turret':
				this.manager.spawn_projectile(new Bullet(this, this.attack_damage), this.facing, 0.2, this.position);
				this.scale_over_time(1, 10);
				break;
		}
		
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