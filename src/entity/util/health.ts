import Entity from "../entity";

export default class Health {
	private _value: number;
	private _max: number;
	public readonly entity: Entity;
	private invincibility_timer: InvincibilityTimer;

	constructor(max_health: number, entity: Entity, invincibility_timer: number = 20) {
		this._max = max_health;
		this._value = max_health;
		this.entity = entity;
		this.invincibility_timer = new InvincibilityTimer(invincibility_timer);
	}

	public tick(): void {
		this.invincibility_timer.tick();
	}

	public get value() {
		return this._value;
	}

	public get max() {
		return this._max;
	}

	public set max(value: number) {
		if (value > 0)
			this._max = value;
	}

	public get alive() {
		return this._value >= 0;
	}

	public get full() {
		return this._value == this._max;
	}

	public get ratio() {
		return this._value / this._max;
	}

	public get invincibility_timer_ratio() {
		return this.invincibility_timer.value / this.invincibility_timer.max_value;
	}

	/**
	 * @returns `Math.floor(value)`
	 */
	public damage(value: number, invincibility_timer?: number): number {
		if (value <= 0)
			return;
		
		value = Math.floor(value);
		value -= this.invincibility_timer.last_taken_damage;
		this._value -= value;

		if (this.invincibility_timer.ready) {
			this.invincibility_timer.last_taken_damage = value;
			this.invincibility_timer.update(invincibility_timer ?? 20);
		}

		return value;
	}

	public heal(value: number): void {
		if (this._value + value > this._max)
			this._value = this._max;
		
		this._value += value;
	}

	public reset(value: number): void {
		this._value = value;
		this._max = value;
	}
}

class InvincibilityTimer {
	value: number;
	max_value: number;
	last_taken_damage: number;

	constructor(value: number) {
		this.value = 0;
		this.max_value = value;
		this.last_taken_damage = 0;
	}

	public update(value: number): void {
		if (value > 0) {
			this.value = value;
			this.max_value = value;
		}
	}

	public tick(): void {
		if (this.value > 0)
			this.value--;

		if (this.ready)
			this.last_taken_damage = 0;
	}

	public get ready() {
		return this.value == 0;
	}
}