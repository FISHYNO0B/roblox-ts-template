import { Networking } from "@flamework/networking";
import { Players } from "@rbxts/services";
import { TokenBucket } from "./token-bucket";

export interface RateLimitConfig {
	capacity: number;
	refillPerSec: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
	default: { capacity: 30, refillPerSec: 15 },
	toggleSetting: { capacity: 5, refillPerSec: 2 },
	promptPurchase: { capacity: 3, refillPerSec: 1 },
	promptPass: { capacity: 3, refillPerSec: 1 },
};

const buckets = new Map<number, Map<string, TokenBucket>>();

const bucketFor = (userId: number, eventName: string): TokenBucket => {
	let perPlayer = buckets.get(userId);
	if (perPlayer === undefined) {
		perPlayer = new Map();
		buckets.set(userId, perPlayer);
	}
	let bucket = perPlayer.get(eventName);
	if (bucket === undefined) {
		const config = RATE_LIMITS[eventName] ?? RATE_LIMITS.default;
		bucket = new TokenBucket(config.capacity, config.refillPerSec);
		perPlayer.set(eventName, bucket);
	}
	return bucket;
};

export const releaseBuckets = (userId: number): void => {
	buckets.delete(userId);
};

Players.PlayerRemoving.Connect((player) => releaseBuckets(player.UserId));

export const rateLimitMiddleware = <I extends ReadonlyArray<unknown>>(): Networking.EventMiddleware<I> => {
	return (processNext, event) => {
		return (player, ...args) => {
			if (player === undefined) return processNext(player, ...args);
			const bucket = bucketFor(player.UserId, event.name);
			if (!bucket.tryConsume(1)) {
				warn(`rate limited: ${player.Name} on ${event.name}`);
				return;
			}
			return processNext(player, ...args);
		};
	};
};
