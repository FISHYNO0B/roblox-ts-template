import { MusicKey } from "shared/domain/assets/Music";

export const MUSIC_STACK_MAX = 4;

export type MusicStackOp =
	| { kind: "push"; key: MusicKey }
	| { kind: "pop" }
	| { kind: "replace"; key: MusicKey }
	| { kind: "stop" };

export function applyMusicStackOp(
	stack: ReadonlyArray<MusicKey>,
	op: MusicStackOp,
	maxSize = MUSIC_STACK_MAX,
): ReadonlyArray<MusicKey> {
	switch (op.kind) {
		case "push": {
			const next = [...stack, op.key];
			while (next.size() > maxSize) {
				next.shift();
			}
			return next;
		}
		case "pop": {
			if (stack.size() === 0) return stack;
			const next = [...stack];
			next.pop();
			return next;
		}
		case "replace": {
			if (stack.size() === 0) return [op.key];
			const next = [...stack];
			next[next.size() - 1] = op.key;
			return next;
		}
		case "stop":
			return [];
	}
}

export function topOfMusicStack(stack: ReadonlyArray<MusicKey>): MusicKey | undefined {
	return stack[stack.size() - 1];
}
