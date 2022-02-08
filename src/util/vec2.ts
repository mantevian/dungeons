import Game from "../game/game";
import SAT from "sat";

export default class Vec2 {
	x: number;
	y: number;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}


	set(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}


	copy(vec: Vec2): void {
		this.x = vec.x;
		this.y = vec.y;
	}

	clone(): Vec2 {
		return new Vec2(this.x, this.y);
	}


	static zero(): Vec2 {
		return new Vec2(0, 0);
	}


	static i(): Vec2 {
		return new Vec2(1, 0);
	}


	static j(): Vec2 {
		return new Vec2(0, 1);
	}

	static one(): Vec2 {
		return new Vec2(1, 1);
	}

	add(vec: Vec2): Vec2 {
		return new Vec2(this.x + vec.x, this.y + vec.y);
	}

	subtract(vec: Vec2): Vec2 {
		return new Vec2(this.x - vec.x, this.y - vec.y);
	}

	multiply(n: number): Vec2 {
		return new Vec2(this.x * n, this.y * n);
	}

	multiply_vector(vec: Vec2): Vec2 {
		return new Vec2(this.x * vec.x, this.y * vec.y);
	}

	toString(): string {
		return `${this.x},${this.y}`
	}

	static parse(str: string): Vec2 {
		return new Vec2(parseInt(str.split(',')[0]), parseInt(str.split(',')[1]));
	}

	modulus_room(): Vec2 {
		let w = Game.width;
		return new Vec2(this.x >= 0 ? this.x % w : (w - Math.abs(this.x) % w) % w, this.y >= 0 ? this.y % w : (w - Math.abs(this.y) % w) % w);
	}

	to(vec: Vec2) {
		return new Vec2(vec.x - this.x, vec.y - this.y);
	}

	step_to(vec: Vec2) {
		return Vec2.step(this.to(vec));
	}

	static step(vec: Vec2) {
		let new_vec = vec;

		if (new_vec.x > 0)
			new_vec.x = 1;

		if (new_vec.x < 0)
			new_vec.x = -1;

		if (new_vec.y > 0)
			new_vec.y = 1;

		if (new_vec.y < 0)
			new_vec.y = -1;

		return new_vec;
	}

	static from_angle(angle: number): Vec2 {
		return new Vec2(Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180));
	}

	round(): Vec2 {
		return new Vec2(Math.round(this.x), Math.round(this.y));
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(): Vec2 {
		return new Vec2(this.x / this.length, this.y / this.length);
	}

	equals(vec: Vec2): boolean {
		return this.x == vec.x && this.y == vec.y;
	}

	floor(): Vec2 {
		return new Vec2(Math.floor(this.x), Math.floor(this.y));
	}

	constrain_room(): Vec2 {
		let vec = this.clone();
		if (vec.x < 0)
			vec.x = 0;

		if (vec.y < 0)
			vec.y = 0;

		if (vec.x > Game.width - 1)
			vec.x = Game.width - 1;

		if (vec.y > Game.width - 1)
			vec.y = Game.width - 1;

		return vec;
	}

	rotate(angle: number): Vec2 {
		let rad = angle * Math.PI / 180;
		return new Vec2(Math.cos(rad * this.x) - Math.sin(rad * this.y), Math.cos(rad * this.x) + Math.sin(rad * this.y));
	}

	static from_direction(direction: 'left' | 'right' | 'up' | 'down'): Vec2 {
		switch (direction) {
			case 'left': return new Vec2(-1, 0);
			case 'right': return new Vec2(1, 0);
			case 'up': return new Vec2(0, -1);
			case 'down': return new Vec2(0, 1);
		}
	}

	left(): Vec2 {
		return new Vec2(this.x - 1, this.y);
	}

	right(): Vec2 {
		return new Vec2(this.x + 1, this.y);
	}

	up(): Vec2 {
		return new Vec2(this.x, this.y - 1);
	}

	down(): Vec2 {
		return new Vec2(this.x, this.y + 1);
	}

	sat_vector(): SAT.Vector {
		return new SAT.Vector(this.x, this.y);
	}

	get rotation(): number {
		return Math.atan2(this.y, this.x) * 180 / Math.PI;
	}

	is_effectively_zero(): boolean {
		return Math.abs(this.x) < 0.001 && Math.abs(this.y) < 0.001;
	}

	static point_inside_rect(point: Vec2, pos: Vec2, size: Vec2) {
		return point.x > pos.x - size.x / 2
			&& point.x < pos.x + size.x / 2
			&& point.y > pos.y - size.y / 2
			&& point.y < pos.y + size.y / 2
	}
}