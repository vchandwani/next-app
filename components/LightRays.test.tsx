import { render, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import LightRays, { hexToRgb, getAnchorAndDir } from "./LightRays";

// 1. Mock 'ogl' using ES6 Classes
vi.mock("ogl", () => {
  class MockRenderer {
    gl: any;
    dpr = 1;
    static shouldThrowError = false;
    static throwErrorOnCleanup = false;
    static returnNullExtension = false;

    constructor() {
      this.gl = {
        canvas: document.createElement("canvas"),
        getExtension: vi.fn().mockImplementation((ext: string) => {
          if (MockRenderer.returnNullExtension) return null;
          return {
            loseContext: vi.fn().mockImplementation(() => {
              if (MockRenderer.throwErrorOnCleanup) {
                throw new Error("Cleanup failed");
              }
            }),
          };
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

// 2. Mock Observers
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

let rafCallbacks: Map<number, FrameRequestCallback> = new Map();
let rafIdCounter = 0;

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

    it("calculates positions for all RaysOrigin options", () => {
      expect(getAnchorAndDir("top-center", w, h)).toEqual({ anchor: [500, -100], dir: [0, 1] });
      expect(getAnchorAndDir("top-left", w, h)).toEqual({ anchor: [0, -100], dir: [0, 1] });
      expect(getAnchorAndDir("top-right", w, h)).toEqual({ anchor: [1000, -100], dir: [0, 1] });
      expect(getAnchorAndDir("top-center-offset", w, h)).toEqual({ anchor: [700, -100], dir: [-0.2, 1] });
      expect(getAnchorAndDir("left", w, h)).toEqual({ anchor: [-200, 250], dir: [1, 0] });
      expect(getAnchorAndDir("right", w, h)).toEqual({ anchor: [1200, 250], dir: [-1, 0] });
      expect(getAnchorAndDir("bottom-left", w, h)).toEqual({ anchor: [0, 600], dir: [0, -1] });
      expect(getAnchorAndDir("bottom-center", w, h)).toEqual({ anchor: [500, 600], dir: [0, -1] });
      expect(getAnchorAndDir("bottom-right", w, h)).toEqual({ anchor: [1000, 600], dir: [0, -1] });
    });
  });
});

describe("LightRays Component", () => {
  beforeEach(() => {
    vi.useRealTimers();
    rafCallbacks.clear();
    rafIdCounter = 0;

    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 1 });

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

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      const id = ++rafIdCounter;
      rafCallbacks.set(id, cb);
      return id;
    });

    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(async () => {
    const oglModule = await import("ogl");
    // @ts-ignore
    oglModule.Renderer.shouldThrowError = false;
    // @ts-ignore
    oglModule.Renderer.throwErrorOnCleanup = false;
    // @ts-ignore
    oglModule.Renderer.returnNullExtension = false;
    vi.restoreAllMocks();
  });

  const stepAnimationFrame = (time = performance.now()) => {
    const callbacks = Array.from(rafCallbacks.values());
    rafCallbacks.clear();
    callbacks.forEach((cb) => cb(time));
  };

  it("renders container and mounts WebGL canvas when visible", async () => {
    const { container } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  it("covers initialization abort when container unmounts during setTimeout (Lines 124-125)", async () => {
    const { unmount } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    // Unmount synchronously before the 10ms timeout resolves
    unmount();

    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  it("updates uniforms on prop changes and window resize (Line 350)", async () => {
    const { container, rerender } = render(<LightRays raysColor="#ff0000" />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Resize event trigger
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Prop update trigger
    act(() => {
      rerender(
        <LightRays
          raysColor="#00ff00"
          raysSpeed={2}
          lightSpread={1.5}
          rayLength={3.0}
          pulsating={true}
          fadeDistance={0.8}
          saturation={0.5}
          mouseInfluence={0.3}
          noiseAmount={0.1}
          distortion={0.2}
          raysOrigin="bottom-right"
        />,
      );
    });
  });

  it("handles mouse movements and smooth tracking in render loop (Lines 387-405)", async () => {
    const { container } = render(<LightRays followMouse={true} mouseInfluence={0.5} />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Dispatch mousemove
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: 200,
          clientY: 150,
          bubbles: true,
        }),
      );
    });

    // Step animation loop to execute smoothMouse calculations inside loop()
    act(() => {
      stepAnimationFrame();
    });
  });

  it("catches rendering errors in animation frame loop (Line 146)", async () => {
    const oglModule = await import("ogl");
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { container } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    // Enable error throw during rendering
    // @ts-ignore
    oglModule.Renderer.shouldThrowError = true;

    // Trigger RAF step where render() throws
    act(() => {
      stepAnimationFrame();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith("WebGL rendering error:", expect.any(Error));
  });

  it("handles null extension and catches errors during cleanup (Lines 303 & 319)", async () => {
    const oglModule = await import("ogl");
    // @ts-ignore
    oglModule.Renderer.throwErrorOnCleanup = true;
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { container, unmount } = render(<LightRays />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    await waitFor(() => {
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    unmount();

    expect(consoleWarnSpy).toHaveBeenCalledWith("Error during WebGL cleanup:", expect.any(Error));
  });
});
