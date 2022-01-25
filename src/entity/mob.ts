import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import LivingEntity from "./living_entity";

export default class Mob extends LivingEntity {
	path: Array<Vec2>;
	current_path_progress: number;

	constructor() {
		super();

		this.color = Color.RGB(255, 80, 30);
		this.size = new Vec2(0.7, 0.7);
		this.corner_radius = 0.15;

		this.max_health = 35;
		this.start_prepare_attack = 30;
		this.attack_damage = 6;

		this.path = new Array<Vec2>();
		this.current_path_progress = 0;
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.room_pos()));

		if (this.lifetime % 50 == 0) {
			if (this.current_path_progress == 0) {
				this.path = this.manager.room.tiles.find_path(this.room_pos(), this.manager.room.manager.game.player.room_pos().add(new Vec2(this.manager.random.next_int_ranged(-2, 2), this.manager.random.next_int_ranged(-2, 2))));
				this.current_path_progress = 1;
			}

			if (this.current_path_progress < this.path.length / 2) {
				this.move_to(this.path[this.current_path_progress]);
				this.current_path_progress++;
			}
			else
				this.current_path_progress = 0;
		}

		if (this.lifetime % 120 == 0) {
			this.try_attack();
		}
	}

	render(): void {
		super.render();
		Renderer.pointer(this);
		if (this.health < this.max_health)
			Renderer.health_bar(this.room_pos(), this.size, this.health / this.max_health);
	}
}