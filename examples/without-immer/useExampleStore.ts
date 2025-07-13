import { create, type StateCreator } from "zustand";
import { createSlices } from "zustand-create-slices";
import { devtools } from "zustand/middleware";
import { type BearSlice, createBearSlice } from "./bear.store";
import { createFishSlice, type FishSlice } from "./fish.store";
import { createSharedSlice, SharedSlice } from "./shared.store";

export type ExampleStore = {
    bear: BearSlice;
    fish: FishSlice;
    shared: SharedSlice;
};

type StoreSlice<T> = StateCreator<ExampleStore, [["zustand/devtools", never]], [], T>;

export type SliceSet<T> = Parameters<StoreSlice<T>>[0];
export type SliceGet<T> = Parameters<StoreSlice<T>>[1];

export const useExampleStore = create<ExampleStore>()(
    devtools(
        createSlices({
            bear: createBearSlice,
            fish: createFishSlice,
            shared: createSharedSlice
        }),
        { name: "Example Store" }
    )
);
