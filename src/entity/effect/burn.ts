import FlameParticle from "../../particle/flame";
import StatusEffect from "./status_effect";

export default class BurnEffect extends StatusEffect {
	damage: number;
	speed: number;

	constructor(duration: number, damage = 1, speed = 30) {
		super(duration);

		this.damage = damage;
		this.speed = speed;
		this.id = 'burn';
	}

	tick(): void {
		super.tick();

		if (this.ticks % this.speed == 0)
			this.manager.owner.damage(this.damage);

		if (this.ticks % Math.floor(this.speed / 3) == 0)
			this.manager.owner.manager.room.particles.spawn(new FlameParticle(this.manager.owner.position, 0.05, this.manager.owner.manager.room.particles));
	}
}