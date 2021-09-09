import React, {
  useMemo,
  EffectCallback,
  useEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
  PropsWithChildren,
  DependencyList,
} from "react";

/**
 * declare and bind ref to a value
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
export function useSafeCallback<F extends (...args: any[]) => any>(
  cb: F,
  deps: DependencyList,
  delay = -1,
  debounce: boolean = false,
  onError: (err: Error) => void = () => {}
) {
  const cbR = useBindRef(cb);
  const delayR = useBindRef(delay);
  const debounceR = useBindRef(debounce);
  const onErrorR = useBindRef(onError);
  const ended = useRef(false);
  const timeoutRef = useRef(0);
  const result = useCallback((...args: Parameters<F>) => {
    try {
      console.log(args);
      if (delayR.current > 0) {
        if (debounceR.current) {
          clearTimeout(timeoutRef.current);
        }
        const triggerCb = cbR.current;
        timeoutRef.current = setTimeout(() => {
          if (!ended.current) {
            triggerCb(...args);
          }
        }, delayR.current);
      } else {
        cbR.current(...args);
      }
    } catch (err) {
      onErrorR.current(err);
    }
    // eslint-disable-next-line
  }, deps);
  useEffect(() => {
    return () => {
      ended.current = true;
    };
  }, []);
  return result;
}

/**
 * partial dependencies effect with ignoreFirst and previous value compare
 *
 * also have error handler
 *
 * @template P
 * @template any
 */
export function usePartialEffect<P extends readonly any[]>(
  cb: (props: P, preProps: P | []) => ReturnType<EffectCallback>,
  deps: DependencyList,
  props: P,
  ignoreFirst: boolean = false,
  onError: (err: Error) => void = () => {}
) {
  const started = useRef(false);
  const cbR = useBindRef(cb);
  const propsR = useBindRef(props);
  const ignoreFirstR = useBindRef(ignoreFirst);
  const onErrorR = useBindRef(onError);
  const preProps = useRef<P | []>([]);
  useEffect(() => {
    Promise.resolve().then(() => {
      if (!started.current) started.current = true;
    });
  }, []);

  useEffect(() => {
    if (ignoreFirstR.current && !started.current) return;
    try {
      const result = cbR.current(propsR.current, preProps.current);
      preProps.current = [...propsR.current];
      return result;
    } catch (err) {
      onErrorR.current(err);
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
  ServiceContext.displayName = func.name || "unknown_service";
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
    Provider: ServiceProvider,
    useInject: useServiceInject,
  };
}
