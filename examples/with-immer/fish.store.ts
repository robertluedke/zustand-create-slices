import type { SliceGet, SliceSet } from "./useExampleStore";

interface FishStoreState {
    fishes: number;
}

const initialState: FishStoreState = {
    fishes: 0
};

export const createFishSlice = (set: SliceSet<FishStoreState>, get: SliceGet<FishStoreState>) => ({
    ...initialState,

    addFish: () =>
        set((state) => {
            state.fish.fishes += 1;
        }),

    getMultipleFishes: (n: number) => get().fish.fishes * n
});

// Export the inferred store slice type
export type FishStore = ReturnType<typeof createFishSlice>;
