import P5 from "p5";
import LivingEntity from "../entity/living_entity";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Game from "./game";

export default class Renderer {
	static game: Game;
	static p5: P5;
	static scale: number;

	static canvas_coords(vec: Vec2): Vec2 {
		return new Vec2(vec.x * this.scale, vec.y * this.scale);
	}

	static rect(position: Vec2, size: Vec2, color: Color, corner_radius: number, scale = 0.95) {
		position = position.modulus_room();
		this.p5.fill(color.get_red(), color.get_green(), color.get_blue(), color.get_alpha());
		this.p5.rect(this.canvas_coords(position).x, this.canvas_coords(position).y, size.x * this.scale * scale, size.y * this.scale * scale, corner_radius * this.scale);
	}

	static pointer(entity: LivingEntity): void {
		let canvas_pos = this.canvas_coords(entity.room_pos());

		this.p5.push();
		this.p5.stroke(255, 255, 255, 64 + (entity.scale - 1) * 128 * 5);
		this.p5.strokeWeight(5 + (entity.scale - 1) * 20);
		this.p5.translate(canvas_pos.x, canvas_pos.y);
		this.p5.rotate(entity.facing);
		this.p5.line(25, 0, 35, 0);
		this.p5.pop();
	}

	static health_bar(position: Vec2, size: Vec2, ratio: number): void {
		this.p5.push();
		this.p5.rectMode('corner');
		Renderer.rect(new Vec2(position.x - size.x * 0.5, position.y - size.y * 0.75), new Vec2(size.x, 0.1), Color.RGBA(128, 128, 128, 128), 0.1, 1);
		Renderer.rect(new Vec2(position.x - size.x * 0.5, position.y - size.y * 0.75), new Vec2(size.x * ratio, 0.1), Color.RGB(255, 50, 50), 0.1, 1);
		this.p5.pop();
	}

	static text(position: Vec2, size: number, color: Color, text: string): void {
		this.p5.push();
		this.p5.textSize(size);
		this.p5.fill(color.get_red(), color.get_green(), color.get_blue(), color.get_alpha());
		this.p5.text(text, this.canvas_coords(position).x, this.canvas_coords(position).y);
		this.p5.pop();
	}
}