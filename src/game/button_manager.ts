import Vec2 from "../util/vec2";
import Button from "./button";
import Game from "./game";
import Renderer from "./renderer";

export default class ButtonManager {
	readonly game: Game;
	readonly buttons: Map<string, Button>;

	constructor(game: Game) {
		this.game = game;
		this.buttons = new Map<string, Button>();
	}

	tick(): void {
		for (let button of this.buttons.values())
			button.render();
	}

	get(id: string): Button {
		return this.buttons.get(id);
	}

	set(button: Button): void {
		button.manager = this;
		this.buttons.set(button.id, button);
	}

	click_buttons(): boolean {
		let pos = this.game.mouse_pos;
		for (let button of this.buttons.values()) {
			if (Vec2.point_inside_rect(Renderer.game_coords(pos), button.position, button.size)) {
				button.click();
				return true;
			}
		}

		return false;
	}
}