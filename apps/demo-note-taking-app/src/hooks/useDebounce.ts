import {useCallback, useRef} from "react";

export const useDebounce = <Func extends (...args: never[]) => void>(
    func: Func,
    debounceValueInMs: number,
) => {
    const timeoutRef = useRef<number>();
    return useCallback(
        (...args: Parameters<Func>) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(
                () => func(...args),
                debounceValueInMs,
            );
        },
        [func, debounceValueInMs],
    );
};
