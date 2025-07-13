/*
 * zustand-create-slices - A Zustand middleware that combines multiple store slices into a
 * structured state with slice actions type inference and enhanced Redux DevTools support.
 *
 * (c) 2025 Robert Lüdke
 *
 * This middleware allows you to organize your Zustand store into separate slices,
 * each handling a specific domain of your application state.
 *
 * It automatically:
 *
 * - Combines multiple slice creators into a single store structure
 * - Organizes state with slice names as top-level properties (e.g., state.bear, state.fish)
 * - Infers action types from slices for cleaner slice structure and better type safety
 * - Infers action names for Redux DevTools in the "slice/functionName" format
 */

import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type CreateSlices = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    slices: Record<string, StateCreator<T, Mps, Mcs, unknown>>
) => StateCreator<T, Mps, Mcs>;

// Simple function to extract the function name from stack trace
const extractSliceFunctionName = (): string | undefined => {
    const stack = new Error().stack || "";
    const lines = stack.split("\n");

    // Find the extractSliceFunctionName line and take the next function
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("extractSliceFunctionName")) {
            // The next line should contain the actual function call
            const nextLine = lines[i + 2];

            if (nextLine) {
                // Extract function name from various stack trace formats
                const functionMatch =
                    nextLine.match(/at\s+(\w+)\s+/) || // Chrome: "at functionName"
                    nextLine.match(/(\w+)@/) || // Firefox: "functionName@"
                    nextLine.match(/at\s+Object\.(\w+)\s*\(/) || // "at Object.functionName("
                    nextLine.match(/\.(\w+)\s*\(/) || // ".functionName("
                    nextLine.match(/(\w+)\s*\(/); // "functionName("

                if (functionMatch && functionMatch[1]) {
                    return functionMatch[1];
                }
            }
            break;
        }
    }

    return undefined; // Use zustand devtools default action name
};

const createSlicesImpl =
    <
        T,
        Mps extends [StoreMutatorIdentifier, unknown][] = [],
        Mcs extends [StoreMutatorIdentifier, unknown][] = []
    >(
        slices: Record<string, StateCreator<T, Mps, Mcs, unknown>>
    ): StateCreator<T, Mps, Mcs> =>
    (set, get, store) => {
        // Check if devtools middleware is present by examining the store object
        const hasDevtools = "devtools" in store;

        // Combine all slices using the sliced set function with slice names as properties
        return Object.keys(slices).reduce((acc, sliceKey) => {
            // Create a slice-specific sliced set function that knows which slice it belongs to
            const slicedSet = new Proxy(set, {
                apply(target, thisArg, argArray) {
                    const [partial, replace, action] = argArray;
                    let finalAction = action;

                    // Only enhance action name if devtools are active and no action is provided
                    if (hasDevtools && !action) {
                        // Extract function name and combine with slice key
                        const functionName = extractSliceFunctionName();

                        finalAction = `${sliceKey}/${functionName}`;
                    }

                    return Reflect.apply(target, thisArg, [partial, replace, finalAction]);
                }
            });

            const sliceResult = slices[sliceKey](slicedSet, get, store);

            return { ...acc, [sliceKey]: sliceResult };
        }, {} as T);
    };

/**
 * Organizes your store into a slice-based architecture where each slice manages a specific
 * domain of your application state. It automatically enhances action names for Redux DevTools.
 *
 * @param slices - A flat object where each key represents a slice name that will become a top-level
 *                 property in your store, and each value is a StateCreator function that defines
 *                 the state and actions for that specific slice. Each slice should focus on a
 *                 single domain or feature of your application (e.g., 'user', 'cart', 'todos').
 *                 The slice names become the namespaces under which the slice's state and actions
 *                 are organized in the final store structure.
 * @returns A StateCreator that combines all slices with slice names as top-level properties
 *
 * @example
 * ```typescript
 * const store = create<StoreState>()(
 *   devtools(
 *     createSlices({
 *       bear: createBearSlice,
 *       fish: createFishSlice,
 *     })
 *   )
 * );
 * ```
 *
 * Results in the following store structure:
 * ```typescript
 * {
 *   bear: { bears: number, addBear: () => void, ... },
 *   fish: { fishes: number, addFish: () => void, ... }
 * }
 * ```
 */
export const createSlices = createSlicesImpl as CreateSlices;
