import Color from "../util/color";
import Vec2 from "../util/vec2";
import ButtonManager from "./button_manager";
import Renderer from "./renderer";
export default class Button {
	id: string;
	position: Vec2;
	size: Vec2;
	text: string;
	color: Color;
	text_color: Color;
	manager: ButtonManager;
	scale: number;
	enabled: () => boolean;
	on_clicked: () => void;

	constructor(id: string, position: Vec2, size: Vec2, text: string, color: Color, text_color: Color, enabled: () => boolean, on_clicked: () => void) {
		this.id = id;
		this.position = position;
		this.size = size;
		this.text = text;
		this.color = color;
		this.text_color = text_color;
		this.scale = 1;
		this.enabled = enabled;
		this.on_clicked = on_clicked;
	}

	click(): void {
		if (!this.enabled()) return;
		this.on_clicked();
		this.scale = 1.1;
	}

	render(): void {
		if (this.scale > 1)
			this.scale -= 0.005;
		else this.scale = 1;
		
		if (this.enabled()) {
			Renderer.rect(this.position, this.size, this.color, 0.1, { scale: this.scale, rotation: 0 });
			Renderer.text(this.position, this.scale * 700 * this.size.x / Renderer.p5.textWidth(this.text), this.text_color, this.text, true);
		}
		else {
			Renderer.rect(this.position, this.size, Color.RGB(128, 128, 128), 0.1, { scale: this.scale, rotation: 0 });
			Renderer.text(this.position, this.scale * 700 * this.size.x / Renderer.p5.textWidth(this.text), Color.RGB(255, 255, 255), this.text, true);
		}
	}
}