import type { StoreSlice } from "./useStore";

interface FishStoreState {
    fishes: number;
}

interface FishStoreActions {
    addFish: () => void;
}

export type FishStore = FishStoreState & FishStoreActions;

const initialState: FishStoreState = {
    fishes: 0,
};

export const createFishSlice: StoreSlice<FishStore> = (set) => ({
    ...initialState,

    addFish: () =>
        set((state) => ({
            ...state,
            fish: {
                ...state.fish,
                fishes: state.fish.fishes + 1,
            },
        })),
});
