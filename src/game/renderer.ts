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
		return new Vec2(vec.x * this.scale + 450, vec.y * this.scale);
	}

	static game_coords(vec: Vec2): Vec2 {
		return new Vec2((vec.x - 450) / this.scale, vec.y / this.scale);
	}

	static rect(position: Vec2, size: Vec2, color: Color, corner_radius: number, options = { scale: 0.95, rotation: 0 }) {
		this.p5.push();
		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.translate(this.canvas_coords(position).x, this.canvas_coords(position).y);
		this.p5.rotate(options.rotation);
		this.p5.rect(0, 0, size.x * this.scale * options.scale, size.y * this.scale * options.scale, corner_radius * this.scale);
		this.p5.pop();
	}

	static pointer(entity: LivingEntity): void {
		let canvas_pos = this.canvas_coords(entity.position);

		this.p5.push();
		this.p5.stroke(255, 255, 255, 64 + (entity.scale - 1) * 128 * 5);
		this.p5.strokeWeight(5 + (entity.scale - 1) * 20);
		this.p5.translate(canvas_pos.x, canvas_pos.y);
		this.p5.rotate(entity.facing);
		this.p5.line(30 * (entity.size.x + entity.size.y) / 2, 0, 40 * (entity.size.x + entity.size.y) / 2, 0);
		this.p5.pop();
	}

	static health_bar(position: Vec2, size: Vec2, ratio: number): void {
		this.p5.push();
		this.p5.rectMode('corner');
		Renderer.rect(new Vec2(position.x - size.x * 0.5, position.y - size.y * 0.75), new Vec2(size.x, 0.1), Color.RGBA(128, 128, 128, 128), 0.1, { scale: 1, rotation: 0 });
		Renderer.rect(new Vec2(position.x - size.x * 0.5, position.y - size.y * 0.75), new Vec2(size.x * ratio, 0.1), Color.RGB(255, 50, 50), 0.1, { scale: 1, rotation: 0 });
		this.p5.pop();
	}

	static text(position: Vec2, size: number, color: Color, text: string, centered = false): void {
		this.p5.push();
		if (centered)
			this.p5.textAlign('center', 'center');

		this.p5.textSize(size);
		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.text(text, this.canvas_coords(position).x, this.canvas_coords(position).y);
		this.p5.pop();
	}

	static map(): void {
		this.p5.push();
		this.p5.translate(210, 300);
		this.p5.rectMode('corner');

		for (let room of this.game.room_manager.array()) {
			let color: Color;
			color = room.biome.map_color;

			this.p5.fill(color.red, color.green, color.blue, room.visited ? 255 : 140);
			this.p5.rect(room.position.x * 20, room.position.y * 20, 15, 15);

			this.p5.fill(64, 64, 64);
			this.p5.rect(room.position.x * 20 + 2, room.position.y * 20 + 2, 11, 11);

			if (room.cleared) {
				this.p5.fill(64, 220, 64);
				this.p5.rect(room.position.x * 20 + 2, room.position.y * 20 + 2, 11, 11);
			}

			this.p5.fill(110, 110, 110);

			if (!room.visited)
				this.p5.fill(85, 85, 85);
			
			if (room.has_door('left'))
				this.p5.rect(room.position.x * 20 - 2.5, room.position.y * 20 + 5, 2.5, 5);

			if (room.has_door('right'))
				this.p5.rect(room.position.x * 20 + 15, room.position.y * 20 + 5, 2.5, 5);

			if (room.has_door('up'))
				this.p5.rect(room.position.x * 20 + 5, room.position.y * 20 - 2.5, 5, 2.5);

			if (room.has_door('down'))
				this.p5.rect(room.position.x * 20 + 5, room.position.y * 20 + 15, 5, 2.5);
		}

		this.p5.fill(0, 0, 0, 0);
		this.p5.stroke(255, 255, 255);
		this.p5.strokeWeight(2);
		this.p5.rect(this.game.room_manager.current_room.position.x * 20 - 1, this.game.room_manager.current_room.position.y * 20 - 1, 17, 17)

		this.p5.pop();
	}

	static sword(position: Vec2, size: Vec2, color: Color, corner_radius: number, options = { scale: 1, rotation: 0 }) {
		this.p5.push();

		this.p5.translate(this.canvas_coords(position).x, this.canvas_coords(position).y);
		this.p5.rotate(options.rotation);
		let size_scaled = size.multiply(this.scale).multiply(options.scale);

		this.p5.fill(128, 128, 128);
		this.p5.rect(0, 0, size_scaled.x, size_scaled.y * 0.4, corner_radius * this.scale);

		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.rect(size_scaled.x * 0.1, 0, size_scaled.x * 0.8, size_scaled.y, corner_radius * this.scale);

		this.p5.fill(128, 128, 128);
		this.p5.rect(-size_scaled.x * 0.3, 0, size_scaled.x * 0.05, size_scaled.y * 2, corner_radius * this.scale);
		this.p5.pop();
	}

	static arrow(position: Vec2, size: Vec2, color: Color, corner_radius: number, options = { scale: 1, rotation: 0 }) {
		this.p5.push();

		this.p5.translate(this.canvas_coords(position).x, this.canvas_coords(position).y);
		this.p5.rotate(options.rotation);
		let size_scaled = size.multiply(this.scale).multiply(options.scale);

		this.p5.fill(128, 128, 128);
		this.p5.rect(0, 0, size_scaled.x, size_scaled.y * 0.5, corner_radius * this.scale);

		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.rect(size_scaled.x * 0.5, 0, size_scaled.x * 0.3, size_scaled.y, corner_radius * this.scale);
		this.p5.pop();
	}
}