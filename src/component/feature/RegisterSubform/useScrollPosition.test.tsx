import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import useScrollPosition from "./useScrollPosition";

/**
 * The hook's useEffect runs once on mount with `[]`.
 * At that point the ref must already be attached to a real DOM element,
 * otherwise the scroll listener is never registered.
 *
 * Strategy: render a real component that attaches the ref, then imperatively
 * set jsdom scroll geometry properties and dispatch a scroll event.
 */

function mockScrollGeometry(
  el: HTMLElement,
  opts: { scrollTop: number; scrollHeight: number; clientHeight: number },
) {
  Object.defineProperty(el, "scrollTop", {
    configurable: true,
    value: opts.scrollTop,
  });
  Object.defineProperty(el, "scrollHeight", {
    configurable: true,
    value: opts.scrollHeight,
  });
  Object.defineProperty(el, "clientHeight", {
    configurable: true,
    value: opts.clientHeight,
  });
}

// A thin test component that exposes hook state via data attributes
function TestComponent({
  onHasScrolled,
}: {
  onHasScrolled?: (v: boolean) => void;
}) {
  const { termsBoxRef, hasScrolledToBottom } =
    useScrollPosition<HTMLDivElement>();

  React.useEffect(() => {
    onHasScrolled?.(hasScrolledToBottom);
  }, [hasScrolledToBottom, onHasScrolled]);

  return (
    <div
      ref={termsBoxRef}
      data-testid="scroll-box"
      data-scrolled={String(hasScrolledToBottom)}
    />
  );
}

function getBox() {
  return screen.getByTestId("scroll-box");
}

describe("useScrollPosition", () => {
  it("starts with hasScrolledToBottom = false", () => {
    render(<TestComponent />);
    expect(getBox().dataset.scrolled).toBe("false");
  });

  it("sets hasScrolledToBottom = true when scrolled exactly to bottom", () => {
    render(<TestComponent />);
    const box = getBox();

    // scrollTop(490) + clientHeight(100) >= scrollHeight(600) - 10 → true
    mockScrollGeometry(box as HTMLElement, {
      scrollTop: 490,
      scrollHeight: 600,
      clientHeight: 100,
    });

    act(() => {
      box.dispatchEvent(new Event("scroll"));
    });

    expect(box.dataset.scrolled).toBe("true");
  });

  it("sets hasScrolledToBottom = true within 10px tolerance", () => {
    render(<TestComponent />);
    const box = getBox();

    // scrollTop(491) + clientHeight(100) = 591 >= scrollHeight(600) - 10 = 590 → true
    mockScrollGeometry(box as HTMLElement, {
      scrollTop: 491,
      scrollHeight: 600,
      clientHeight: 100,
    });

    act(() => {
      box.dispatchEvent(new Event("scroll"));
    });

    expect(box.dataset.scrolled).toBe("true");
  });

  it("does NOT set hasScrolledToBottom when not scrolled far enough", () => {
    render(<TestComponent />);
    const box = getBox();

    // scrollTop(200) + clientHeight(100) = 300 < scrollHeight(600) - 10 = 590 → false
    mockScrollGeometry(box as HTMLElement, {
      scrollTop: 200,
      scrollHeight: 600,
      clientHeight: 100,
    });

    act(() => {
      box.dispatchEvent(new Event("scroll"));
    });

    expect(box.dataset.scrolled).toBe("false");
  });

  it("stays true after scrolling back up once bottom was reached", () => {
    render(<TestComponent />);
    const box = getBox();

    // Scroll to bottom
    mockScrollGeometry(box as HTMLElement, {
      scrollTop: 490,
      scrollHeight: 600,
      clientHeight: 100,
    });
    act(() => {
      box.dispatchEvent(new Event("scroll"));
    });
    expect(box.dataset.scrolled).toBe("true");

    // Scroll back up — state is one-way, stays true
    mockScrollGeometry(box as HTMLElement, {
      scrollTop: 0,
      scrollHeight: 600,
      clientHeight: 100,
    });
    act(() => {
      box.dispatchEvent(new Event("scroll"));
    });

    expect(box.dataset.scrolled).toBe("true");
  });

  it("removes the scroll listener on unmount", () => {
    // Spy before render so it captures the listener registered during mount
    const removeListenerSpy = vi.spyOn(
      HTMLDivElement.prototype,
      "removeEventListener",
    );

    const { unmount } = render(<TestComponent />);
    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    removeListenerSpy.mockRestore();
  });
});
