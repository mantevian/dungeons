import Random from "./random";

export type Direction = 'left' | 'right' | 'up' | 'down';

export function opposite(direction: Direction) {
	switch (direction) {
		case 'left': return 'right';
		case 'right': return 'left';
		case 'up': return 'down';
		case 'down': return 'up';
	}
}

export function random(random: Random): Direction {
	return random.choice(['left', 'right', 'up', 'down']);
}

export function weighted(directions: Array<{ item: Direction, weight: number }>, random: Random): Direction {
	return random.weighted_random(directions);
}