import React, { EffectCallback, PropsWithChildren, DependencyList } from "react";
/**
 * declare and bind ref to a value
 *
 * @template T
 * @param {T} val
 * @return {*}
 */
export declare function useBindRef<T>(val: T): React.MutableRefObject<T>;
/**
 * safe callback with delay and debounce
 *
 * error handler within
 *
 * @template F
 * @param {F} cb
 * @param {DependencyList} deps
 * @param {*} [delay=-1]
 * @param {boolean} [debounce=false]
 * @param {(err: Error) => void} [onError=() => {}]
 * @return {*}
 */
export declare function useSafeCallback<F extends (...args: any[]) => any>(cb: F, deps: DependencyList, delay?: number, debounce?: boolean, onError?: (err: Error) => void): (...args: Parameters<F>) => void;
/**
 * partial dependencies effect with ignoreFirst and previous value compare
 *
 * also have error handler
 *
 * @template P
 * @template any
 */
export declare function usePartialEffect<P extends readonly any[]>(cb: (props: P, preProps: P | []) => ReturnType<EffectCallback>, deps: DependencyList, props: P, ignoreFirst?: boolean, onError?: (err: Error) => void): void;
/**
 * create a service
 *
 * const Service = $.CS(function(){})
 *
 * <Service.P></Service.P>
 *
 * Service.IN()
 *
 * @template P
 * @template R
 * @param {(...args: P) => R} func
 * @return {*}
 */
export declare function createService<P extends any[], R>(func: (...args: P) => R): {
    Provider: (props: PropsWithChildren<P extends [] ? {
        params?: P;
    } : {
        params: P;
    }>) => JSX.Element;
    useInject: () => R;
};
