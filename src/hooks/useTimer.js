import { useState, useEffect, useRef } from 'react';

export function useTimer(initialSeconds = 0) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, seconds]);

    const start = () => setIsActive(true);
    const pause = () => setIsActive(false);
    const reset = (newSeconds = initialSeconds) => {
        setIsActive(false);
        setSeconds(newSeconds);
    };

    return { seconds, isActive, start, pause, reset };
}
