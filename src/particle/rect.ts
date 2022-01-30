import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Particle from "./particle";

export default class RectangleParticle extends Particle {
	size: Vec2;
	color: Color;
	corner_radius: number;
	scale: number;
	rotation: number;
	velocity: Vec2;
	acceleration: Vec2;

	constructor(position: Vec2, size: Vec2, color: Color, corner_radius: number, scale: number, rotation: number) {
		super();

		this.lifetime = 30;
		this.position = position;
		this.size = size;
		this.color = color;
		this.corner_radius = corner_radius;
		this.scale = scale;
		this.rotation = rotation;

		this.velocity = Vec2.zero();
		this.acceleration = Vec2.zero();
	}

	tick(): void {
		super.tick();
		this.velocity = this.velocity.multiply_vector(this.acceleration);
		this.position = this.position.add(this.velocity);
	}

	render(): void {
		Renderer.rect(this.position, this.size, this.color, this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}
}