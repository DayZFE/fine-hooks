import React, { useMemo, useEffect, useRef, useCallback, useContext, createContext, } from "react";
/**
 * declare and bind ref to a value
 *
 * @template T
 * @param {T} val
 * @return {*}
 */
export function useBindRef(val) {
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
export function useSafeCallback(cb, deps, delay = -1, debounce = false, onError = () => { }) {
    const cbR = useBindRef(cb);
    const delayR = useBindRef(delay);
    const debounceR = useBindRef(debounce);
    const onErrorR = useBindRef(onError);
    const ended = useRef(false);
    const timeoutRef = useRef(0);
    const result = useCallback((...args) => {
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
            }
            else {
                cbR.current(...args);
            }
        }
        catch (err) {
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
export function usePartialEffect(cb, deps, props, ignoreFirst = false, onError = () => { }) {
    const started = useRef(false);
    const cbR = useBindRef(cb);
    const propsR = useBindRef(props);
    const ignoreFirstR = useBindRef(ignoreFirst);
    const onErrorR = useBindRef(onError);
    const preProps = useRef([]);
    useEffect(() => {
        Promise.resolve().then(() => {
            if (!started.current)
                started.current = true;
        });
    }, []);
    useEffect(() => {
        if (ignoreFirstR.current && !started.current)
            return;
        try {
            const result = cbR.current(propsR.current, preProps.current);
            preProps.current = [...propsR.current];
            return result;
        }
        catch (err) {
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
export function createService(func) {
    const ServiceContext = createContext(null);
    ServiceContext.displayName = func.name || "unknown_service";
    function ServiceProvider(props) {
        const { children, params } = props;
        const serviceData = func(...(params || []));
        return useMemo(() => (React.createElement(ServiceContext.Provider, { value: serviceData }, children)), [children, serviceData]);
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
