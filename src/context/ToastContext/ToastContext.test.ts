import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ToastContextProvider from "./ToastContextProvider";
import { act, renderHook } from "@testing-library/react";
import { useToast } from "./ToastContext";


describe("test useToast hook", () => {
    describe("test add toast", () => {
        it("should add success toast with default duration", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.success('toast-1')
            })
            const current = result.current.toasts[0]
            expect(current.message).toBe('toast-1')
            expect(current.position).toBe('top-right')
            expect(current.type).toBe('success')
            expect(current.duration).toBe(1000)
        })

        it("should add info toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.info('toast-1')
            })
            const current = result.current.toasts[0]
            expect(current.message).toBe('toast-1')
            expect(current.position).toBe('top-right')
            expect(current.type).toBe('info')
            expect(current.duration).toBe(1000)
        })

        it("should add warn toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.warning('toast-1')
            })
            const current = result.current.toasts[0]
            expect(current.message).toBe('toast-1')
            expect(current.position).toBe('top-right')
            expect(current.type).toBe('warning')
            expect(current.duration).toBe(1000)
        })

        it("should add error toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.error('toast-1')
            })
            const current = result.current.toasts[0]
            expect(current.message).toBe('toast-1')
            expect(current.position).toBe('top-right')
            expect(current.type).toBe('error')
            expect(current.duration).toBe(1000)
        })
    })

    describe("should add toast with correct duration", () => {
        const duration = 500
        it("should add success toast with given duration", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.success('toast-1', duration)
            })
            const current = result.current.toasts[0]
            expect(current.duration).toBe(duration)
        })

        it("should add info toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.info('toast-1', duration)
            })
            const current = result.current.toasts[0]
            expect(current.duration).toBe(duration)
        })

        it("should add warn toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.warning('toast-1', duration)
            })
            const current = result.current.toasts[0]
            expect(current.duration).toBe(duration)
        })

        it("should add error toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.error('toast-1', duration)
            })
            const current = result.current.toasts[0]
            expect(current.duration).toBe(duration)
        })
    })

    describe("test remove toast", () => {
        it("should correclty remove toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.success('toast-1', 5000)
                result.current.success('toast-2', 5000)
                result.current.success('toast-3', 5000)
            })
            const current = result.current.toasts

            const ids = current.map(t => t.id)
            const uniqueIds = new Set(ids)
            expect(uniqueIds.size).toBe(3)

            expect(current.length).toBe(3)
            act(() => {
                result.current.removeToast(current[1].id)
            })
            expect(result.current.toasts.map(({ message }) => message)).toStrictEqual(['toast-1', 'toast-3'])
        })
    })

    describe("test addToast function", () => {
        it("should add toast with custom position", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.addToast({
                    type: 'success',
                    message: 'Custom toast',
                    position: 'bottom-left',
                    duration: 3000
                })
            })

            const current = result.current.toasts[0]
            expect(current.position).toBe('bottom-left')
            expect(current.duration).toBe(3000)
        })

    })

    describe("test automatic remove toast", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.restoreAllMocks()
        })

        it("should clear toast", () => {
            const { result } = renderHook(() => useToast(), { wrapper: ToastContextProvider })
            act(() => {
                result.current.success('toast-1', 1000)
                result.current.success('toast-2', 2000)
                result.current.success('toast-3', 1000)
            })

            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current.toasts.length).toBe(3)
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current.toasts.length).toBe(1)

        })
    })
})