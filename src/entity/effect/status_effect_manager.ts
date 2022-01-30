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

	/** Get a StatusEffect by a uuid */
	get(uuid: string): StatusEffect {
		return this.effects.get(uuid);
	}

	/** Find a StatusEffect using a function predicate. Returns the first found result */
	find(filter: (StatusEffect: StatusEffect) => boolean): StatusEffect {
		if (this.size() == 0) return undefined;
		return [...this.effects.entries()].find((value: [string, StatusEffect]) => filter(value[1]))[1];
	}

	/** Add a new StatusEffect */
	apply(StatusEffect: StatusEffect): void {
		StatusEffect.manager = this;
		this.effects.set(StatusEffect.uuid, StatusEffect);
	}

	/** Remove an StatusEffect by a uuid */
	remove(uuid: string): void {
		this.effects.delete(uuid);
	}

	/** Remove all effects that fit the filter condition */
	prune(filter: (StatusEffect: StatusEffect) => boolean): void {
		for (let entry of [...this.effects.entries()].filter((value: [string, StatusEffect]) => filter(value[1])))
			this.effects.delete(entry[0]);
	}

	/** Get all effects that fit the filter condition */
	filter(filter: (StatusEffect: StatusEffect) => boolean): [string, StatusEffect][] {
		return [...this.effects.entries()].filter((value: [string, StatusEffect]) => filter(value[1]));
	}

	/** The amount of effects */
	size(): number {
		return this.effects.size;
	}

	/** Parse as an array */
	array(): Array<StatusEffect> {
		return [...this.effects.values()];
	}

	/** Tick every effect */
	tick(): void {
		for (let effect of this.array())
			effect.tick();
	}
}