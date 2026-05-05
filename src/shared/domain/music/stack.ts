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
			const updated = [...stack, op.key];
			while (updated.size() > maxSize) {
				updated.shift();
			}
			return updated;
		}
		case "pop": {
			if (stack.size() === 0) return stack;
			const updated = [...stack];
			updated.pop();
			return updated;
		}
		case "replace": {
			if (stack.size() === 0) return [op.key];
			const updated = [...stack];
			updated[updated.size() - 1] = op.key;
			return updated;
		}
		case "stop":
			return [];
	}
}

export function topOfMusicStack(stack: ReadonlyArray<MusicKey>): MusicKey | undefined {
	return stack[stack.size() - 1];
}
