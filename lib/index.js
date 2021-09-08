import React, { useState, useMemo, useEffect, useRef, useLayoutEffect, useCallback, useDebugValue, useReducer, useImperativeHandle, useContext, createContext, } from "react";
/**
 * generate dependency list from object
 *
 * @template D
 * @param {D} depObj
 * @return {*}
 */
function getDepKeys(depObj) {
    return Object.keys(depObj).map((key) => depObj[key]);
}
/**
 * generate ref value change with state
 *
 * @template T
 * @param {T} val
 * @return {*}
 */
function useBindRef(val) {
    const result = useRef(val);
    result.current = val;
    return result;
}
function useCustomMemo(depObj, memoFunc, errorCb) {
    const deps = getDepKeys(depObj);
    const errorCbR = useBindRef(errorCb);
    // eslint-disable-next-line
    return useMemo(() => {
        var _a;
        try {
            return memoFunc ? memoFunc(depObj) : depObj;
        }
        catch (err) {
            (_a = errorCbR.current) === null || _a === void 0 ? void 0 : _a.call(errorCbR, err);
        }
    }, deps);
}
/**
 * useCallback using object dependencies and error handler
 *
 * @template D
 * @template P
 * @template R
 * @param {D} depObj
 * @param {(val: D, ...args: P) => R} memoFunc
 * @param {(err: Error) => ReturnType<EffectCallback>} [errorCb]
 * @return {*}
 */
function useCustomCallback(depObj, memoFunc, errorCb) {
    const deps = getDepKeys(depObj);
    const errorCbR = useBindRef(errorCb);
    // eslint-disable-next-line
    return useCallback((...props) => {
        var _a;
        try {
            return memoFunc(depObj, ...props);
        }
        catch (err) {
            (_a = errorCbR.current) === null || _a === void 0 ? void 0 : _a.call(errorCbR, err);
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
function useCustomEffect(depObj, cb, ignoreFirst = false, errorCb) {
    const deps = getDepKeys(depObj);
    const cbR = useBindRef(cb);
    const errorCbR = useBindRef(errorCb);
    const changedR = useRef(!ignoreFirst);
    useEffect(() => {
        var _a;
        if (!changedR.current) {
            Promise.resolve().then(() => {
                changedR.current = true;
            });
            return;
        }
        try {
            return cbR.current(depObj);
        }
        catch (err) {
            if (errorCbR.current) {
                return (_a = errorCbR.current) === null || _a === void 0 ? void 0 : _a.call(errorCbR, err);
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
function useCustomLayoutEffect(depObj, cb, ignoreFirst = false, errorCb) {
    const deps = getDepKeys(depObj);
    const cbR = useBindRef(cb);
    const changedR = useRef(!ignoreFirst);
    const errorCbR = useBindRef(errorCb);
    useLayoutEffect(() => {
        var _a;
        if (!changedR.current) {
            Promise.resolve().then(() => {
                changedR.current = true;
            });
            return;
        }
        try {
            return cbR.current(depObj);
        }
        catch (err) {
            if (errorCbR.current) {
                return (_a = errorCbR.current) === null || _a === void 0 ? void 0 : _a.call(errorCbR, err);
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
function usePartialEffect(depObj, relObj, cb, ignoreFirst = false, errorCb) {
    const deps = getDepKeys(depObj);
    const cbR = useBindRef(cb);
    const errorCbR = useBindRef(errorCb);
    const relayR = useBindRef(relObj);
    const changedR = useRef(!ignoreFirst);
    useEffect(() => {
        var _a;
        if (!changedR.current) {
            Promise.resolve().then(() => {
                changedR.current = true;
            });
            return;
        }
        try {
            return cbR.current(depObj, relayR.current);
        }
        catch (err) {
            if (errorCbR.current) {
                return (_a = errorCbR.current) === null || _a === void 0 ? void 0 : _a.call(errorCbR, err);
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
function createService(func) {
    const ServiceContext = createContext(null);
    ServiceContext.displayName = func.name || "unkonwn_service";
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
        P: ServiceProvider,
        IN: useServiceInject,
    };
}
/**
 * fine Hooks accessor
 *
 * @class FineHooks
 */
class FineHooks {
    constructor() {
        this.S = useState;
        this.M = useCustomMemo;
        this.R = useRef;
        this.BR = useBindRef;
        this.C = useCustomCallback;
        this.E = useCustomEffect;
        this.LE = useCustomLayoutEffect;
        this.PE = usePartialEffect;
        this.D = useDebugValue;
        this.X = useReducer;
        this.IM = useImperativeHandle;
        this.CTX = useContext;
        this.CCTX = createContext;
        this.CS = createService;
    }
}
export default new FineHooks();
