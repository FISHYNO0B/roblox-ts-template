import { applyMusicStackOp, MUSIC_STACK_MAX, topOfMusicStack } from "shared/domain/music/stack";
import { MusicKey } from "shared/domain/assets/Music";

export = () => {
	describe("music stack reducer", () => {
		it("push appends to the top", () => {
			const next = applyMusicStackOp([], { kind: "push", key: "menu" });
			expect(topOfMusicStack(next)).to.equal("menu");

			const after = applyMusicStackOp(next, { kind: "push", key: "combat" });
			expect(topOfMusicStack(after)).to.equal("combat");
			expect(after.size()).to.equal(2);
		});

		it("pop returns to the previous top", () => {
			const stack: ReadonlyArray<MusicKey> = ["menu", "combat"];
			const next = applyMusicStackOp(stack, { kind: "pop" });
			expect(topOfMusicStack(next)).to.equal("menu");
			expect(next.size()).to.equal(1);
		});

		it("pop on empty is a no-op", () => {
			const next = applyMusicStackOp([], { kind: "pop" });
			expect(next.size()).to.equal(0);
		});

		it("replace swaps the top without nesting", () => {
			const stack: ReadonlyArray<MusicKey> = ["menu", "combat"];
			const next = applyMusicStackOp(stack, { kind: "replace", key: "boss" });
			expect(topOfMusicStack(next)).to.equal("boss");
			expect(next.size()).to.equal(2);
			expect(next[0]).to.equal("menu");
		});

		it("replace on empty starts a new stack with the key", () => {
			const next = applyMusicStackOp([], { kind: "replace", key: "menu" });
			expect(topOfMusicStack(next)).to.equal("menu");
			expect(next.size()).to.equal(1);
		});

		it("stop clears the stack", () => {
			const stack: ReadonlyArray<MusicKey> = ["menu", "combat", "boss"];
			const next = applyMusicStackOp(stack, { kind: "stop" });
			expect(next.size()).to.equal(0);
			expect(topOfMusicStack(next)).to.equal(undefined);
		});

		it("push past the cap drops the oldest entry", () => {
			let stack: ReadonlyArray<MusicKey> = [];
			for (let i = 0; i < MUSIC_STACK_MAX + 2; i++) {
				stack = applyMusicStackOp(stack, { kind: "push", key: "menu" });
			}
			expect(stack.size()).to.equal(MUSIC_STACK_MAX);
		});

		it("does not mutate the input stack", () => {
			const stack: ReadonlyArray<MusicKey> = ["menu"];
			applyMusicStackOp(stack, { kind: "push", key: "combat" });
			applyMusicStackOp(stack, { kind: "pop" });
			applyMusicStackOp(stack, { kind: "replace", key: "boss" });
			applyMusicStackOp(stack, { kind: "stop" });
			expect(stack.size()).to.equal(1);
			expect(stack[0]).to.equal("menu");
		});
	});
};
