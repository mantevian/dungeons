export default class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;

	constructor(red: number, green: number, blue: number, alpha?: number) {
		this.set_red(red);
		this.set_green(green);
		this.set_blue(blue);
		this.set_alpha(alpha ?? 255);
	}

	static RGB(red: number, green: number, blue: number) {
		return new Color(red, green, blue);
	}

	static RGBA(red: number, green: number, blue: number, alpha: number) {
		return new Color(red, green, blue, alpha);
	}

	set_red(red: number): void {
		this._red = Math.floor(Math.max(Math.min(red, 255), 0));
	}

	set_green(green: number): void {
		this._green = Math.floor(Math.max(Math.min(green, 255), 0));
	}

	set_blue(blue: number): void {
		this._blue = Math.floor(Math.max(Math.min(blue, 255), 0));
	}

	set_alpha(alpha: number): void {
		this._alpha = Math.floor(Math.max(Math.min(alpha, 255), 0));
	}

	get red(): number {
		return this._red;
	}

	get green(): number {
		return this._green;
	}

	get blue(): number {
		return this._blue;
	}

	get alpha(): number {
		return this._alpha;
	}

	lighten(strength: number): Color {
		strength = Math.max(Math.min(strength, 1), 0);
		
		let red = (this.red * 2 + 255 * strength) / 2;
		let green = (this.green * 2 + 255 * strength) / 2;
		let blue = (this.blue * 2 + 255 * strength) / 2;

		return new Color(red, green, blue, this._alpha);
	}

	toString(): string {
		return `${this._red},${this._green},${this._blue},${this._alpha}`;
	}
}