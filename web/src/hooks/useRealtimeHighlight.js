import { useCallback, useEffect, useRef, useState } from "react";

const useRealtimeHighlight = ({
  items,
  getItemId,
  getItemState,
  durationMs = 700,
}) => {
  const previousStateRef = useRef({});
  const [highlightMap, setHighlightMap] = useState({});
  const [changeEvents, setChangeEvents] = useState([]);

  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    const changed = {};
    const events = [];

    items.forEach((item, index) => {
      const id = String(getItemId(item, index));
      const state = getItemState(item);
      const previousState = previousStateRef.current[id];

      if (typeof previousState === "boolean" && previousState !== state) {
        changed[id] = true;
        events.push({ id, item, previousState, currentState: state });
      }

      previousStateRef.current[id] = state;
    });

    if (events.length === 0) {
      return;
    }

    setHighlightMap((prev) => ({ ...prev, ...changed }));
    setChangeEvents(events);

    const timer = window.setTimeout(() => {
      setHighlightMap((prev) => {
        const next = { ...prev };
        Object.keys(changed).forEach((id) => {
          delete next[id];
        });
        return next;
      });
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [items, getItemId, getItemState, durationMs]);

  const clearChangeEvents = useCallback(() => {
    setChangeEvents([]);
  }, []);

  return {
    highlightMap,
    changeEvents,
    clearChangeEvents,
  };
};

export default useRealtimeHighlight;