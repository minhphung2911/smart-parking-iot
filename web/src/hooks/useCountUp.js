import { useEffect, useRef, useState } from "react";

const useCountUp = (targetValue, durationMs = 950) => {
  const [displayValue, setDisplayValue] = useState(Number(targetValue) || 0);
  const previousTargetRef = useRef(Number(targetValue) || 0);
  const frameRef = useRef(0);

  useEffect(() => {
    const startValue = previousTargetRef.current;
    const endValue = Number(targetValue) || 0;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    let startTime;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    window.cancelAnimationFrame(frameRef.current);

    const animate = (time) => {
      if (!startTime) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / durationMs, 1);
      const eased = easeOut(progress);
      const nextValue = startValue + (endValue - startValue) * eased;

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        previousTargetRef.current = endValue;
        setDisplayValue(endValue);
      }
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, durationMs]);

  return displayValue;
};

export default useCountUp;