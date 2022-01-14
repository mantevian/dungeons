export default class Color {
	red: number;
	green: number;
	blue: number;
	alpha: number;

	constructor(red: number, green: number, blue: number, alpha?: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha ?? 255;
	}

	static RGB(red: number, green: number, blue: number) {
		return new Color(red, green, blue);
	}
}