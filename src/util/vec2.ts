import Game from "../game/game";

export default class Vec2 {
	x: number;
	y: number;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

	/** Set this Vector by coordinates */
	set(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	/** Copy from another Vector */
	copy(vec: Vec2): void {
		this.x = vec.x;
		this.y = vec.y;
	}

	/** (0, 0) */
	static zero(): Vec2 {
		return new Vec2(0, 0);
	}

	/** (1, 0) */
	static i(): Vec2 {
		return new Vec2(1, 0);
	}

	/** (0, 1) */
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

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(): Vec2 {
		return new Vec2(this.x / this.length(), this.y / this.length());
	}

	equals(vec: Vec2): boolean {
		return this.x == vec.x && this.y == vec.y;
	}

	floor(): Vec2 {
		return new Vec2(Math.floor(this.x), Math.floor(this.y));
	}
}