import { SliceGet, SliceSet } from "./useExampleStore";

interface BearStoreState {
    bears: number;
}

const initialState: BearStoreState = {
    bears: 0
};

export const createBearSlice = (set: SliceSet<BearStoreState>, get: SliceGet<BearStoreState>) => ({
    ...initialState,

    addBear: () =>
        set((state) => {
            state.bear.bears += 1;
        }),

    eatFish: () =>
        set((state) => {
            state.fish.fishes -= state.bear.bears;
        }),

    getMultipleBears: (n: number) => get().bear.bears * n
});

// Export the inferred store slice type
export type BearStore = ReturnType<typeof createBearSlice>;
