import Archer from "./mob/archer";
import Mage from "./mob/mage";
import Swordsman from "./mob/swordsman";
import Turret from "./mob/turret";

export default class Mobs {
	static get turret() {
		return new Turret();
	}

	static get swordsman() {
		return new Swordsman();
	}

	static get mage() {
		return new Mage();
	}

	static get archer() {
		return new Archer();
	}

	static from_id = (id: string) => {
		switch (id) {
			case 'turret': return Mobs.turret;
			case 'swordsman': return Mobs.swordsman;
			case 'mage': return Mobs.mage;
			case 'archer': return Mobs.archer;
		}
	}
}