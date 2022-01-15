import P5 from "p5";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Game from "./game";

export default class Renderer {
	static game: Game;
	static p5: P5;
	static scale: number;

	static canvas_coords(vec: Vec2): Vec2 {
		return new Vec2(vec.x * this.scale + this.scale / 2, vec.y * this.scale + this.scale / 2);
	}

	static rect(position: Vec2, size: Vec2, color: Color, corner_radius: number) {
		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.rect(this.canvas_coords(position).x, this.canvas_coords(position).y, size.x * this.scale * 0.95, size.y * this.scale * 0.95, corner_radius * this.scale);
	}

	static pointer(position: Vec2, facing: number): void {
		let canvas_pos = this.canvas_coords(position);

		this.p5.push();
		this.p5.stroke(255, 255, 255, 128);
		this.p5.strokeWeight(5);
		this.p5.translate(canvas_pos.x, canvas_pos.y);
		this.p5.rotate(facing);
		this.p5.line(25, 0, 35, 0);
		this.p5.pop();
	}
}