import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import LivingEntity from "./living_entity";

export default class Mob extends LivingEntity {
	constructor() {
		super();

		this.color = Color.RGB(255, 80, 30);
		this.size = new Vec2(0.7, 0.7);
		this.corner_radius = 0.15;

		this.max_health = 12;
		this.attack_damage = 3;
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.room_pos()));

		if (this.lifetime % 50 == 0) {
			let v = this.position.step_to(this.manager.room.manager.game.player.room_pos().add(new Vec2(this.manager.random.next_int_ranged(-2, 2), this.manager.random.next_int_ranged(-2, 2))));

			this.move(v);
		}

		if (this.lifetime % 120 == 0) {
			this.attack();
		}
	}

	render(): void {
		super.render();
		Renderer.pointer(this);
		if (this.health < this.max_health)
			Renderer.health_bar(this.room_pos(), this.size, this.health / this.max_health);
	}
}