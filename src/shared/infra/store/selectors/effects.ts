import { SharedState } from "../index";

export const selectEffects = (state: SharedState) => state.effects.list;
