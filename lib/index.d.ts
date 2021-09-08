import React, { EffectCallback, PropsWithChildren } from "react";
declare type DepObj = {
    [key: string]: any;
    [key: number]: any;
};
declare function useBindRef<T>(val: T): React.MutableRefObject<T>;
declare function useCustomMemo<D extends DepObj>(depObj: D): D;
declare function useCustomMemo<D extends DepObj, R>(depObj: D, memoFunc: (val: D) => R): R;
declare function useCustomCallback<D extends DepObj, P extends any[], R>(depObj: D, memoFunc: (val: D, ...args: P) => R): (...props: P) => R;
declare function useCustomEffect<D extends DepObj>(depObj: D, cb: (val: D) => ReturnType<EffectCallback>, ignoreFirst?: boolean): void;
declare function useCustomLayoutEffect<D extends DepObj>(depObj: D, cb: (val: D) => ReturnType<EffectCallback>, ignoreFirst?: boolean): void;
declare function createService<P extends any[], R>(func: (...args: P) => R): {
    P: (props: PropsWithChildren<P extends [] ? {
        params?: P;
    } : {
        params: P;
    }>) => JSX.Element;
    IN: () => R;
};
declare function usePartialEffect<D extends DepObj, ND extends DepObj>(depObj: D, relObj: ND, cb: (val: D, noDepVal: ND) => ReturnType<EffectCallback>, ignoreFirst?: boolean): void;
/**
 * Simple Hooks accessor
 *
 * @class Hooks
 */
declare class Hooks {
    /**
     * useState
     *
     * @memberof Hooks
     */
    S: typeof React.useState;
    /**
     * useMemo using object dependencies
     *
     * @memberof Hooks
     */
    M: typeof useCustomMemo;
    /**
     * useRef
     *
     * @memberof Hooks
     */
    R: typeof React.useRef;
    /**
     * useRef bind with prop
     *
     * @memberof Hooks
     */
    BR: typeof useBindRef;
    /**
     * useCallback using object dependencies
     *
     * @memberof Hooks
     */
    C: typeof useCustomCallback;
    /**
     * useEffect using object dependencies
     *
     * can set if ignore first effect
     *
     * @memberof Hooks
     */
    E: typeof useCustomEffect;
    /**
     * useLayoutEffect using object dependencies
     *
     * can set if ignore first effect
     *
     * @memberof Hooks
     */
    LE: typeof useCustomLayoutEffect;
    /**
     * useEffect that only depends part of deps
     *
     * using object dependencies
     *
     * can set if ignore first effect
     *
     * @memberof Hooks
     */
    PE: typeof usePartialEffect;
    /**
     * useDebugValue
     *
     * @memberof Hooks
     */
    D: typeof React.useDebugValue;
    /**
     * useReducer
     *
     * @memberof Hooks
     */
    X: typeof React.useReducer;
    /**
     * useImperativeHandle
     *
     * @memberof Hooks
     */
    IM: typeof React.useImperativeHandle;
    /**
     * useContext
     *
     * @memberof Hooks
     */
    CTX: typeof React.useContext;
    /**
     * createContext
     *
     * @memberof Hooks
     */
    CCTX: typeof React.createContext;
    /**
     * create a service
     *
     * const Service = $.CS(function(){})
     *
     * <Service.P></Service.P>
     *
     * Service.IN()
     * @memberof Hooks
     */
    CS: typeof createService;
}
declare const _default: Hooks;
export default _default;
