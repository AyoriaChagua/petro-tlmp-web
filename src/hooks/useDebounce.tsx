import { useCallback, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

export const useDebounce = <T extends AnyFunction>(func: T, delay: number): ((...args: Parameters<T>) => Promise<ReturnType<T>>) =>{
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        return new Promise<ReturnType<T>>((resolve) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(async () => {
                const result = await func(...args);
                resolve(result);
            }, delay);
        });
    }, [func, delay]);

    return debouncedFunction;
};