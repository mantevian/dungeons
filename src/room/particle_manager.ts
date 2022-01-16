import Particle from "../particle/particle";
import Random from "../util/random";
import Room from "./room";

export default class ParticleManager {
	readonly room: Room;
	private particles: Map<string, Particle>;
	readonly random: Random;

	constructor(room: Room) {
		this.room = room;
		this.particles = new Map<string, Particle>();
		this.random = new Random();
	}

	/** Get an Particle by a uuid */
	get(uuid: string): Particle {
		return this.particles.get(uuid);
	}

	/** Add a new Particle */
	spawn(particle: Particle): void {
		particle.manager = this;
		this.particles.set(particle.uuid, particle);
	}

	/** Remove an Particle by a uuid */
	remove(uuid: string): void {
		this.particles.delete(uuid);
	}

	/** The amount of particles */
	size(): number {
		return this.particles.size;
	}

	/** Parse as an array */
	array(): Array<Particle> {
		return [...this.particles.values()];
	}

	/** Tick every Particle */
	tick(): void {
		for (let particle of this.array())
			particle.tick();
	}
}