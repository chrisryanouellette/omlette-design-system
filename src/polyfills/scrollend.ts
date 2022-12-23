/** Heavily inspired by {@link [scrollyfills](https://github.com/argyleink/scrollyfills/blob/main/src/scrollend.js)}*/

const isSupported = "scrollend" in window;

if (!isSupported) {
  /* The event we will dispatch when the scrolling ends */
  const scrollendEvent = new Event("scrollend");
  /* List of pointer events for tracking touch events */
  const pointers = new Set<number>();

  /** Store touch identifiers on start */
  document.addEventListener("touchstart", (e) => {
    for (const touch of e.changedTouches) {
      pointers.add(touch.identifier);
    }
  });

  /** Delete touch identifiers on end */
  document.addEventListener("touchend", (e) => {
    for (const touch of e.changedTouches) {
      pointers.delete(touch.identifier);
    }
  });

  /**
   * A Map where the keys are the HTMLElement the event is assigned to
   * and the values are the event handler and listener count.
   * @see {@link [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)}
   * @see {@link [YouTube Video](https://www.youtube.com/watch?v=sXV_31fwetY)}
   */
  const observed = new WeakMap<
    HTMLElement,
    { scrollListener: () => void; listeners: number }
  >();

  /* Forward and observe calls to a native method */
  const observeFn = function observe(
    proto: Element | Window | Document,
    method: "addEventListener" | "removeEventListener",
    handler: (...args: any[]) => void
  ): void {
    /* Store the native event */
    const native = proto[method];
    /* Override the native event */
    proto[method] = function (...rest: Parameters<typeof native>): void {
      /* Call the native event */
      native.apply(this, rest);
      /* Call the handler with the native event */
      handler.apply(this, [native, ...rest]);
    };
  };

  /**
   * @this {HTMLElement}
   * @param {HTMLElement} this
   * @param {Function} original
   * @param {String} type
   * @return {void}
   */
  const onAddListenerHandler = function onAddListener(
    this: HTMLElement,
    /* the native event from the observe function */
    original: (...args: unknown[]) => unknown,
    /* The event string ( i.e. "scrollend" ) */
    type: string
  ): void {
    /*
    Polyfill scrollend event on any element for which the developer listens
    to the 'scrollend' or 'scroll'.
    Scrolls is added so adding a scrollend from within a scroll listener works.
    */
    if (type !== "scroll" && type !== "scrollend") {
      return;
    }

    /* Get the observed data from the HTMLElement */
    let data = observed.get(this);
    /* If this is the first time the element is being observed, create the data */
    if (data === undefined) {
      let timeout: NodeJS.Timeout | number = 0;
      data = {
        scrollListener: (): void => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            /* If there are pointers down, wait longer */
            if (pointers.size && data) {
              setTimeout(data.scrollListener, 100);
            } else {
              /* Send event */
              this.dispatchEvent(scrollendEvent);
              timeout = 0;
            }
          }, 100);
        },
        listeners: 0,
      };
      original.apply(this, ["scroll", data.scrollListener]);
      observed.set(this, data);
    }
    data.listeners++;
  };

  /**
   * @this {HTMLElement}
   * @param {HTMLElement} this
   * @param {Function} original
   * @param {String} type
   * @return {void}
   */
  const onRemoveListenerHandler = function onRemoveListener(
    this: HTMLElement,
    original: (...args: any[]) => void,
    type: string
  ): void {
    if (type !== "scroll" && type !== "scrollend") {
      return;
    }
    const data = observed.get(this);
    if (!data) {
      console.warn(
        "removeEventListener was called for scroll end event with a callback that was not used with addEventListener"
      );
      return;
    }

    /* I'm unsure what this does */
    data[type]--;

    /* If there are still listeners then stop processing */
    if (--data.listeners > 0) {
      return;
    }

    /* Otherwise remove the added listeners */
    original.apply(this, ["scroll", data.scrollListener]);
    observed.delete(this);
  };

  observeFn(Element.prototype, "addEventListener", onAddListenerHandler);
  observeFn(window, "addEventListener", onAddListenerHandler);
  observeFn(document, "addEventListener", onAddListenerHandler);
  observeFn(Element.prototype, "removeEventListener", onRemoveListenerHandler);
  observeFn(window, "removeEventListener", onRemoveListenerHandler);
  observeFn(document, "removeEventListener", onRemoveListenerHandler);
}

export {};
