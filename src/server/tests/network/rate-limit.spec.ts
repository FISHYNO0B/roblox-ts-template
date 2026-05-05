import { TokenBucket } from "server/infra/token-bucket";

export = () => {
	describe("TokenBucket", () => {
		it("starts at capacity and drains one at a time", () => {
			let now = 0;
			const bucket = new TokenBucket(5, 1, () => now);
			for (let i = 0; i < 5; i++) {
				expect(bucket.tryConsume(1)).to.equal(true);
			}
			expect(bucket.tryConsume(1)).to.equal(false);
		});

		it("refills tokens over time", () => {
			let now = 0;
			const bucket = new TokenBucket(5, 1, () => now);
			for (let i = 0; i < 5; i++) bucket.tryConsume(1);
			expect(bucket.tryConsume(1)).to.equal(false);
			now += 3;
			expect(bucket.tryConsume(3)).to.equal(true);
			expect(bucket.tryConsume(1)).to.equal(false);
		});

		it("caps refill at capacity", () => {
			let now = 0;
			const bucket = new TokenBucket(5, 1, () => now);
			bucket.tryConsume(5);
			now += 100;
			for (let i = 0; i < 5; i++) {
				expect(bucket.tryConsume(1)).to.equal(true);
			}
			expect(bucket.tryConsume(1)).to.equal(false);
		});

		it("supports partial drain", () => {
			let now = 0;
			const bucket = new TokenBucket(5, 1, () => now);
			expect(bucket.tryConsume(3)).to.equal(true);
			expect(bucket.tryConsume(2)).to.equal(true);
			expect(bucket.tryConsume(1)).to.equal(false);
		});

		it("rejects requests larger than current tokens without consuming", () => {
			let now = 0;
			const bucket = new TokenBucket(5, 1, () => now);
			expect(bucket.tryConsume(10)).to.equal(false);
			expect(bucket.getTokens()).to.equal(5);
		});

		it("refills fractionally", () => {
			let now = 0;
			const bucket = new TokenBucket(10, 2, () => now);
			bucket.tryConsume(10);
			now += 0.5;
			expect(bucket.tryConsume(1)).to.equal(true);
			expect(bucket.tryConsume(1)).to.equal(false);
		});
	});
};
