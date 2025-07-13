import { SliceGet, SliceSet } from "./useExampleStore";

export const createSharedSlice = (_set: SliceSet<object>, get: SliceGet<object>) => ({
    addBoth: () => {
        get().bear.addBear();
        get().fish.addFish();
    }
});

// Export the inferred store slice type
export type SharedStore = ReturnType<typeof createSharedSlice>;
