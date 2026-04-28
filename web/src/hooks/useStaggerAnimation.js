const useStaggerAnimation = (delayMs = 0) => {
  return {
    animationName: "fadeSlideIn",
    animationDuration: "320ms",
    animationTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
    animationDelay: delayMs + "ms",
    animationFillMode: "both",
  };
};

export default useStaggerAnimation;