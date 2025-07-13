import type { StoreSlice } from "./useStore";

interface BearStoreState {
    bears: number;
}

interface BearStoreActions {
    addBear: () => void;
    eatFish: () => void;
}

export type BearStore = BearStoreState & BearStoreActions;

const initialState: BearStoreState = {
    bears: 0,
};

export const createBearSlice: StoreSlice<BearStore> = (set) => ({
    ...initialState,

    addBear: () =>
        set((state) => ({
            ...state,
            bear: {
                ...state.bear,
                bears: state.bear.bears + 1,
            },
        })),

    eatFish: () =>
        set((state) => ({
            ...state,
            fish: {
                ...state.fish,
                fishes: state.fish.fishes - state.bear.bears,
            },
        })),
});
