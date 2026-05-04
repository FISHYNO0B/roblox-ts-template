const random = new Random();

export function getRandomNumbers(min: number, max: number, amount = 1) {
	const range = max - min + 1;
	if (amount > range) {
		error(`getRandomNumbers: cannot pick ${amount} unique numbers from range [${min}, ${max}]`);
	}

	const numbers = new Array<number>();
	while (numbers.size() < amount) {
		const num = random.NextInteger(min, max);
		if (!numbers.includes(num)) {
			numbers.push(num);
		}
	}

	return numbers;
}
