import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createSlices } from "../../src/createSlices";
import { type BearStore, createBearSlice } from "./bear.store";
import { createFishSlice, type FishStore } from "./fish.store";

export type ExampleStore = {
    bear: BearStore;
    fish: FishStore;
};

export type StoreSlice<T> = StateCreator<
    ExampleStore,
    [["zustand/devtools", never]],
    [],
    T
>;

export const useStore = create<ExampleStore>()(
    devtools(
        createSlices({
            bear: createBearSlice,
            fish: createFishSlice,
        }),
        { name: "Example createSlices Store" }
    )
);
