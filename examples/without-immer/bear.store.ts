import { SliceGet, SliceSet } from "./useExampleStore";

interface BearSliceState {
    bears: number;
}

const initialState: BearSliceState = {
    bears: 0
};

export const createBearSlice = (set: SliceSet<BearSliceState>, get: SliceGet<BearSliceState>) => ({
    ...initialState,

    addBear: () =>
        set((state) => ({
            ...state,
            bear: {
                ...state.bear,
                bears: state.bear.bears + 1
            }
        })),

    eatFish: () =>
        set((state) => ({
            ...state,
            fish: {
                ...state.fish,
                fishes: state.fish.fishes - state.bear.bears
            }
        })),

    getMultipleBears: (n: number) => get().bear.bears * n
});

// Export the inferred store slice type
export type BearSlice = ReturnType<typeof createBearSlice>;
