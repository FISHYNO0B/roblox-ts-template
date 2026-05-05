export class TokenBucket {
	private tokens: number;
	private lastRefill: number;

	constructor(
		private readonly capacity: number,
		private readonly refillPerSec: number,
		private readonly now: () => number = () => os.clock(),
	) {
		this.tokens = capacity;
		this.lastRefill = this.now();
	}

	private refill(): void {
		const t = this.now();
		const elapsed = t - this.lastRefill;
		if (elapsed <= 0) return;
		this.tokens = math.min(this.capacity, this.tokens + elapsed * this.refillPerSec);
		this.lastRefill = t;
	}

	tryConsume(amount = 1): boolean {
		this.refill();
		if (this.tokens >= amount) {
			this.tokens -= amount;
			return true;
		}
		return false;
	}

	getTokens(): number {
		this.refill();
		return this.tokens;
	}
}
