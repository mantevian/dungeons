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

	toString(): string {
		return `${this.x},${this.y}`
	}

	static parse(str: string): Vec2 {
		return new Vec2(parseInt(str.split(',')[0]), parseInt(str.split(',')[1]));
	}

	modulus_room(): Vec2 {
		return new Vec2(this.x >= 0 ? this.x % 21 : (21 - Math.abs(this.x) % 21) % 21, this.y >= 0 ? this.y % 21 : (21 - Math.abs(this.y) % 21) % 21);
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
}