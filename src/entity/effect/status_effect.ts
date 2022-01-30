import StatusEffectManager from "./status_effect_manager";
import { v4 as uuid } from "uuid";

export default class StatusEffect {
	manager: StatusEffectManager;
	duration: number;
	ticks: number;
	uuid: string;
	id: string;

	constructor(duration: number) {
		this.uuid = uuid();

		this.duration = duration;
		this.ticks = 0;
	}

	tick(): void {
		if (this.ticks < this.duration)
			this.ticks++;
		else
			this.end();
	}

	end(): void {
		this.manager.remove(this.uuid);
	}
}