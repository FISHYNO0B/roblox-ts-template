import { GlobalEvents, GlobalFunctions } from "shared/infra/network";
import { rateLimitMiddleware } from "./network-rate-limit";

export const ServerEvents = GlobalEvents.createServer({
	middleware: {
		toggleSetting: [rateLimitMiddleware()],
		setVolume: [rateLimitMiddleware()],
		promptPurchase: [rateLimitMiddleware()],
		promptPass: [rateLimitMiddleware()],
		reflex: {
			start: [rateLimitMiddleware()],
		},
	},
});
export const Functions = GlobalFunctions.createServer({});
