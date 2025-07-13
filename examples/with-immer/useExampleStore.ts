import { create, type StateCreator } from "zustand";
import { createSlices } from "zustand-create-slices";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type BearStore, createBearSlice } from "./bear.store";
import { createFishSlice, type FishStore } from "./fish.store";
import { createSharedSlice, type SharedStore } from "./shared.store";

export type ExampleStore = {
    bear: BearStore;
    fish: FishStore;
    shared: SharedStore;
};

type StoreSlice<T> = StateCreator<
    ExampleStore,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    T
>;

export type SliceSet<T> = Parameters<StoreSlice<T>>[0];
export type SliceGet<T> = Parameters<StoreSlice<T>>[1];

export const useExampleStore = create<ExampleStore>()(
    devtools(
        immer(
            createSlices({
                bear: createBearSlice,
                fish: createFishSlice,
                shared: createSharedSlice
            })
        ),
        { name: "Example Store" }
    )
);
