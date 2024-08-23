import { useCallback, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

export const useDebounce = <T extends AnyFunction>(func: T, delay: number): T => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [func, delay]) as T;

    return debouncedFunction;
};