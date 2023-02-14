import { useCallback, useEffect, useMemo, useRef } from "react";
import { ReadOnlyUseCreateStore, useCreateStore } from "./store";

function getStartTime(): number {
  return document.timeline
    ? document.timeline.currentTime || performance.now()
    : performance.now();
}

/** Schedules the next update to the store.
 * @param {number} time
 * @param {number} startTime
 * @param {number} ms
 * @param {function} cb
 * @return {number}
 */
function schedule(
  time: number,
  startTime: number,
  ms: number,
  cb: (time: number) => void
): NodeJS.Timeout {
  const elapsed = time - startTime;
  const roundedElapsed = Math.round(elapsed / ms) * ms;
  const targetNext = startTime + roundedElapsed + ms;
  const delay = targetNext - performance.now();
  return setTimeout(() => requestAnimationFrame(cb), delay);
}

export type FormatOptions = {
  hours?: boolean;
  minutes?: boolean;
  seconds?: boolean;
  milliseconds?: boolean;
};

export type UseTimerState = { time: number; active: boolean };

export type UseTimer = {
  /** Begins the timer */
  start: () => void;
  /** Sets the timer back to 0 and begins runs the start function */
  restart: () => void;
  /** Stops the timer without resetting it */
  stop: () => void;
  /** Sets the timer, time is in milliseconds */
  set: (time: number) => void;
  /** Formats the time into a string */
  format: (opts?: FormatOptions) => string;
  store: ReadOnlyUseCreateStore<UseTimerState>;
};

/** Creates a one tick timer and saves it in a store
 *
 * [Inspired by HTTP 203](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95)
 *
 * @param {number} ms - The milliseconds used to tick the timer
 * @return {Store}
 * @example
 * const timer = useTimer();
 * const time = useStore(timer);
 *
 * return <p>{time}</p>;
 */
function useTimer(ms = 1000): UseTimer {
  const store = useCreateStore<UseTimerState>({
    time: 0,
    active: false,
  });
  /* 
    Prefer currentTime, as it'll better sync animations queued in the
    same frame, but if it isn't supported, performance.now() is fine.
  */
  const startTime = useRef(getStartTime());
  const tick = useRef<number>(startTime.current);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const pausedTick = useRef<number>(startTime.current);
  const controller = useRef<AbortController>(new AbortController());

  /** Update the store on each timeout callback */
  const frame = useCallback<(time: number) => void>(
    (time) => {
      if (controller.current.signal.aborted) return;
      tick.current = time;
      const last = store.get().time;
      store.set({ time: last + ms });
      timeout.current = schedule(time, startTime.current, ms, frame);
    },
    [ms, store]
  );

  const start = useCallback<UseTimer["start"]>(() => {
    if (store.get().active) {
      return console.warn(
        `The useTimer is running but tried to be started again.`
      );
    }
    controller.current = new AbortController();
    store.set({ active: true });
    timeout.current = schedule(tick.current, startTime.current, ms, frame);
  }, [frame, ms, store]);

  const restart = useCallback<UseTimer["restart"]>(() => {
    store.set({ time: 0 });
  }, [store]);

  const stop = useCallback<UseTimer["stop"]>(() => {
    controller.current.abort();
    timeout.current && clearTimeout(timeout.current);
    store.set({ active: false });
  }, [store]);

  /** This function will only display up to 99:99:99:999 correctly then role over to 0 */
  const format = useCallback<UseTimer["format"]>(
    (opts = { minutes: true, seconds: true }) => {
      const date = new Date(store.get().time);
      const formatted = date.toISOString().slice(11, -1);
      const [hours, minutes, seconds, milliseconds] = formatted.split(/[:.]/g);
      const time = [];
      if (opts.hours) time.push(hours);
      if (opts.minutes) time.push(minutes);
      if (opts.seconds) time.push(seconds);
      if (opts.milliseconds) time.push(milliseconds);

      return time.join(":");
    },
    [store]
  );

  const set = useCallback<UseTimer["set"]>(
    (time) => {
      timeout.current && clearTimeout(timeout.current);
      store.set({ time });
      if (store.get().active) {
        start();
      }
    },
    [start, store]
  );

  /** Handles toggling the timer on and off when the document is hidden / visible */
  const toggle = useCallback<() => void>(() => {
    if (document.hidden) {
      /* Store where we paused so we can calculate it later */
      pausedTick.current = tick.current;
      stop();
    } else if (!store.get().active) {
      /* Determine has long has passed while the page was hidden */
      const time = getStartTime();
      const elapsed = time - pausedTick.current;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const passed = store.get().time;
      tick.current = time;
      store.set({ time: passed + roundedElapsed });
      start();
    }
  }, [ms, start, stop, store]);

  useEffect(() => {
    if (!store.get().active) {
      start();
    }
  }, [start, store]);

  useEffect(() => {
    document.addEventListener("visibilitychange", toggle);

    return function timerVisibilityCleanup() {
      document.removeEventListener("visibilitychange", toggle);
    };
  }, [store, toggle]);

  return useMemo(
    () => ({ store, start, restart, stop, set, format }),
    [stop, restart, start, set, format, store]
  );
}

export { useTimer };
