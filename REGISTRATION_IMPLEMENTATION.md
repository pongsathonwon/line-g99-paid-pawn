# Multi-Step Registration Form Implementation

## Overview

A complete multi-step registration system for syncing LINE UIDs with existing POS user profiles. Supports both Thai (domestic) and foreign users with different approval workflows.

## Features Implemented

### ✅ User Search
- Search by ID Card / Passport Number
- Search by Mobile Number
- Search by Customer Code (custCode)
- Real-time validation with mock API

### ✅ OTP Verification
- 6-digit OTP input with auto-advance
- Paste support for quick entry
- Resend OTP functionality with 60-second timer
- Mock OTP verification (use `123456` to test)

### ✅ Dual Registration Flows
- **Thai Users**: Instant approval, immediate access
- **Foreign Users**: Pending approval workflow with notification

### ✅ State Management
- Context API for registration flow state
- React Query for API calls
- No Redux (as requested)

---

## File Structure

```
src/
├── api/endpoint/
│   └── register.ts                    # API endpoint functions (with mocks)
├── types/
│   └── register.ts                    # TypeScript type definitions
├── utils/
│   └── otp.ts                         # OTP utility functions
├── context/RegistrationContext/
│   ├── RegistrationContext.tsx        # Context definition
│   ├── RegistrationContextProvider.tsx # Provider component
│   ├── useRegistrationContext.tsx     # Custom hook
│   └── index.ts                       # Barrel export
├── component/ui/RegisterForm/
│   ├── RegisterForm.tsx               # Main orchestrator component
│   ├── SearchUserStep.tsx             # Step 1: Search user profile
│   ├── OTPVerificationStep.tsx        # Step 2: OTP verification
│   ├── SuccessStep.tsx                # Step 3: Success (Thai users)
│   └── PendingApprovalStep.tsx        # Step 3: Pending (Foreign users)
├── pages/
│   ├── RegistrationLandingPage.tsx    # Landing page with user type selection
│   ├── RegisterPage.tsx               # Thai user registration
│   └── ForeignRegisterPage.tsx        # Foreign user registration
└── routes/
    └── route.tsx                      # Updated routing
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/registration` | Landing page - choose domestic or foreign |
| `/register` | Thai user registration flow |
| `/foreign-register` | Foreign user registration flow |

---

## Registration Workflow

### Thai User Flow
```
/registration
    ↓
/register
    ↓
Step 1: Search Profile (cardId/mobile/custCode)
    ↓
Step 2: Verify OTP (6-digit code)
    ↓
Step 3: Success → Redirect to /home
```

### Foreign User Flow
```
/registration
    ↓
/foreign-register
    ↓
Step 1: Search Profile (cardId/mobile/custCode)
    ↓
Step 2: Verify OTP (6-digit code)
    ↓
Step 3: Pending Approval (wait for staff approval)
```

---

## Mock API Data for Testing

### Search User - Test Credentials

**Thai User:**
- ID Card: `1234567890123`
- Mobile: `0812345678`
- Customer Code: `CUST001`

**Foreign User:**
- ID Card/Passport: `P1234567`
- Mobile: `0898765432`

**OTP Verification:**
- Valid OTP: `123456`
- Any other code will fail

---

## API Endpoints (Mock Implementation)

All endpoints in [src/api/endpoint/register.ts](src/api/endpoint/register.ts) are currently mocked. Replace with actual endpoints when backend is ready:

### 1. Search User
```typescript
POST /api/user/search (or similar)
Request: { cardId?: string, mobileNumber?: string, custCode?: string }
Response: TSearchUserRes
```

### 2. Request OTP
```typescript
POST /api/otp/request (or similar)
Request: { msisdn: string }
Response: { status: 'success', token: string, refno: string }
```

### 3. Verify OTP
```typescript
POST /api/otp/verify (or similar)
Request: { token: string, pin: string }
Response: { status: 'success' }
```

### 4. Register User
```typescript
POST /api/register
Request: TRegisterReq
Response: TRegisterRes
```

### 5. Register Foreign User
```typescript
POST /api/foreign-register
Request: TForeignRegisterReq
Response: TRegisterRes (with approvalStatus: 'pending')
```

---

## Component Architecture

### RegisterForm (Main Orchestrator)
- Manages step progression
- Displays step indicator (1/3, 2/3, 3/3)
- Shows user type badge (Domestic/Foreign)
- Renders appropriate step component

### SearchUserStep
- Radio button selection for search method
- Dynamic form validation based on selected method
- React Hook Form for form management
- React Query mutation for API call

### OTPVerificationStep
- 6 individual input fields with auto-advance
- Paste support for quick OTP entry
- Countdown timer for resend (60 seconds)
- Automatic registration after OTP verification
- Different endpoints called based on user type

### SuccessStep
- Success icon and message
- Redirect to home button
- Shown for Thai users

### PendingApprovalStep
- Pending icon and message
- Information about approval process
- What happens next section
- Shown for foreign users

---

## State Management

### RegistrationContext

Provides:
```typescript
{
  currentStep: 'search' | 'otp' | 'success' | 'pending'
  formData: TRegistrationFormData
  setCurrentStep: (step) => void
  setFormData: (data) => void
  resetForm: () => void
}
```

### Form Data Structure
```typescript
{
  searchMethod: 'cardId' | 'mobileNumber' | 'custCode'
  searchValue: string
  userData?: TSearchUserRes
  otpToken?: string
  otpRefNo?: string
  otpCode?: string
  userType: 'thai' | 'foreign'
  isConsent: boolean
}
```

---

## Key Features

### 1. Smart OTP Input
- Auto-advance to next field on input
- Auto-backspace to previous field
- Paste support (auto-fills all 6 digits)
- Numeric-only validation
- Submit button enabled when complete

### 2. Step Indicator
- Visual progress (circles with connecting lines)
- Completed steps show checkmark
- Current step highlighted in red
- Step labels below

### 3. User Type Differentiation
- Badge showing "Domestic User" or "Foreign User"
- Different success flows
- Different API endpoints called

### 4. Form Validation
- Real-time validation with React Hook Form
- Pattern matching for ID cards, mobile numbers
- Required field validation
- Server-side validation for user search

---

## Integration with Existing System

### AuthContext Integration
```typescript
// OTPVerificationStep.tsx uses:
const { auth } = useAuthContext();
const lineUid = auth?.lineUid;

// Sent in registration payload
{
  lineUid: auth.lineUid,
  // ... other fields
}
```

### Styling
- Uses existing Tailwind CSS setup
- Uses existing `FormControl` compound component
- Uses existing `Button` component
- Consistent with app's design system

---

## Next Steps

### 1. Replace Mock APIs
Update [src/api/endpoint/register.ts](src/api/endpoint/register.ts) with actual endpoints:

```typescript
// Replace mock with:
export const searchUser = async (req: TSearchUserReq): Promise<TSearchUserRes> => {
  const { data } = await axiosClient.get<TSearchUserRes>('/api/user/search', { params: req });
  return data;
};
```

### 2. Update AuthContext After Registration
After successful registration, update the auth state:

```typescript
// In OTPVerificationStep.tsx, after registerMutation.onSuccess:
onSuccess: (data) => {
  // Update auth context with new user data
  // Then navigate to success/pending
}
```

### 3. Add Error Handling
- Network error handling
- Better error messages
- Retry logic for failed requests

### 4. Add Loading States
- Skeleton loaders during search
- Loading spinner during OTP verification
- Disable navigation during API calls

### 5. Analytics
- Track registration funnel
- Track drop-off points
- Success/failure rates

---

## Testing Checklist

### Thai User Registration
- [ ] Navigate to `/registration`
- [ ] Click "Register as Domestic User"
- [ ] Search by ID Card: `1234567890123`
- [ ] OTP screen appears with mobile number displayed
- [ ] Enter OTP: `123456`
- [ ] See success screen
- [ ] Click "Continue to Home"

### Foreign User Registration
- [ ] Navigate to `/registration`
- [ ] Click "Register as Foreign User"
- [ ] Search by Passport: `P1234567`
- [ ] OTP screen appears
- [ ] Enter OTP: `123456`
- [ ] See pending approval screen
- [ ] Note displays 1-2 business days message

### OTP Features
- [ ] Auto-advance between fields
- [ ] Backspace navigates to previous field
- [ ] Paste 6-digit code auto-fills all fields
- [ ] Resend OTP shows 60-second countdown
- [ ] Submit button disabled until 6 digits entered

### Validation
- [ ] Search with invalid ID card shows error
- [ ] Search with invalid mobile shows error
- [ ] Search with non-existent user shows error
- [ ] Invalid OTP shows error message

---

## Troubleshooting

### Issue: OTP not being sent
**Solution:** Check that `formData.userData.mobileNo` exists after search

### Issue: Registration fails
**Solution:** Check that `auth.lineUid` is available from AuthContext

### Issue: Step not progressing
**Solution:** Check console for errors, verify `setCurrentStep` is being called

### Issue: Form validation not working
**Solution:** Check React Hook Form rules, verify pattern regex

---

## Code Examples

### Adding a New Search Method

```typescript
// 1. Update type in src/types/register.ts
export type TSearchUserMethod = 'cardId' | 'mobileNumber' | 'custCode' | 'email';

// 2. Add radio button in SearchUserStep.tsx
<label className="flex items-center p-4 border rounded-lg ...">
  <input
    type="radio"
    value="email"
    checked={searchMethod === 'email'}
    onChange={(e) => setSearchMethod(e.target.value)}
  />
  <span>Email Address</span>
</label>

// 3. Update getPlaceholder, getLabel, getValidationPattern functions
```

### Customizing OTP Length

```typescript
// In OTPVerificationStep.tsx, change:
{[...Array(6)].map(...)}
// To:
{[...Array(4)].map(...)} // For 4-digit OTP

// In utils/otp.ts, update isOtpComplete:
return otpValue.length === 4 && /^\d{4}$/.test(otpValue);
```

---

## Dependencies Used

- `react-hook-form` - Form state management
- `@tanstack/react-query` - API state management
- `react-router-dom` - Routing
- Existing project components (Button, FormControl)

---

## Documentation Reference

See [REGISTRATION_AUTH_WORKFLOW.md](REGISTRATION_AUTH_WORKFLOW.md) for the original workflow specification from GoldLineCRM.FE.

---

**Implementation Date:** 2025-12-15
**Status:** ✅ Complete - Ready for backend integration
