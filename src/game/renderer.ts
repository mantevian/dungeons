import P5 from "p5";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Game from "./game";

export default class Renderer {
	game: Game;
	readonly p5: P5;

	scale: number;
	
	constructor(game: Game, p5: P5) {
		this.game = game;
		this.p5 = p5;
		this.scale = 30;
	}

	render() {
		let room = this.game.room_manager.current_room;

		for (let entry of room.tiles.map())
			this.tile(entry[0], Vec2.one(), entry[1].color, 0.15);
		
		for (let entity of room.entities.array())
			this.tile(entity.position, entity.size, entity.color, entity.corner_radius);
		
		let player = this.game.player;
		this.tile(player.position, player.size, player.color, player.corner_radius);
	}

	tile(position: Vec2, size: Vec2, color: Color, corner_radius: number) {
		this.p5.fill(color.red, color.green, color.blue, color.alpha);
		this.p5.rect(position.x * this.scale + 300, position.y * this.scale + 300, size.x * this.scale, size.y * this.scale, corner_radius * this.scale);
	}
}