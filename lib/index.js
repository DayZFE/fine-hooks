import React, { useState, useMemo, useEffect, useRef, useLayoutEffect, useCallback, useDebugValue, useReducer, useImperativeHandle, useContext, createContext, } from "react";
function getDepKeys(depObj) {
    return Object.keys(depObj).map((key) => depObj[key]);
}
function useBindRef(val) {
    const result = useRef(val);
    result.current = val;
    return result;
}
function useCustomMemo(depObj, memoFunc) {
    const deps = getDepKeys(depObj);
    // eslint-disable-next-line
    return useMemo(() => (memoFunc ? memoFunc(depObj) : depObj), deps);
}
function useCustomCallback(depObj, memoFunc) {
    const deps = getDepKeys(depObj);
    // eslint-disable-next-line
    return useCallback((...props) => memoFunc(depObj, ...props), deps);
}
function useCustomEffect(depObj, cb, ignoreFirst = false) {
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
function useCustomLayoutEffect(depObj, cb, ignoreFirst = false) {
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
function usePartialEffect(depObj, relObj, cb, ignoreFirst = false) {
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
    constructor() {
        /**
         * useState
         *
         * @memberof Hooks
         */
        this.S = useState;
        /**
         * useMemo using object dependencies
         *
         * @memberof Hooks
         */
        this.M = useCustomMemo;
        /**
         * useRef
         *
         * @memberof Hooks
         */
        this.R = useRef;
        /**
         * useRef bind with prop
         *
         * @memberof Hooks
         */
        this.BR = useBindRef;
        /**
         * useCallback using object dependencies
         *
         * @memberof Hooks
         */
        this.C = useCustomCallback;
        /**
         * useEffect using object dependencies
         *
         * can set if ignore first effect
         *
         * @memberof Hooks
         */
        this.E = useCustomEffect;
        /**
         * useLayoutEffect using object dependencies
         *
         * can set if ignore first effect
         *
         * @memberof Hooks
         */
        this.LE = useCustomLayoutEffect;
        /**
         * useEffect that only depends part of deps
         *
         * using object dependencies
         *
         * can set if ignore first effect
         *
         * @memberof Hooks
         */
        this.PE = usePartialEffect;
        /**
         * useDebugValue
         *
         * @memberof Hooks
         */
        this.D = useDebugValue;
        /**
         * useReducer
         *
         * @memberof Hooks
         */
        this.X = useReducer;
        /**
         * useImperativeHandle
         *
         * @memberof Hooks
         */
        this.IM = useImperativeHandle;
        /**
         * useContext
         *
         * @memberof Hooks
         */
        this.CTX = useContext;
        /**
         * createContext
         *
         * @memberof Hooks
         */
        this.CCTX = createContext;
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
        this.CS = createService;
    }
}
export default new Hooks();
