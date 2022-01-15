export default class Color {
	private red: number;
	private green: number;
	private blue: number;
	private alpha: number;

	constructor(red: number, green: number, blue: number, alpha?: number) {
		this.set_red(red);
		this.set_green(green);
		this.set_blue(blue);
		this.set_alpha(alpha ?? 255);
	}

	static RGB(red: number, green: number, blue: number) {
		return new Color(red, green, blue);
	}

	set_red(red: number): void {
		this.red = Math.floor(Math.max(Math.min(red, 255), 0));
	}

	set_green(green: number): void {
		this.green = Math.floor(Math.max(Math.min(green, 255), 0));
	}

	set_blue(blue: number): void {
		this.blue = Math.floor(Math.max(Math.min(blue, 255), 0));
	}

	set_alpha(alpha: number): void {
		this.alpha = Math.floor(Math.max(Math.min(alpha, 255), 0));
	}

	get_red(): number {
		return this.red;
	}

	get_green(): number {
		return this.green;
	}

	get_blue(): number {
		return this.blue;
	}

	get_alpha(): number {
		return this.alpha;
	}

	lighten(strength: number): Color {
		strength = Math.max(Math.min(strength, 1), 0);
		
		let red = (this.get_red() * 2 + 255 * strength) / 2;
		let green = (this.get_green() * 2 + 255 * strength) / 2;
		let blue = (this.get_blue() * 2 + 255 * strength) / 2;

		return new Color(red, green, blue, this.alpha);
	}

	toString(): string {
		return `${this.red},${this.green},${this.blue},${this.alpha}`;
	}
}