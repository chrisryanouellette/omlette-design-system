import { FC, useCallback } from "react";
import { bindTemplate } from "@Storybook/types";
import { useTimer } from "@Utilities/timer";
import { useStore } from "@Utilities/store";
import { Button } from "../..";
import Docs from "./timer.docs.mdx";

type TimerArgs = {
  play: () => void;
  pause: () => void;
  restart: () => void;
};

const argTypes = {
  play: { action: "play", table: { disable: true } },
  pause: { action: "pause", table: { disable: true } },
  restart: { action: "restart", table: { disable: true } },
};

export default {
  title: "Utilities/Timer",
  argTypes,
  parameters: {
    controls: { sort: "alpha" },
    layout: "centered",
    docs: { page: Docs },
  },
};

const Timer = bindTemplate<FC<TimerArgs>>(({ pause, play, restart }) => {
  const timer = useTimer();
  const time = useStore(timer.store, (store) => store.time);
  const formatted = useStore(timer.store, () =>
    timer.format({ hours: true, minutes: true, seconds: true })
  );
  const active = useStore(timer.store, (store) => store.active);

  const handlePlay = useCallback(() => {
    timer.start();
    play();
  }, [play, timer]);

  const handlePause = useCallback(() => {
    timer.stop();
    pause();
  }, [pause, timer]);

  const handleRestart = useCallback(() => {
    timer.restart();
    restart();
  }, [restart, timer]);

  return (
    <main className="flex items-center flex-col gap-y-8">
      <p className="text-9xl">{time / 1000}</p>
      <p className="text-5xl">{formatted}</p>
      <div className="flex gap-x-4 w-min-4">
        <Button
          size="lg"
          className="w-28"
          onClick={active ? handlePause : handlePlay}
        >
          {active ? "Pause" : "Play"}
        </Button>
        <Button size="lg" className="w-28" onClick={handleRestart}>
          Restart
        </Button>
      </div>
    </main>
  );
});

export { Timer };
