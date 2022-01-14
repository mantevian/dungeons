export default class Random {
	m = Math.pow(2, 31) - 1;
	a = 1103515245;
	c = 12345;
	seed: number;
	state: number;

	constructor(seed?: number) {
		if (!seed)
			seed = Math.floor(Math.random() * this.m);

		this.seed = seed;
		this.state = seed;
	}

	next_int(): number {
		this.state = (this.a * this.state + this.c) % this.m;
		return this.state;
	}

	next_float(): number {
		return this.next_int() / this.m;
	}

	next_int_ranged(start: number, end: number): number {
		var range = end - start + 1;
		var random_under_1 = this.next_int() / this.m;
		return start + Math.floor(random_under_1 * range);
	}

	next_float_ranged(start: number, end: number): number {
		var range = end - start;
		return start + (this.next_float() * range);
	}

	choice(array: Array<any>): any {
		return array[this.next_int_ranged(0, array.length - 1)];
	}

	next_sign(): number {
		return this.choice([1, -1]);
	}

	weighted_random(arr: Array<any>): any {
		var entries = [];
		var accumulated_weight = 0;

		for (var i = 0; i < arr.length; i++) {
			accumulated_weight += arr[i].weight;
			entries.push({ item: arr[i].item, accumulated_weight: accumulated_weight });
		}

		for (var i = 0; i < arr.length; i++) {
			var r = this.next_float() * accumulated_weight;
			if (entries[i].accumulated_weight >= r)
				return entries[i].item;
		}
	}
}