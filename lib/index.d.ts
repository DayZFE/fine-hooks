import React, { EffectCallback, PropsWithChildren } from "react";
export declare type DepObj = {
  [key: string]: any;
  [key: number]: any;
};
/**
 * generate dependency list from object
 *
 * @template D
 * @param {D} depObj
 * @return {*}
 */
export declare function getDepKeys<D extends DepObj>(depObj: D): any[];
/**
 * generate ref value change with state
 *
 * @template T
 * @param {T} val
 * @return {*}
 */
export declare function useBindRef<T>(val: T): React.MutableRefObject<T>;
/**
 *  useMemo using object dependencies and error handler
 *
 * @template D
 * @param {D} depObj
 * @return {*}  {D}
 */
export declare function useCustomMemo<D extends DepObj>(depObj: D): D;
export declare function useCustomMemo<D extends DepObj, R>(
  depObj: D,
  memoFunc: (val: D) => R
): R;
/**
 *  useCallback using object dependencies and error handler
 *
 * @template D
 * @template P
 * @template R
 * @param {D} depObj
 * @param {(val: D, ...args: P) => R} memoFunc
 * @param {(err: Error) => ReturnType<EffectCallback>} [errorCb]
 * @return {*}
 */
export declare function useCustomCallback<D extends DepObj, P extends any[], R>(
  depObj: D,
  memoFunc: (val: D, ...args: P) => R,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
): (...props: P) => R;
/**
 *
 * useEffect using object dependencies
 *
 * can set if ignore first effect
 *
 * with error handler
 *
 * @template D
 * @param {D} depObj
 * @param {(val: D) => ReturnType<EffectCallback>} cb
 * @param {boolean} [ignoreFirst=false]
 * @param {(err: Error) => ReturnType<EffectCallback>} [errorCb]
 */
export declare function useCustomEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst?: boolean,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
): void;
/**
 * useLayoutEffect using object dependencies
 *
 * can set if ignore first effect
 *
 * with error handler
 *
 * @template D
 * @param {D} depObj
 * @param {(val: D) => ReturnType<EffectCallback>} cb
 * @param {boolean} [ignoreFirst=false]
 * @param {(err: Error) => ReturnType<EffectCallback>} [errorCb]
 */
export declare function useCustomLayoutEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst?: boolean,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
): void;
/**
 * useEffect that only depends part of deps
 *
 * using object dependencies
 *
 * can set if ignore first effect
 *
 * @template D
 * @template ND
 * @param {D} depObj
 * @param {ND} relObj
 * @param {(val: D, noDepVal: ND) => ReturnType<EffectCallback>} cb
 * @param {boolean} [ignoreFirst=false]
 * @param {(err: Error) => ReturnType<EffectCallback>} [errorCb]
 */
export declare function usePartialEffect<D extends DepObj, ND extends DepObj>(
  depObj: D,
  relObj: ND,
  cb: (val: D, noDepVal: ND) => ReturnType<EffectCallback>,
  ignoreFirst?: boolean,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
): void;
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
export declare function createService<P extends any[], R>(
  func: (...args: P) => R
): {
  P: (
    props: PropsWithChildren<
      P extends []
        ? {
            params?: P;
          }
        : {
            params: P;
          }
    >
  ) => JSX.Element;
  IN: () => R;
};
declare const fineHook: {
  S: typeof React.useState;
  M: typeof useCustomMemo;
  R: typeof React.useRef;
  BR: typeof useBindRef;
  C: typeof useCustomCallback;
  E: typeof useCustomEffect;
  LE: typeof useCustomLayoutEffect;
  PE: typeof usePartialEffect;
  D: typeof React.useDebugValue;
  X: typeof React.useReducer;
  IM: typeof React.useImperativeHandle;
  CTX: typeof React.useContext;
  CCTX: typeof React.createContext;
  CS: typeof createService;
};
export declare type FineHook = typeof fineHook;
export default fineHook;
