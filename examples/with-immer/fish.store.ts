import { SliceGet, SliceSet } from "./useExampleStore";

interface FishSliceState {
    fishes: number;
}

const initialState: FishSliceState = {
    fishes: 0
};

export const createFishSlice = (set: SliceSet<FishSliceState>, get: SliceGet<FishSliceState>) => ({
    ...initialState,

    addFish: () =>
        set((state) => {
            state.fish.fishes += 1;
        }),

    getMultipleFishes: (n: number) => get().fish.fishes * n
});

// Export the inferred store slice type
export type FishSlice = ReturnType<typeof createFishSlice>;
