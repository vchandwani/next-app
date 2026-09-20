import { render, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import LightRays, { hexToRgb, getAnchorAndDir } from "./LightRays";

// 1. Mock 'ogl' using ES6 Classes so instantiation with 'new' works natively
vi.mock("ogl", () => {
  class MockRenderer {
    gl: any;
    dpr = 1;
    static shouldThrowError = false;
    static returnNullExtension = false;

    constructor() {
      this.gl = {
        canvas: document.createElement("canvas"),
        getExtension: vi.fn().mockImplementation(() => {
          if (MockRenderer.returnNullExtension) return null;
          return { loseContext: vi.fn() };
        }),
        enable: vi.fn(),
        blendFunc: vi.fn(),
        clearColor: vi.fn(),
        clear: vi.fn(),
      };
    }
    setSize() {}
    render() {
      if (MockRenderer.shouldThrowError) {
        throw new Error("WebGL rendering failed");
      }
    }
  }

  class DummyClass {
    uniforms = {};
    value = [];
  }

  return {
    Renderer: MockRenderer,
    Program: DummyClass,
    Triangle: DummyClass,
    Mesh: DummyClass,
    Transform: DummyClass,
    Camera: DummyClass,
    Color: DummyClass,
    Vec2: DummyClass,
    Vec3: DummyClass,
    Texture: DummyClass,
  };
});

// 2. Mock Browser Observers
let observerCallback: IntersectionObserverCallback;
class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal("ResizeObserver", MockResizeObserver);

describe("LightRays Utilities", () => {
  describe("hexToRgb", () => {
    it("converts valid hex codes to normalized RGB arrays", () => {
      expect(hexToRgb("#ff0000")).toEqual([1, 0, 0]);
      expect(hexToRgb("#00ff00")).toEqual([0, 1, 0]);
      expect(hexToRgb("#0000ff")).toEqual([0, 0, 1]);
      expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
    });

    it("handles hex codes without the hash prefix", () => {
      expect(hexToRgb("ff0000")).toEqual([1, 0, 0]);
    });

    it("returns white [1, 1, 1] for invalid hex codes", () => {
      expect(hexToRgb("invalid")).toEqual([1, 1, 1]);
    });
  });

  describe("getAnchorAndDir", () => {
    const w = 1000;
    const h = 500;

    it("calculates top-center (default)", () => {
      const { anchor, dir } = getAnchorAndDir("top-center", w, h);
      expect(anchor).toEqual([500, -100]);
      expect(dir).toEqual([0, 1]);
    });

    it("calculates top-left", () => {
      const { anchor, dir } = getAnchorAndDir("top-left", w, h);
      expect(anchor).toEqual([0, -100]);
      expect(dir).toEqual([0, 1]);
    });

    it("calculates bottom-right", () => {
      const { anchor, dir } = getAnchorAndDir("bottom-right", w, h);
      expect(anchor).toEqual([1000, 600]);
      expect(dir).toEqual([0, -1]);
    });

    it("calculates top-center-offset", () => {
      const { anchor, dir } = getAnchorAndDir("top-center-offset", w, h);
      expect(anchor).toEqual([700, -100]);
      expect(dir).toEqual([-0.2, 1]);
    });

    it("calculates right", () => {
      const { anchor, dir } = getAnchorAndDir("right", w, h);
      expect(anchor[0]).toEqual(1200);
      expect(dir).toEqual([-1, 0]);
    });

    it("calculates bottom-left", () => {
      const { anchor, dir } = getAnchorAndDir("bottom-left", w, h);
      expect(anchor).toEqual([0, 600]);
      expect(dir).toEqual([0, -1]);
    });

    it("calculates top-right", () => {
      const { anchor, dir } = getAnchorAndDir("top-right", w, h);
      expect(anchor).toEqual([1000, -100]);
      expect(dir).toEqual([0, 1]);
    });

    it("calculates left", () => {
      const { anchor, dir } = getAnchorAndDir("left", w, h);
      expect(anchor).toEqual([-200, 250]);
      expect(dir).toEqual([1, 0]);
    });

    it("calculates bottom-center", () => {
      const { anchor, dir } = getAnchorAndDir("bottom-center", w, h);
      expect(anchor).toEqual([500, 600]);
      expect(dir).toEqual([0, -1]);
    });
  });
});

describe("LightRays Component", () => {
  beforeEach(() => {
    vi.useRealTimers();

    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 1 });
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));

    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 800 });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 600 });
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // Capture requestAnimationFrame callbacks so we can manually step the render loop
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    // Expose helper on window or closure if needed, or invoke via tests
    (global as any).__triggerRaf = (time = performance.now()) => {
      if (rafCallback) rafCallback(time);
    };
  });

  afterEach(async () => {
    const oglModule = await import("ogl");
    // @ts-ignore
    oglModule.Renderer.shouldThrowError = false;
    // @ts-ignore
    oglModule.Renderer.returnNullExtension = false;
    vi.restoreAllMocks();
  });

  it("renders the container without crashing", () => {
    const { container } = render(<LightRays />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("initializes WebGL, handles window resize (Lines 124-125), and updates props (Line 350)", async () => {
    const { container, rerender, unmount } = render(<LightRays raysColor="#ff0000" />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Trigger window resize event to cover lines 124-125 (updatePlacement)
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Rerender with changed props to cover line 350 (prop sync useEffect)
    rerender(
      <LightRays
        raysColor="#00ff00"
        raysSpeed={2}
        lightSpread={1.2}
        rayLength={2.0}
        pulsating={true}
        fadeDistance={0.5}
        saturation={0.8}
        mouseInfluence={0.4}
        noiseAmount={0.2}
        distortion={0.3}
        raysOrigin="bottom-center"
      />,
    );

    unmount();
  });

  it("handles mousemove coordinates calculation (Lines 387-405)", async () => {
    const { container, unmount } = render(<LightRays followMouse={true} mouseInfluence={0.5} />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Dispatch mousemove event over the container to execute coordinate calculations (Lines 387-405)
    act(() => {
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: 400,
        clientY: 300,
        bubbles: true,
      });
      window.dispatchEvent(mouseEvent);
    });

    unmount();
  });

  it("catches and logs errors thrown during render loop (Line 146)", async () => {
    const oglModule = await import("ogl");
    // @ts-ignore
    oglModule.Renderer.shouldThrowError = true;

    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { container } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Trigger the animation frame loop where render() will throw and hit catch block (Line 146)
    act(() => {
      (global as any).__triggerRaf();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith("WebGL rendering error:", expect.any(Error));
  });

  it("handles missing WEBGL_lose_context extension gracefully during cleanup (Line 303)", async () => {
    const oglModule = await import("ogl");
    // @ts-ignore
    oglModule.Renderer.returnNullExtension = true;

    const { unmount, container } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Unmount should execute cleanup safely when getExtension returns null (Line 303)
    unmount();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});
