import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createSlices } from "../../src/createSlices";
import { BearStore, createBearSlice } from "../with-immer/bear.store";
import { FishStore, createFishSlice } from "../with-immer/fish.store";

export type ExampleStore = {
    bear: BearStore;
    fish: FishStore;
};

export type StoreSlice<T> = StateCreator<
    ExampleStore,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    T
>;

export const useStore = create<ExampleStore>()(
    devtools(
        immer(
            createSlices({
                bear: createBearSlice,
                fish: createFishSlice,
            })
        ),
        { name: "Example createSlices Store" }
    )
);
