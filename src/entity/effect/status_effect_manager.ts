import Random from "../../util/random";
import LivingEntity from "../living_entity";
import StatusEffect from "./status_effect";

export default class StatusEffectManager {
	readonly owner: LivingEntity;
	private effects: Map<string, StatusEffect>;
	readonly random: Random;

	constructor(owner: LivingEntity) {
		this.owner = owner;
		this.effects = new Map<string, StatusEffect>();
		this.random = new Random();
	}

	get(uuid: string): StatusEffect {
		return this.effects.get(uuid);
	}

	find(filter: (StatusEffect: StatusEffect) => boolean): StatusEffect {
		if (this.size() == 0) return undefined;
		return [...this.effects.entries()].find((value: [string, StatusEffect]) => filter(value[1]))[1];
	}

	apply(StatusEffect: StatusEffect): void {
		StatusEffect.manager = this;
		this.effects.set(StatusEffect.uuid, StatusEffect);
	}

	remove(uuid: string): void {
		this.effects.delete(uuid);
	}

	prune(filter: (StatusEffect: StatusEffect) => boolean): void {
		for (let entry of [...this.effects.entries()].filter((value: [string, StatusEffect]) => filter(value[1])))
			this.effects.delete(entry[0]);
	}

	filter(filter: (StatusEffect: StatusEffect) => boolean): [string, StatusEffect][] {
		return [...this.effects.entries()].filter((value: [string, StatusEffect]) => filter(value[1]));
	}

	size(): number {
		return this.effects.size;
	}

	array(): Array<StatusEffect> {
		return [...this.effects.values()];
	}

	tick(): void {
		for (let effect of this.array())
			effect.tick();
	}
}