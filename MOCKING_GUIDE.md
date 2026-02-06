# Mocking Guide for Testing

This guide shows you how to mock AUTH_API and other modules for reusable testing patterns.

## Table of Contents
1. [Reusable AUTH_API Mock Setup](#reusable-auth_api-mock-setup)
2. [How to Use in Tests](#how-to-use-in-tests)
3. [Other Common Mocks](#other-common-mocks)

---

## Reusable AUTH_API Mock Setup

### 1. Mock Utilities Location
We've created reusable mock utilities in [`src/test/setup/auth-api-mock.ts`](src/test/setup/auth-api-mock.ts)

This file contains:
- `mockUserInfo` - Reusable user data
- `mockAuthLoginResponse` - Reusable login response
- `createAuthApiMock()` - Factory to create mock functions
- `authApiMockHelpers` - Helper functions for common scenarios

### 2. Alternative: Vitest Auto-Mocking
You can also use Vitest's auto-mocking with [`src/api/endpoint/__mocks__/auth.ts`](src/api/endpoint/__mocks__/auth.ts)

---

## How to Use in Tests

### Method 1: Manual Mock with vi.mock() (Recommended)

```typescript
import { vi } from "vitest";
import { mockAuthLoginResponse } from "@/test/setup/auth-api-mock";

// Mock at the top of your test file
vi.mock("@/api/endpoint/auth", () => ({
  AUTH_API: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe("YourComponent", () => {
  it("should handle successful login", async () => {
    // Import after mocking
    const { AUTH_API } = await import("@/api/endpoint/auth");

    // Setup mock behavior
    vi.mocked(AUTH_API.login).mockResolvedValue(mockAuthLoginResponse);

    // Your test code...

    expect(AUTH_API.login).toHaveBeenCalledWith({ lineUid: "..." });
  });

  it("should handle login error", async () => {
    const { AUTH_API } = await import("@/api/endpoint/auth");

    // Mock rejection
    vi.mocked(AUTH_API.login).mockRejectedValue(new Error("Login failed"));

    // Your test code...
  });
});
```

### Method 2: Using Mock Helpers

```typescript
import { vi } from "vitest";
import { authApiMockHelpers, mockAuthLoginResponse } from "@/test/setup/auth-api-mock";

vi.mock("@/api/endpoint/auth", () => ({
  AUTH_API: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe("YourComponent", () => {
  let mockLogin: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const { AUTH_API } = await import("@/api/endpoint/auth");
    mockLogin = vi.mocked(AUTH_API.login);
  });

  it("should login successfully", async () => {
    // Use helper for success case
    authApiMockHelpers.setupSuccessLogin(mockLogin);

    // Your test code...
  });

  it("should handle login failure", async () => {
    // Use helper for error case
    authApiMockHelpers.setupFailedLogin(mockLogin, "Custom error message");

    // Your test code...
  });

  it("should login with custom response", async () => {
    // Override specific fields
    authApiMockHelpers.setupSuccessLogin(mockLogin, {
      userInfo: {
        ...mockAuthLoginResponse.userInfo,
        fullname: "Custom Name",
      },
    });

    // Your test code...
  });
});
```

### Method 3: Vitest Auto-Mock (Alternative)

```typescript
import { vi } from "vitest";

// This will automatically use __mocks__/auth.ts
vi.mock("@/api/endpoint/auth");

// Then import and use
import { AUTH_API, setupSuccessLogin, setupFailedLogin } from "@/api/endpoint/auth";

describe("YourComponent", () => {
  it("should login", async () => {
    setupSuccessLogin(); // Uses the mock from __mocks__

    // Your test code...
  });
});
```

---

## Other Common Mocks

### Mocking Local Storage

```typescript
vi.mock("@/lib/local-storage-helper", () => ({
  saveToken: vi.fn(),
  saveAT: vi.fn(),
  getToken: vi.fn(),
  getAT: vi.fn(),
  deleteToken: vi.fn(),
  deleteAt: vi.fn(),
}));
```

### Mocking React Query

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Component with React Query", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it("renders", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <YourComponent />
      </QueryClientProvider>
    );
  });
});
```

### Mocking Context Providers

```typescript
import * as LineContext from "@/context/LineContext/LineContext";

const mockLineContext: LineContext.TLineContext = {
  lineCtx: {
    isLogin: true as const, // Important: use 'as const' for literal types
    profile: {
      displayName: "Test User",
      userId: "U1234567890",
      pictureUrl: "https://example.com/pic.jpg",
    },
  },
};

beforeEach(() => {
  vi.spyOn(LineContext, "useLineContext").mockReturnValue(mockLineContext);
});
```

### Mocking LIFF SDK

```typescript
vi.mock("@line/liff", () => ({
  liff: {
    init: vi.fn(),
    login: vi.fn(),
    isLoggedIn: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

// Usage
import { liff } from "@line/liff";

vi.mocked(liff.init).mockResolvedValue();
vi.mocked(liff.isLoggedIn).mockReturnValue(true);
vi.mocked(liff.getProfile).mockResolvedValue({
  displayName: "Test User",
  userId: "U1234567890",
  pictureUrl: "https://example.com/pic.jpg",
});
```

### Mocking Toast Context

```typescript
import * as ToastContext from "@/context/ToastContext/ToastContext";

const mockToast = {
  toasts: [],
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  addToast: vi.fn(),
  removeToast: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(ToastContext, "useToast").mockReturnValue(mockToast);
});
```

### Mocking Environment Variables

```typescript
import { vi } from "vitest";

// Mock environment variable
vi.stubEnv("VITE_LIFF_ID", "test-liff-id");

// Reset in beforeEach
beforeEach(() => {
  vi.stubEnv("VITE_LIFF_ID", "test-liff-id");
});
```

---

## Best Practices

1. **Clear mocks between tests**
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
   });
   ```

2. **Import after mocking** (for ES modules)
   ```typescript
   vi.mock("@/api/endpoint/auth", () => ({ ... }));

   // Inside test:
   const { AUTH_API } = await import("@/api/endpoint/auth");
   ```

3. **Use type-safe mocks**
   ```typescript
   vi.mocked(AUTH_API.login).mockResolvedValue(mockResponse);
   ```

4. **Test both success and error cases**
   ```typescript
   it("handles success", () => { /* mock success */ });
   it("handles error", () => { /* mock error */ });
   ```

5. **Use waitFor for async operations**
   ```typescript
   await waitFor(() => {
     expect(mockFunction).toHaveBeenCalled();
   });
   ```

6. **Create reusable mock data**
   - Keep mock data in separate files
   - Export and reuse across tests
   - Use TypeScript types for type safety

---

## Testing Custom Hooks

### Testing Hooks that Use React Query

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthLogin } from "./useAuthLogin";
import React from "react";

describe("useAuthLogin", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  // Wrapper for React Query
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it("should login successfully", async () => {
    const { AUTH_API } = await import("@/api/endpoint/auth");
    vi.mocked(AUTH_API.login).mockResolvedValue(mockAuthLoginResponse);

    const onSuccess = vi.fn();

    // Use renderHook with wrapper
    const { result } = renderHook(
      () => useAuthLogin({ onSuccess }),
      { wrapper }
    );

    // Call the hook function
    await result.current.login("U1234567890");

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

## Complete Example

See these files for complete examples:
- [`src/context/LineContext/LineContextProvider.test.tsx`](src/context/LineContext/LineContextProvider.test.tsx) - Mocking LIFF and Toast
- [`src/context/AuthContext/AuthContextProvider.test.tsx`](src/context/AuthContext/AuthContextProvider.test.tsx) - Mocking AUTH_API and contexts
- [`src/hooks/useAuthLogin.test.ts`](src/hooks/useAuthLogin.test.ts) - Testing custom hooks with React Query

---

## Quick Reference

| What to Mock | How to Mock |
|--------------|-------------|
| AUTH_API | `vi.mock("@/api/endpoint/auth")` |
| Local Storage | `vi.mock("@/lib/local-storage-helper")` |
| LIFF SDK | `vi.mock("@line/liff")` |
| Context Hook | `vi.spyOn(Context, "useContext").mockReturnValue()` |
| Environment | `vi.stubEnv("VAR_NAME", "value")` |
| Async Success | `mockFn.mockResolvedValue(data)` |
| Async Error | `mockFn.mockRejectedValue(new Error("..."))` |
| Sync Return | `mockFn.mockReturnValue(data)` |
