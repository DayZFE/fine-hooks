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

type DepObj = { [key: string]: any; [key: number]: any };

function getDepKeys<D extends DepObj>(depObj: D) {
  return Object.keys(depObj).map((key) => depObj[key]);
}

function useBindRef<T>(val: T) {
  const result = useRef(val);
  result.current = val;
  return result;
}

function useCustomMemo<D extends DepObj>(depObj: D): D;
function useCustomMemo<D extends DepObj, R>(
  depObj: D,
  memoFunc: (val: D) => R
): R;
function useCustomMemo<D extends DepObj, R>(
  depObj: D,
  memoFunc?: (val: D) => R
) {
  const deps = getDepKeys(depObj);
  // eslint-disable-next-line
  return useMemo(() => (memoFunc ? memoFunc(depObj) : depObj), deps);
}

function useCustomCallback<D extends DepObj, P extends any[], R>(
  depObj: D,
  memoFunc: (val: D, ...args: P) => R
) {
  const deps = getDepKeys(depObj);
  // eslint-disable-next-line
  return useCallback((...props: P) => memoFunc(depObj, ...props), deps);
}

function useCustomEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const changedR = useRef(!ignoreFirst);
  useEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    return cbR.current(depObj);
    // eslint-disable-next-line
  }, deps);
}

function useCustomLayoutEffect<D extends DepObj>(
  depObj: D,
  cb: (val: D) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const changedR = useRef(!ignoreFirst);
  useLayoutEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    return cbR.current(depObj);
    // eslint-disable-next-line
  }, deps);
}

function createService<P extends any[], R>(func: (...args: P) => R) {
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

function usePartialEffect<D extends DepObj, ND extends DepObj>(
  depObj: D,
  relObj: ND,
  cb: (val: D, noDepVal: ND) => ReturnType<EffectCallback>,
  ignoreFirst: boolean = false
) {
  const deps = getDepKeys(depObj);
  const cbR = useBindRef(cb);
  const relayR = useBindRef(relObj);
  const changedR = useRef(!ignoreFirst);
  useEffect(() => {
    if (!changedR.current) {
      Promise.resolve().then(() => {
        changedR.current = true;
      });
      return;
    }
    return cbR.current(depObj, relayR.current);
    // eslint-disable-next-line
  }, deps);
}

/**
 * Simple Hooks accessor
 *
 * @class Hooks
 */
class Hooks {
  /**
   * useState
   *
   * @memberof Hooks
   */
  S = useState;
  /**
   * useMemo using object dependencies
   *
   * @memberof Hooks
   */
  M = useCustomMemo;
  /**
   * useRef
   *
   * @memberof Hooks
   */
  R = useRef;
  /**
   * useRef bind with prop
   *
   * @memberof Hooks
   */
  BR = useBindRef;

  /**
   * useCallback using object dependencies
   *
   * @memberof Hooks
   */
  C = useCustomCallback;

  /**
   * useEffect using object dependencies
   *
   * can set if ignore first effect
   *
   * @memberof Hooks
   */
  E = useCustomEffect;

  /**
   * useLayoutEffect using object dependencies
   *
   * can set if ignore first effect
   *
   * @memberof Hooks
   */
  LE = useCustomLayoutEffect;

  /**
   * useEffect that only depends part of deps
   *
   * using object dependencies
   *
   * can set if ignore first effect
   *
   * @memberof Hooks
   */
  PE = usePartialEffect;

  /**
   * useDebugValue
   *
   * @memberof Hooks
   */
  D = useDebugValue;
  /**
   * useReducer
   *
   * @memberof Hooks
   */
  X = useReducer;
  /**
   * useImperativeHandle
   *
   * @memberof Hooks
   */
  IM = useImperativeHandle;

  /**
   * useContext
   *
   * @memberof Hooks
   */
  CTX = useContext;

  /**
   * createContext
   *
   * @memberof Hooks
   */
  CCTX = createContext;

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
  CS = createService;
}
export default new Hooks();
