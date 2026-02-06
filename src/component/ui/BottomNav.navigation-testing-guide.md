# Testing Navigation in React Router: Complete Guide

## The Question: How to Check `window.location` with MemoryRouter?

**Short Answer**: With `MemoryRouter`, `window.location` **doesn't change**. You have 3 options:

---

## Option 1: Use `useLocation` Hook (✅ RECOMMENDED)

This is the **best approach** because it tests navigation the React Router way.

```typescript
import { useLocation } from "react-router-dom";

// Helper component to expose current route in tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

// Include it in your test wrapper
const RouterWrapper = ({ children }) => (
  <MemoryRouter>
    <LocationDisplay />
    {children}
  </MemoryRouter>
);

// Test navigation
it("should navigate to /home", async () => {
  const user = userEvent.setup();
  render(<BottomNav />, { wrapper: RouterWrapper });

  await user.click(screen.getByRole("link", { name: /home/i }));

  const locationDisplay = screen.getByTestId("location-display");
  expect(locationDisplay).toHaveTextContent("/home");
});
```

**Pros**:
- ✅ Tests the actual React Router behavior
- ✅ No mocking required
- ✅ Fast and reliable
- ✅ Works with MemoryRouter

**Cons**:
- ❌ Requires a helper component

---

## Option 2: Check the Link's `href` Attribute

Verify the link points to the correct path without actually navigating.

```typescript
it("should have correct href for home link", () => {
  render(<BottomNav />, { wrapper: RouterWrapper });

  const homeLink = screen.getByRole("link", { name: /home/i });
  expect(homeLink).toHaveAttribute("href", "/home");
});
```

**Pros**:
- ✅ Simple and straightforward
- ✅ No helper components needed
- ✅ Fast

**Cons**:
- ❌ Doesn't test actual navigation behavior
- ❌ Only verifies the link is configured correctly

---

## Option 3: Mock `window.location` (❌ NOT RECOMMENDED)

You can spy on `window.location`, but it's complex and brittle.

```typescript
import { vi } from "vitest";

it("should update window.location (NOT RECOMMENDED)", () => {
  // This is complex and doesn't work well with MemoryRouter
  delete window.location;
  window.location = { pathname: "/" } as any;

  const locationSpy = vi.spyOn(window.location, "pathname", "get");

  // ... test code ...

  expect(locationSpy).toHaveBeenCalled();
});
```

**Pros**:
- ✅ Tests actual browser behavior

**Cons**:
- ❌ Doesn't work with MemoryRouter (routes don't affect window.location)
- ❌ Requires complex mocking
- ❌ Fragile and hard to maintain
- ❌ Couples tests to browser implementation

---

## Option 4: Use `BrowserRouter` with `createMemoryHistory` (Advanced)

For integration tests that need full browser behavior.

```typescript
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";

it("should navigate using history API", async () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const user = userEvent.setup();

  render(
    <HistoryRouter history={history}>
      <BottomNav />
    </HistoryRouter>
  );

  await user.click(screen.getByRole("link", { name: /home/i }));

  expect(history.location.pathname).toBe("/home");
});
```

**Pros**:
- ✅ Full control over history
- ✅ Can test forward/back navigation
- ✅ Works like real routing

**Cons**:
- ❌ More complex setup
- ❌ Uses unstable API
- ❌ Overkill for simple navigation tests

---

## Comparison Table

| Approach | Complexity | Reliability | Recommended |
|----------|-----------|-------------|-------------|
| **Option 1: useLocation helper** | Low | High | ✅ **YES** |
| Option 2: Check href | Very Low | Medium | For simple cases |
| Option 3: Mock window.location | High | Low | ❌ **NO** |
| Option 4: MemoryHistory | Medium | High | For advanced scenarios |

---

## Final Recommendation

**Use Option 1** (the `useLocation` helper) for most cases. It's:
- Simple to implement
- Tests actual routing behavior
- Doesn't require mocking
- Works perfectly with `MemoryRouter`

The updated test file now uses this approach! 🎉
