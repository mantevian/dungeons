import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Coin from "./coin";
import entity from "./entity";
import LivingEntity from "./living_entity";

export default class Mob extends LivingEntity {
	path: Array<Vec2>;
	current_path_progress: number;

	attack_damage: number;
	prepare_attack: number;
	start_prepare_attack: number;

	gold: number;

	constructor() {
		super();

		this.color = Color.RGB(255, 80, 30);
		this.size = new Vec2(0.7, 0.7);
		this.corner_radius = 0.15;

		this.max_health = 1;
		this.start_prepare_attack = 1;
		this.attack_damage = 1;

		this.path = new Array<Vec2>();
		this.current_path_progress = 0;

		this.gold = 1;
	}

	tick(): void {
		super.tick();

		if (this.prepare_attack > -1)
			this.prepare_attack--;

		if (this.prepare_attack == 0)
			this.attack();
	}

	render(): void {
		super.render();
		Renderer.pointer(this);
		if (this.health < this.max_health)
			Renderer.health_bar(this.position, this.size, this.health / this.max_health);
	}

	update_path(): void {
		this.current_path_progress = 1;
	}

	try_attack(): void {
		super.try_attack();
		
		this.prepare_attack = this.start_prepare_attack;
		this.scale_over_time(1.1, this.start_prepare_attack);
	}

	walk(): void {
		if (this.current_path_progress == 0)
			this.update_path();

		if (this.current_path_progress < this.path.length / 2) {
			let vec = this.path[this.current_path_progress];
			let d = new Vec2(vec.subtract(this.position).x, vec.subtract(this.position).y);
			if (Math.abs(d.x) > 1.01 || Math.abs(d.y) > 1.01) {
				this.update_path();
			}
			else {
				this.move_to(vec);
				this.current_path_progress++;
			}
		}
		else
			this.current_path_progress = 0;
	}

	destroy(source?: entity): void {
		let coin = new Coin(this.gold);
		coin.set_position(this.position);
		this.manager.spawn(coin);

		super.destroy(source);
	}
}