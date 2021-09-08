import React, {
  useState,
  useMemo,
  EffectCallback,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useDebugValue,
  useReducer,
  useImperativeHandle,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";

export type DepObj = { [key: string]: any; [key: number]: any };

/**
 * generate dependency list from object
 *
 * @template D
 * @param {D} depObj
 * @return {*}
 */
export function getDepKeys<D extends DepObj>(depObj: D) {
  return Object.keys(depObj).map((key) => depObj[key]);
}

/**
 * generate ref value change with state
 *
 * @template T
 * @param {T} val
 * @return {*}
 */
export function useBindRef<T>(val: T) {
  const result = useRef(val);
  result.current = val;
  return result;
}

/**
 *  useMemo using object dependencies and error handler
 *
 * @template D
 * @param {D} depObj
 * @return {*}  {D}
 */
export function useCustomMemo<D extends DepObj>(depObj: D): D;
export function useCustomMemo<D extends DepObj, R>(
  depObj: D,
  memoFunc: (val: D) => R
): R;
export function useCustomMemo<D extends DepObj, R>(
  depObj: D,
  memoFunc?: (val: D) => R,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
) {
  const deps = getDepKeys(depObj);
  const errorCbR = useBindRef(errorCb);
  // eslint-disable-next-line
  return useMemo(() => {
    try {
      return memoFunc ? memoFunc(depObj) : depObj;
    } catch (err) {
      errorCbR.current?.(err);
    }
  }, deps);
}

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
export function useCustomCallback<D extends DepObj, P extends any[], R>(
  depObj: D,
  memoFunc: (val: D, ...args: P) => R,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
) {
  const deps = getDepKeys(depObj);
  const errorCbR = useBindRef(errorCb);
  // eslint-disable-next-line
  return useCallback((...props: P) => {
    try {
      return memoFunc(depObj, ...props);
    } catch (err) {
      errorCbR.current?.(err);
    }
  }, deps);
}

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
export function useCustomEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const errorCbR = useBindRef(errorCb);
  const changedR = useRef(!ignoreFirst);
  useEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    try {
      return cbR.current(depObj);
    } catch (err) {
      if (errorCbR.current) {
        return errorCbR.current?.(err);
      }
    }
    // eslint-disable-next-line
  }, deps);
}

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
export function useCustomLayoutEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const changedR = useRef(!ignoreFirst);
  const errorCbR = useBindRef(errorCb);
  useLayoutEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    try {
      return cbR.current(depObj);
    } catch (err) {
      if (errorCbR.current) {
        return errorCbR.current?.(err);
      }
    }
    // eslint-disable-next-line
  }, deps);
}

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
export function usePartialEffect<D extends DepObj, ND extends DepObj>(
  depObj: D,
  relObj: ND,
  cb: (val: D, noDepVal: ND) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false,
  errorCb?: (err: Error) => ReturnType<EffectCallback>
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const errorCbR = useBindRef(errorCb);
  const relayR = useBindRef(relObj);
  const changedR = useRef(!ignoreFirst);
  useEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    try {
      return cbR.current(depObj, relayR.current);
    } catch (err) {
      if (errorCbR.current) {
        return errorCbR.current?.(err);
      }
    }
    // eslint-disable-next-line
  }, deps);
}

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
export function createService<P extends any[], R>(func: (...args: P) => R) {
  const ServiceContext = createContext<R | null>(null);
  ServiceContext.displayName = func.name || "unkonwn_service";
  function ServiceProvider(
    props: PropsWithChildren<P extends [] ? { params?: P } : { params: P }>
  ) {
    const { children, params } = props;
    const serviceData = func(...((params || []) as any));
    return useMemo(
      () => (
        <ServiceContext.Provider value={serviceData}>
          {children}
        </ServiceContext.Provider>
      ),
      [children, serviceData]
    );
  }
  function useServiceInject() {
    const serviceData = useContext(ServiceContext);
    const usedData = useMemo(() => {
      if (serviceData === null) {
        throw new Error("[service useInject] cannot inject before provided");
      }
      return serviceData;
    }, [serviceData]);
    return usedData;
  }
  return {
    P: ServiceProvider,
    IN: useServiceInject,
  };
}

const fineHook = {
  S: useState,
  M: useCustomMemo,
  R: useRef,
  BR: useBindRef,
  C: useCustomCallback,
  E: useCustomEffect,
  LE: useCustomLayoutEffect,
  PE: usePartialEffect,
  D: useDebugValue,
  X: useReducer,
  IM: useImperativeHandle,
  CTX: useContext,
  CCTX: createContext,
  CS: createService,
};
export type FineHook = typeof fineHook;

export default fineHook;
