import Player from "./player";
import Projectile from "./projectile";
import Arrow from "./projectile/arrow";
import Bullet from "./projectile/bullet";
import Fireball from "./projectile/fireball";
import Sword from "./projectile/sword";

export class Weapon {
	id: string;
	owner: Player;
	base_attack_damage: number;
	attack_damage: number;
	attack_cooldown: number;
	max_attack_cooldown: number;
	attack: () => Projectile;
	projectile_anchored: boolean;
	projectile_speed: number;
	prepare_attack: number;
	start_prepare_attack: number;
	tick_f: () => void;

	constructor(id: string, owner: Player, base_attack_damage: number, projectile_anchored: boolean, attack: () => Projectile, tick: () => void) {
		this.id = id;
		this.owner = owner;
		this.base_attack_damage = base_attack_damage;
		this.attack_cooldown = 60;
		this.attack = attack;
		this.projectile_anchored = projectile_anchored;
		this.prepare_attack = -1;
		this.tick_f = tick;
	}

	tick() {
		this.attack_damage = Math.floor(this.base_attack_damage * (1 + this.owner.strength / 10) * this.owner.class.strength_multiplier);
		this.tick_f();
	}
}

export default class Weapons {
	static bullet(owner: Player) {
		return new Weapon('bullet', owner, 7, false, () => {
			return new Bullet(owner, owner.weapon.attack_damage);
		}, () => {
			owner.weapon.projectile_speed = 0.25 + owner.intelligence * 0.002;
			owner.weapon.max_attack_cooldown = Math.floor(Math.max(15, 30 - owner.intelligence * 0.3));
			owner.weapon.start_prepare_attack = 1;
		});
	}

	static sword(owner: Player) {
		return new Weapon('sword', owner, 7, true, () => {
			return new Sword(owner, owner.weapon.attack_damage);
		}, () => {
			owner.weapon.projectile_speed = 0;
			owner.weapon.max_attack_cooldown = Math.floor(Math.max(25, 50 - owner.intelligence * 0.5));
			owner.weapon.start_prepare_attack = Math.floor(Math.max(1, 5 - owner.intelligence * 0.2));
		});
	}

	static fireball(owner: Player) {
		return new Weapon('fireball', owner, 7, false, () => {
			return new Fireball(owner, owner.weapon.attack_damage, 180 + owner.intelligence * 10, Math.max(10, 30 - owner.intelligence));
		}, () => {
			owner.weapon.projectile_speed = 0.15;
			owner.weapon.max_attack_cooldown = Math.floor(Math.max(20, 40 - owner.intelligence * 0.4));
			owner.weapon.start_prepare_attack = Math.floor(Math.max(3, 8 - owner.intelligence * 0.1));
		});
	}

	static arrow(owner: Player) {
		return new Weapon('arrow', owner, 7, false, () => {
			return new Arrow(owner, owner.weapon.attack_damage);
		}, () => {
			owner.weapon.projectile_speed = 0.35 + owner.intelligence * 0.002;
			owner.weapon.max_attack_cooldown = Math.floor(Math.max(15, 30 - owner.intelligence * 0.3));
			owner.weapon.start_prepare_attack = Math.floor(Math.max(3, 6 - owner.intelligence * 0.2));
		});
	}

	static from_id(id: string, owner: Player) {
		switch (id) {
			case 'bullet': return Weapons.bullet(owner);
			case 'sword': return Weapons.sword(owner);
			case 'fireball': return Weapons.fireball(owner);
			case 'arrow': return Weapons.arrow(owner);
		}
	}
}