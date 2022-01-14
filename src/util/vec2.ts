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

	add(vec: Vec2) {
		this.x += vec.x;
		this.y += vec.y;
	}
}