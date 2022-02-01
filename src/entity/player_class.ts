export class PlayerClass {
	id: string;
	vitality_multiplier: number;
	strength_multiplier: number;
	intelligence_multiplier: number;
	weapon: string;

	constructor(id: string, vitality_multiplier: number, strength_multiplier: number, intelligence_multiplier: number, weapon: string) {
		this.id = id;
		this.vitality_multiplier = vitality_multiplier;
		this.strength_multiplier = strength_multiplier;
		this.intelligence_multiplier = intelligence_multiplier;
		this.weapon = weapon;
	}
}

export default class PlayerClasses {
	static get turret() {
		return new PlayerClass('turret', 10, 1, 1, 'bullet');
	}

	static get swordsman() {
		return new PlayerClass('swordsman', 12, 1.2, 0.8, 'sword');
	}
	
	static get mage() {
		return new PlayerClass('mage', 9, 1.1, 1.2, 'fireball');
	}

	static get archer() {
		return new PlayerClass('archer', 8, 1.2, 1, 'arrow');
	}

	static from_id(id: string) {
		switch (id) {
			case 'turret': return PlayerClasses.turret;
			case 'swordsman': return PlayerClasses.swordsman;
			case 'mage': return PlayerClasses.mage;
			case 'archer': return PlayerClasses.archer;
		}
	}
}