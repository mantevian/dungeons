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


	get(uuid: string): Particle {
		return this.particles.get(uuid);
	}


	spawn(particle: Particle): void {
		particle.manager = this;
		this.particles.set(particle.uuid, particle);
	}


	remove(uuid: string): void {
		this.particles.delete(uuid);
	}


	size(): number {
		return this.particles.size;
	}


	array(): Array<Particle> {
		return [...this.particles.values()];
	}


	tick(): void {
		for (let particle of this.array())
			particle.tick();
	}
}