import { Context, Dispatch, ReactNode, SetStateAction } from "react";

export type AsyncComponentProps<T, K> = AsyncUpdate<T> & K;
export type AsyncSetState<T> = Dispatch<SetStateAction<AsyncState<T>>>;
export type UseAsyncContextHook<T> = () => AsyncState<T>;
export type UpdatedState<T> = AsyncState<T>;
export type UpdateStateHook<T> = (stateUpdates: Partial<T>) => void;

/**
 * Metadata added to async component state.
 */
export interface AsyncStateMetadata<T> {
  loading: boolean
  updateState: UpdateStateHook<T>
}
/**
 * The `AsyncState` type simply adds the `loading: boolean` property to the
 * state.
 */
export type AsyncState<T> = T & AsyncStateMetadata<T>;
/**
 * The state update function `updateState` is called with the current state as
 * an argument in order to allow for conditional logic, and should resolve to an
 * object containing state values to update. The `initialState` should be a
 * complete state object containing values for all required fields.
 */
export type StateUpdate<T> = (state: AsyncState<T>) => boolean | Promise<boolean>;
// export type StateUpdate<T> = (state: T) => Partial<T> | Promise<Partial<T>>;
/**
 * The `AsyncStateMachine` accepts an initial state and a function to update the
 * state asynchronously.
 */
export interface AsyncUpdate<T = any> {
  /**
   * The complete default state to initialize. If no `updateState` is provided,
   * the state will only update when manually updated.
   */
  initialState: T
  /**
   * A function which provides state updates. Values will be merged into the
   * state object in the form `setState({ ...state, ...updates })`, i.e., values
   * which are not updated will remain unchanged.
   */
  updateState?: StateUpdate<T>
  /**
   * Generate a component from the state.
   */
  render?: (state: AsyncState<T>) => ReactNode;
}
/**
 * `AsyncProvider` requires a `context` to read, and a `updateState` function
 * to generate a new state when the context changes.
 */
export interface AsyncProviderProps<T> extends AsyncUpdate<T> {
  context: Context<AsyncState<T>>;
}
/**
 * `AsyncConsumer` requires a `context` to read.
 */
export interface AsyncConsumerProps<T> {
  children: (value: T) => ReactNode
  context: Context<T>
}