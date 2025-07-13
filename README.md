# zustand-create-slices

A [Zustand](https://github.com/pmndrs/zustand) middleware that combines multiple store slices into a structured state with slice actions type inference and enhanced Redux DevTools support.

This middleware allows you to organize your Zustand store into separate slices, each handling a specific domain of your application state. It automatically combines multiple slice creators into a single store structure, organizes state with slice names as top-level properties and provides enhanced Redux DevTools integration with automatic action naming.

## Features

- 🏗️ **Slice-based Architecture** - Organize your store into logical slices
- 🔍 **Type Inference** - Full TypeScript support with automatic type inference for actions - no need to define explicit action types
- 🛠️ **Redux DevTools Integration** - Enhanced debugging with automatic action naming in "slice/functionName" format
- 📦 **Zero Dependencies** - Only requires Zustand as a peer dependency
- 🎯 **Clean API** - Simple and intuitive to use
- 🔧 **Middleware Compatible** - Works seamlessly with other Zustand middleware (immer, devtools, persist, etc.)

## Installation

```bash
npm install zustand-create-slices
```

## Basic Usage

### 1. Define your store types

```typescript
// First, define the overall store structure
export type ExampleStore = {
    bear: BearSlice;
    fish: FishSlice;
};

// Create type helpers for slice creators
type StoreSlice<T> = StateCreator<ExampleStore, [["zustand/devtools", never]], [], T>;
export type SliceSet<T> = Parameters<StoreSlice<T>>[0];
export type SliceGet<T> = Parameters<StoreSlice<T>>[1];
```

> **Note:** These type definitions are typically included in your main store file (`useStore.ts`). The complete file structure will be shown in step 3.

> **✨ Type Inference Magic:** With this approach, you only need to define the state interface (e.g., `BearSliceState`). Action types are automatically inferred from your slice creators - no need to manually define action interfaces!

### 2. Create your slice creators

```typescript
// bear.store.ts
import type { SliceSet, SliceGet } from "./useStore";

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
```

```typescript
// fish.store.ts
import type { SliceSet, SliceGet } from "./useStore";

interface FishSliceState {
    fishes: number;
}

const initialState: FishSliceState = {
    fishes: 0
};

export const createFishSlice = (set: SliceSet<FishSliceState>, get: SliceGet<FishSliceState>) => ({
    ...initialState,

    addFish: () =>
        set((state) => ({
            ...state,
            fish: {
                ...state.fish,
                fishes: state.fish.fishes + 1
            }
        })),

    getMultipleFishes: (n: number) => get().fish.fishes * n
});

// Export the inferred store slice type
export type FishSlice = ReturnType<typeof createFishSlice>;
```

### 3. Combine slices with createSlices

```typescript
// useStore.ts
import { create, type StateCreator } from "zustand";
import { createSlices } from "zustand-create-slices";
import { devtools } from "zustand/middleware";
import { type BearSlice, createBearSlice } from "./bear.store";
import { createFishSlice, type FishSlice } from "./fish.store";

export type ExampleStore = {
    bear: BearSlice;
    fish: FishSlice;
};

type StoreSlice<T> = StateCreator<ExampleStore, [["zustand/devtools", never]], [], T>;
export type SliceSet<T> = Parameters<StoreSlice<T>>[0];
export type SliceGet<T> = Parameters<StoreSlice<T>>[1];

export const useStore = create<ExampleStore>()(
    devtools(
        createSlices({
            bear: createBearSlice,
            fish: createFishSlice
        }),
        { name: "Example Store" }
    )
);
```

### 4. Use in your components

```typescript
// Component.tsx
import { useStore } from "./useStore";

export default function Component() {
    const bears = useStore((state) => state.bear.bears);
    const fishes = useStore((state) => state.fish.fishes);
    const addBear = useStore((state) => state.bear.addBear);
    const eatFish = useStore((state) => state.bear.eatFish);

    return (
        <div>
            <p>Bears: {bears}</p>
            <p>Fishes: {fishes}</p>
            <button onClick={addBear}>Add Bear</button>
            <button onClick={eatFish}>Bear Eats Fish</button>
        </div>
    );
}
```

## Advanced Usage

### With Immer Middleware

```typescript
// useStore.ts
import { create, type StateCreator } from "zustand";
import { createSlices } from "zustand-create-slices";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type BearSlice, createBearSlice } from "./bear.store";
import { createFishSlice, type FishSlice } from "./fish.store";

export type ExampleStore = {
    bear: BearSlice;
    fish: FishSlice;
};

type StoreSlice<T> = StateCreator<
    ExampleStore,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    T
>;

export type SliceSet<T> = Parameters<StoreSlice<T>>[0];
export type SliceGet<T> = Parameters<StoreSlice<T>>[1];

export const useStore = create<ExampleStore>()(
    devtools(
        immer(
            createSlices({
                bear: createBearSlice,
                fish: createFishSlice
            })
        ),
        { name: "Example Store" }
    )
);
```

```typescript
// bear.store.ts (with Immer)
import type { SliceSet, SliceGet } from "./useStore";

interface BearSliceState {
    bears: number;
}

const initialState: BearSliceState = {
    bears: 0
};

export const createBearSlice = (set: SliceSet<BearSliceState>, get: SliceGet<BearSliceState>) => ({
    ...initialState,

    addBear: () =>
        set((state) => {
            state.bear.bears += 1; // Direct mutation with immer
        }),

    eatFish: () =>
        set((state) => {
            state.fish.fishes -= state.bear.bears; // Cross-slice updates
        }),

    getMultipleBears: (n: number) => get().bear.bears * n
});

// Export the inferred store slice type
export type BearSlice = ReturnType<typeof createBearSlice>;
```

## Redux DevTools Integration

When used with the `devtools` middleware, `createSlices` automatically enhances action names for better debugging:

- Actions are automatically named in the format: `"sliceName/functionName"`
- Example: `"bear/addBear"`, `"fish/addFish"`
- Makes it easy to track which slice triggered which action
- Works seamlessly with Redux DevTools browser extension

## API Reference

### `createSlices(slices)`

Creates a StateCreator that combines multiple slices into a structured store.

#### Parameters

- `slices` - A flat object where each key represents a slice name that will become a top-level property in your store, and each value is a StateCreator function that defines the state and actions for that specific slice. Each slice should focus on a single domain or feature of your application (e.g., 'user', 'cart', 'todos'). The slice names become the namespaces under which the slice's state and actions are organized in the final store structure.

#### Returns

A `StateCreator` function that can be used with Zustand's `create` function.

#### Example Store Structure

```typescript
// Input slices
createSlices({
  bear: createBearSlice,
  fish: createFishSlice,
})

// Results in store structure:
{
  bear: { bears: number, addBear: () => void, eatFish: () => void, getMultipleBears: (n: number) => number },
  fish: { fishes: number, addFish: () => void, getMultipleFishes: (n: number) => number }
}
```

## Benefits

### Organization

- **Separation of Concerns**: Each slice handles a specific domain
- **Maintainability**: Easy to find and modify specific functionality
- **Scalability**: Add new slices without affecting existing ones

### Developer Experience

- **Type Safety**: Full TypeScript support with automatic inference
- **Debugging**: Enhanced Redux DevTools integration
- **Familiar Patterns**: Similar to Redux Toolkit's slice concept but with a much simpler API

## Examples

Check out the [`examples`](./examples) directory for complete working examples:

- [`with-immer`](./examples/with-immer) - Using createSlices with Immer middleware
- [`without-immer`](./examples/without-immer) - Basic usage without additional middleware

## Requirements

- **Zustand**: ^4.0.0 (peer dependency)
- **TypeScript**: ^4.5.0 (for type support)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- [Robert Lüdke](https://github.com/robertluedke)
