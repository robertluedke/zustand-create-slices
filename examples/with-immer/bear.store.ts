import type { StoreSlice } from "./useStore";

interface BearStoreState {
    bears: number;
}

const initialState: BearStoreState = {
    bears: 0,
};

export const createBearSlice: StoreSlice<BearStoreState> = (set) => ({
    ...initialState,

    addBear: () =>
        set((state) => {
            state.bear.bears += 1;
        }),

    eatFish: () =>
        set((state) => {
            state.fish.fishes -= state.bear.bears;
        }),
});

// Export the inferred store slice type
export type BearStore = ReturnType<typeof createBearSlice>;
