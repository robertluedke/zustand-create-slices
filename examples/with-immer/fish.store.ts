import type { StoreSlice } from "./useStore";

interface FishStoreState {
    fishes: number;
}

const initialState: FishStoreState = {
    fishes: 0,
};

export const createFishSlice: StoreSlice<FishStoreState> = (set) => ({
    ...initialState,

    addFish: () =>
        set((state) => {
            state.fish.fishes += 1;
        }),
});

// Export the inferred store slice type
export type FishStore = ReturnType<typeof createFishSlice>;
