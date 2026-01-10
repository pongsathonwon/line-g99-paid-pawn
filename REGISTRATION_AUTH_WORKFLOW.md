# Registration & Authentication Workflow Documentation

## Overview

This document describes the registration and authentication workflows for the GoldLine CRM Frontend application. The system integrates with LINE messaging platform and handles both new user registration and existing customer verification.

---

## Architecture Overview

This is a LINE-based CRM system with two primary user flows:
1. **New User Registration** - Creates new customers
2. **Existing User Verification** - Validates and links existing customers to LINE account

---

## Workflow Diagrams

### 1. New User Registration Flow

```
Home → Register → OTP → Welcome
  ↓       ↓        ↓       ↓
 Step1   Step2   Step3   Done
```

**Pages:**
- `/` - Home/Landing
- `/register` - Registration form (Step 2/3)
- `/auth-otp` - OTP verification (Step 3/3)
- `/welcome` - Success page

---

### 2. Existing User Authentication Flow

```
Home → Auth-User → Auth-Confirm → OTP → Welcome
  ↓       ↓            ↓          ↓       ↓
 Step1   Step2       Step2      Step3   Done
```

**Pages:**
- `/` - Home/Landing
- `/auth-user` - User lookup form (Step 2/3)
- `/auth-confirm` - Confirm user data (Step 2/3)
- `/auth-otp` - OTP verification (Step 3/3)
- `/welcome` - Success page

---

## State Management

### Redux Slice: RegisterSlice

**Location:** [src/features/RegisterSlice.js](src/features/RegisterSlice.js)

**Structure:**
```javascript
{
  id: 0,
  dataUser: {
    fullname: string,
    idCard: string,           // 13 digits
    birthDate: string,        // YYYY-MM-DD
    mobileNo: string,         // 10 digits
    isConsent: boolean,
    // Additional fields for existing users:
    custNo: string,
    branchCode: string,
    currentPoint: number,
    totalBuy: number,
    custStat: string,
    custType: string,
    nationCode: string,
    gender: string            // optional
  },
  currentPage: string,        // Current page identifier
  prevPage: string,           // Previous page for back navigation
  dataFrom: "HUG_exist" | "HUG_update" | null
}
```

**Actions:**
- `setRegister(payload)` - Merge payload into state
- `resetRegister()` - Reset to default values

---

## Page Components

### 1. Register Page

**Location:** [src/pages/account/register/index.js](src/pages/account/register/index.js)

**Purpose:** New user registration form

**Form Fields:**
- **Full Name** - Thai characters only
- **ID Card** - 13 digits, validated for uniqueness in real-time
- **Birth Date** - Date picker
- **Mobile Number** - Format: XXX-XXX-XXXX
- **Consent Checkbox** - PDPA compliance (required)

**Key Features:**
- Real-time ID card validation via `SearchCust` API
- Client-side form validation using `react-hook-form`
- Prevents duplicate registrations
- Auto-save form data when navigating to privacy policy

**Validation:**
```javascript
// ID Card - 13 digits, unique
pattern: /^\d{13}$/
handleCheckIdCardExists(idCard) // Server-side check

// Mobile Number - formatted
pattern: /^\d{3}-\d{3}-\d{4}$/

// Full Name - Thai characters
onInput: Helper.FNFORM.handleCharOnly

// Birth Date - required date
type: "date"

// Consent - required boolean
required: true
```

**API Calls:**
- `SearchCust({ q: "register", idCard })` - Check if ID exists (returns 20200 if exists)

**Navigation:**
- Back → `/` (home)
- Next → `/auth-otp` (on successful validation)

**Libraries Used:**
- `react-hook-form` - Form state management and validation
- `react-number-format` (PatternFormat) - Mobile number formatting
- `react-redux` - Global state management
- `react-helmet` - SEO meta tags

---

### 2. Auth User Page

**Location:** [src/pages/account/auth/index.js](src/pages/account/auth/index.js)

**Purpose:** Validate existing customers

**Form Fields:**
- **ID Card** - 13 digits (required)
- **Verification Method** (radio selection):
  - Mobile Number (XXX-XXX-XXXX), OR
  - Birth Date (YYYY-MM-DD)

**Key Features:**
- Radio button toggles between phone/birthdate verification
- Dynamic field visibility based on selection
- Searches existing customer database
- Determines `dataFrom` status for different user scenarios

**Validation:**
```javascript
// ID Card
pattern: /^\d{13}$/
required: true

// Mobile Number - conditional
required: searchType === "phonenumber"
pattern: /^\d{3}-\d{3}-\d{4}$/

// Birth Date - conditional
required: searchType === "birthday"
```

**API Calls:**
```javascript
SearchCust({
  q: "verify",
  idCard: string,
  mobileNo?: string,  // OR
  birthDate?: string
})
```

**Response Handling:**
```javascript
// Success (resultCode: 20200)
{
  fullname: string,
  idCard: string,
  birthDate: string,
  mobileNo: string,
  custNo: string,
  branchCode: string,
  currentPoint: number,
  totalBuy: number,
  custStat: string,
  custType: string,
  nationCode: string,
  gender?: string,
  dataFrom: "HUG_exist" | "HUG_update" | null
}

// Error (resultCode: 40401)
{
  resultError: {
    code: "idCard_notfound" | "birthDate_notfound" | "mobileNo_notfound"
  }
}
```

**Navigation:**
- Back → `/` (home)
- Next → `/auth-confirm` (on successful customer lookup)

**Libraries Used:**
- `react-hook-form` - Form validation
- `react-number-format` - Mobile formatting
- `react-redux` - State management
- `react-router-dom` - Navigation

---

### 3. Auth Confirm Page

**Location:** [src/pages/account/auth/confirm.js](src/pages/account/auth/confirm.js)

**Purpose:** Review and confirm user data before OTP verification

**Display Fields (Read-only):**
- Full Name
- ID Card
- Birth Date (formatted as DD/MM/YYYY)
- Mobile Number (formatted as XXX-XXX-XXXX)

**Interactive Field:**
- **Consent Checkbox** - Fresh PDPA consent required for LINE integration

**Key Features:**
- All data displayed is from Redux state (retrieved in Auth User page)
- Hidden form fields maintain data structure
- User must provide fresh consent even if they're an existing customer
- Remark message about OTP being sent to the displayed mobile number

**Form Structure:**
```javascript
// Hidden fields (maintain data)
<input type="hidden" name="fullname" value={dataUser.fullname} />
<input type="hidden" name="idCard" value={dataUser.idCard} />
<input type="hidden" name="birthDate" value={dataUser.birthDate} />
<input type="hidden" name="mobileNo" value={dataUser.mobileNo} />

// Visible field
<input type="checkbox" name="isConsent" required />
```

**Validation:**
- `isConsent` must be true to enable submit button

**Navigation:**
- Back → `/auth-user` (return to search)
- Next → `/auth-otp` (proceed to verification)

**Libraries Used:**
- `react-hook-form` - Form handling
- `react-redux` - State access
- `react-router-dom` - Navigation

---

### 4. OTP Page

**Location:** [src/pages/account/auth/otp.js](src/pages/account/auth/otp.js)

**Purpose:** Mobile number verification via SMS OTP

**Features:**
- 6-digit OTP input with auto-advance between fields
- Paste support for OTP codes (auto-fills all 6 digits)
- Backspace navigation to previous field
- Resend OTP functionality
- Real-time submit button enable/disable based on 6-digit completion

**OTP Input Behavior:**
- Numeric only (validates `isNaN`)
- Auto-focus next field on input
- Auto-focus previous field on backspace/delete
- Paste detection - fills all 6 fields at once

**Workflow:**

#### Step 1: Request OTP (on component mount)
```javascript
postOtpRequest({ msisdn: mobileNo })
// Response:
{
  status: "success",
  token: string,    // OTP session token
  refno: string     // Reference number for user
}
```

#### Step 2: Verify OTP (on form submit)
```javascript
postOtpVerify({
  token: otpToken,  // From step 1
  pin: otpCode      // 6-digit user input
})
// Success Response:
{
  status: "success"
}
// Error Response:
{
  resultCode: 40400,
  resultError: {
    code: "otp_invalid" | "otp_expired"
  }
}
```

#### Step 3: Process User Registration/Update

**For Existing Users (prevPage === "auth-confirm"):**

```javascript
switch(dataFrom) {
  case "HUG_exist":
    // Customer exists in HUG system but not in CRM
    // Action: Register to CRM system
    payload = {
      ...dataUser,
      isVerified: true,
      lineUid: stateProfile.lineUid,
      dataFrom: "HUG_exist"
    };
    postRegisterCust(payload)
      .then(() => genAccessToken({ lineUid }))
      .then((token) => saveAccessToken(token));
    break;

  case "HUG_update":
    // Customer exists in CRM, updating with LINE info
    // Action: Update existing record
    payload = {
      fullname, idCard, birthDate, mobileNo,
      isVerified: true,
      lineUid: stateProfile.lineUid
      // Remove: branchCode, currentPoint, custNo, custStat, etc.
    };
    postUpdateCust(payload)
      .then(() => genAccessToken({ lineUid }))
      .then((token) => saveAccessToken(token));
    break;

  default:
    // Standard customer update
    postUpdateCust(payload)
      .then(() => genAccessToken({ lineUid }))
      .then((token) => saveAccessToken(token));
    break;
}
```

**For New Users (prevPage === "register"):**

```javascript
// New user registration with default values
payload = {
  ...dataUser,
  isVerified: true,
  lineUid: stateProfile.lineUid,
  dataFrom: null,
  // Default values for new customers:
  custType: "G",        // Guest/General
  nationCode: "1",      // Thai nationality
  branchCode: "30",     // Default branch
  currentPoint: 0,
  totalBuy: 0
};

postRegisterCust(payload)
  .then(() => genAccessToken({ lineUid }))
  .then((token) => saveAccessToken(token));
```

#### Step 4: Generate and Save Access Token

```javascript
genAccessToken({ lineUid: stateProfile.lineUid })
// Response:
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // JWT token
}

// Save token
saveAccessToken(token, dispatch, setProfile, lineUid)
  → localStorage.setItem("token", token)
  → dispatch(setProfile({ lineUid }))
```

#### Step 5: Navigate to Welcome Page

```javascript
useEffect(() => {
  if (jwToken !== null) {
    navigate("/welcome");
  }
}, [jwToken]);
```

**Error Handling:**
- OTP invalid → Display inline error message
- OTP expired → Display inline error message
- Submit button disabled during processing

**API Calls:**
- `OtpRequest` - Request OTP code
- `OtpVerify` - Validate OTP code
- `RegisterCust` - Create new customer (resultCode: 20201)
- `UpdateCust` - Update existing customer (resultCode: 20200)
- `AccessToken` - Generate JWT token (resultCode: 20200)

**Utility Functions** ([otp.utils.js](src/pages/account/auth/otp.utils.js)):
- `handlePasteOtp(e)` - Auto-fill OTP from clipboard
- `handleInputOtp(e, callback)` - Validate numeric input, auto-advance
- `handleKeyupOtp(e)` - Backspace/delete navigation
- `getOtpValue()` - Concatenate all 6 digits
- `toggleSubmitButton(disabled)` - Enable/disable submit
- `displayOtpError(message)` - Show inline error
- `clearOtpError()` - Clear inline error

**API Functions** ([otp.api.js](src/pages/account/auth/otp.api.js)):
- `postOtpRequest(payload, t, modalAlert)` - Request OTP
- `postOtpVerify(payload, t, modalAlert)` - Verify OTP
- `postUpdateCust(payload, t, modalAlert)` - Update customer
- `genAccessToken(payload)` - Generate JWT
- `postRegisterCust(payload, t, modalAlert)` - Register new customer
- `saveAccessToken(token, dispatch, setProfile, lineUid)` - Save to localStorage and Redux

**Navigation:**
- Back → `/register` or `/auth-user` (based on prevPage)
- Next → `/welcome` (auto-navigate when token is set)

**Libraries Used:**
- `react-hook-form` - Form handling (minimal usage here)
- `react-redux` - State management
- Custom utilities - OTP input handling
- Custom API wrappers - Backend communication

---

## API Endpoints

**Location:** [src/services/Api/Module/Customer.js](src/services/Api/Module/Customer.js)

### Authentication & Registration

| Endpoint | Method | Purpose | Payload | Success Response |
|----------|--------|---------|---------|------------------|
| `/api/sb/v1/customer` | GET | Search customer | `{ q: "register"\|"verify", idCard, birthDate?, mobileNo? }` | `{ resultCode: 20200, body: CustomerData }` or `{ resultCode: 40401 }` |
| `/api/sb/v1/tbs/otp_request` | POST | Request OTP | `{ msisdn: string }` | `{ resultCode: 20200, body: { status, token, refno } }` |
| `/api/sb/v1/tbs/otp_verify` | POST | Verify OTP | `{ token: string, pin: string }` | `{ resultCode: 20200, body: { status: "success" } }` |
| `/api/sb/v1/customer/create` | POST | Register customer | UserData + Defaults | `{ resultCode: 20201, body: CustomerRecord }` |
| `/api/sb/v1/customer/update` | POST | Update customer | UserData | `{ resultCode: 20200, body: UpdatedRecord }` |
| `/api/sb/v1/customer/access_token/:lineUid` | POST | Generate JWT | LINE UID in URL | `{ resultCode: 20200, body: { token } }` |

### Profile & Data (Requires JWT)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/sb/v1/customer/profile` | GET | Get user profile | Yes (JWT) |
| `/api/sb/v1/transaction` | GET | Get transactions | Yes (JWT) |
| `/api/sb/v1/customer/coupons` | GET | Get user coupons | Yes (JWT) |
| `/api/sb/v1/customer/coupon/history` | GET | Coupon history | Yes (JWT) |
| `/api/sb/v1/customer/coupon/create` | POST | Create coupon | Yes (JWT) |

---

## Data Flow Interfaces

### Interface: RegisterNewUser

```typescript
interface RegisterNewUserPayload {
  // Form inputs
  fullname: string;          // Thai characters only
  idCard: string;            // 13 digits, unique
  birthDate: string;         // YYYY-MM-DD
  mobileNo: string;          // 10 digits (0812345678)
  isConsent: boolean;        // PDPA consent

  // Added during OTP flow
  isVerified: boolean;       // Set to true after OTP verification
  lineUid: string;           // From LINE authentication/profile state
  dataFrom: null;            // Always null for new users

  // Default values for new users
  custType: "G";             // Guest/General customer type
  nationCode: "1";           // Thai nationality code
  branchCode: "30";          // Default branch
  currentPoint: 0;           // Initial loyalty points
  totalBuy: 0;               // Initial purchase total
}
```

**API Call:**
```javascript
POST /api/sb/v1/customer/create
Response: { resultCode: 20201, body: CustomerRecord }
```

---

### Interface: ValidateExistingUser

```typescript
interface ValidateExistingUserSearch {
  // Input - Search criteria
  q: "verify";
  idCard: string;            // 13 digits (required)
  mobileNo?: string;         // 10 digits (optional, OR birthDate)
  birthDate?: string;        // YYYY-MM-DD (optional, OR mobileNo)
}

interface ValidateExistingUserResponse {
  // Response from SearchCust API (resultCode: 20200)
  fullname: string;
  idCard: string;
  birthDate: string;         // YYYY-MM-DD
  mobileNo: string;          // 10 digits
  custNo: string;            // Existing customer number
  branchCode: string;        // Customer's branch
  currentPoint: number;      // Loyalty points
  totalBuy: number;          // Total purchases
  custStat: string;          // Customer status
  custType: string;          // Customer type
  nationCode: string;        // Nationality code
  gender?: string;           // Optional gender
  dataFrom: "HUG_exist" | "HUG_update" | null;
}

interface ValidateExistingUserUpdate {
  // Payload sent after OTP verification
  fullname: string;
  idCard: string;
  birthDate: string;
  mobileNo: string;
  isConsent: boolean;        // Fresh consent required
  isVerified: boolean;       // Set to true after OTP
  lineUid: string;           // Link to LINE account

  // Include for HUG_exist (register):
  custNo?: string;
  branchCode?: string;
  currentPoint?: number;
  totalBuy?: number;
  custStat?: string;
  custType?: string;
  nationCode?: string;
  gender?: string;
  dataFrom: "HUG_exist";

  // Exclude for HUG_update (update):
  // Do NOT include: branchCode, currentPoint, custNo, custStat, custType, nationCode, totalBuy
}
```

**API Calls:**
```javascript
// Search
GET /api/sb/v1/customer?q=verify&idCard=xxx&mobileNo=xxx
Response: { resultCode: 20200, body: ValidateExistingUserResponse }

// Update (HUG_update or default)
POST /api/sb/v1/customer/update
Response: { resultCode: 20200, body: UpdatedRecord }

// Register (HUG_exist)
POST /api/sb/v1/customer/create
Response: { resultCode: 20201, body: CustomerRecord }
```

---

### Interface: AccessTokenContext

```typescript
interface AccessTokenRequest {
  lineUid: string;           // LINE user ID
}

interface AccessTokenResponse {
  token: string;             // JWT access token
}

// Token Storage:
// 1. localStorage: localStorage.setItem("token", token)
// 2. Redux state: profile.lineUid = lineUid

// Token Usage:
// - Included in Authorization header for authenticated endpoints
// - Used to retrieve user profile, transactions, coupons
// - Persists user session across page reloads
```

**API Call:**
```javascript
POST /api/sb/v1/customer/access_token/:lineUid
Response: { resultCode: 20200, body: { token: "eyJ..." } }
```

**Token Lifecycle:**
```javascript
// 1. Generate after successful OTP verification
genAccessToken({ lineUid })

// 2. Save to localStorage and Redux
saveAccessToken(token, dispatch, setProfile, lineUid)
  → localStorage.setItem("token", token)
  → dispatch(setProfile({ lineUid }))

// 3. Use in API calls (handled by API config)
// 4. Check on app load to maintain session
// 5. Clear on logout
```

---

## Security & Validation

### Client-Side Validation

**ID Card:**
- Pattern: `/^\d{13}$/` (exactly 13 digits)
- Type: Numeric only (`Helper.FNFORM.handleNumberOnly`)
- Uniqueness: Real-time server check on registration
- Existence: Server check on authentication

**Mobile Number:**
- Pattern: `/^\d{3}-\d{3}-\d{4}$/` (formatted)
- Storage: 10 digits without dashes
- Display: XXX-XXX-XXXX format
- Library: `react-number-format` (PatternFormat)

**Birth Date:**
- Type: HTML5 date input
- Format: YYYY-MM-DD (internal)
- Display: DD/MM/YYYY (converted with `convertDateFormat`)

**Full Name:**
- Type: Thai characters only
- Filter: `Helper.FNFORM.handleCharOnly`
- Required: Non-empty string

**Consent:**
- Type: Boolean (checkbox)
- Required: Must be true to proceed
- Fresh: Required even for existing users on auth flow

---

### Server-Side Validation

**OTP Verification:**
- Expiration: Time-limited OTP codes
- Attempts: Limited verification attempts
- Token: Session-based OTP tokens

**Customer Validation:**
- Existence: Customer lookup by ID + phone/birthdate
- Duplicate: Prevention on registration
- LINE UID: Uniqueness per account

**Data Integrity:**
- Required fields validation
- Format validation (phone, ID card, etc.)
- Business rules enforcement

---

### Authentication Flow

```
1. User Input
   ↓
2. Form Validation (react-hook-form)
   ↓
3. OTP Request (SMS sent to mobile)
   ↓
4. OTP Verification (user enters 6-digit code)
   ↓
5. Customer Registration/Update
   ↓
6. JWT Token Generation (with LINE UID)
   ↓
7. Token Storage
   ├→ localStorage.setItem("token", jwt)
   └→ Redux: setProfile({ lineUid })
   ↓
8. Authenticated Session
   └→ All subsequent API calls include JWT
```

**Session Persistence:**
- Token stored in localStorage (survives page reload)
- Redux state hydrated from localStorage on app load
- Auto-redirect to profile if already authenticated

**Security Measures:**
- OTP verification proves mobile number ownership
- JWT token scoped to LINE UID
- HTTPS communication (assumed)
- PDPA consent tracking
- No password storage (LINE OAuth-based)

---

## Key Differences: New vs Existing Users

| Aspect | New User (Register) | Existing User (Auth) |
|--------|---------------------|----------------------|
| **Entry Point** | `/register` | `/auth-user` |
| **Pages** | 3 pages | 4 pages (includes confirm) |
| **ID Card Check** | Must NOT exist | Must exist |
| **Data Source** | Manual form input | Database lookup + confirmation |
| **Verification** | ID + Phone only | ID + (Phone OR Birthdate) |
| **Steps** | Register → OTP → Welcome | Auth → Confirm → OTP → Welcome |
| **API Call (Final)** | `POST /customer/create` | `POST /customer/update` or `/customer/create` (HUG_exist) |
| **dataFrom** | `null` | `"HUG_exist"` or `"HUG_update"` |
| **Default Values** | Set: custType="G", nationCode="1", branchCode="30" | Use existing values |
| **Form Editing** | All fields editable | Read-only display, consent only |
| **Consent** | Required on registration | Required fresh consent on confirm |
| **Customer Number** | Generated by system | Already exists |
| **Points/Purchase** | Start at 0 | Preserve existing values |

---

## Libraries & Dependencies

### Core React Libraries

**react-hook-form** (`^7.x`)
- **Used in:** All form pages (register, auth, auth-confirm, otp)
- **Purpose:** Form state management, validation, error handling
- **Key Features Used:**
  - `useForm` hook for form control
  - `Controller` component for controlled inputs
  - Field validation (required, pattern, custom)
  - Error state management
  - `watch`, `setValue`, `getValues`, `getFieldState` methods
- **Benefits:**
  - Minimal re-renders
  - Built-in validation
  - Easy integration with UI libraries

**Example Usage:**
```javascript
const {
  control,
  handleSubmit,
  formState: { errors, isValid },
  setValue,
  watch
} = useForm({
  defaultValues: {
    idCard: "",
    mobileNo: ""
  }
});

<Controller
  name="idCard"
  control={control}
  rules={{
    required: "ID Card is required",
    pattern: {
      value: /^\d{13}$/,
      message: "Must be 13 digits"
    }
  }}
  render={({ field }) => <input {...field} />}
/>
```

---

### Formatting Libraries

**react-number-format** (`^5.x`)
- **Used in:** Register, Auth pages
- **Component:** `PatternFormat`
- **Purpose:** Format mobile number input (XXX-XXX-XXXX)
- **Features:**
  - Auto-formatting on input
  - Pattern mask support
  - Unformatted value extraction

**Example Usage:**
```javascript
import { PatternFormat } from "react-number-format";

<PatternFormat
  name="mobileNo"
  value={value}
  onChange={onChange}
  displayType="input"
  format="###-###-####"
  placeholder="081-234-5678"
/>
```

---

### State Management

**react-redux** (`^8.x`)
- **Used in:** All pages
- **Purpose:** Global state management
- **Slices:**
  - `RegisterSlice` - Registration/auth flow state
  - `ProfileSlice` - User profile state
- **Hooks:**
  - `useSelector` - Access state
  - `useDispatch` - Dispatch actions

**@reduxjs/toolkit** (`^1.x`)
- **Used in:** RegisterSlice, ProfileSlice
- **Purpose:** Redux store configuration
- **Features:**
  - `createSlice` - Simplified reducer creation
  - Immer integration for immutable updates

**Example Usage:**
```javascript
import { useSelector, useDispatch } from "react-redux";
import { setRegister } from "../../../features/RegisterSlice";

const stateRegister = useSelector((state) => state.register);
const dispatch = useDispatch();

dispatch(setRegister({
  dataUser: { fullname, idCard, birthDate, mobileNo }
}));
```

---

### Routing

**react-router-dom** (`^6.x`)
- **Used in:** All pages
- **Purpose:** Client-side routing
- **Hooks:**
  - `useNavigate` - Programmatic navigation
  - `Link` - Declarative navigation
- **Features:**
  - Page navigation with state preservation
  - Protected routes (authenticated checks)

**Example Usage:**
```javascript
import { useNavigate, Link } from "react-router-dom";

const navigate = useNavigate();
navigate("/auth-otp");

<Link to="/privacy-policy">Privacy Policy</Link>
```

---

### SEO & Meta Tags

**react-helmet** (`^6.x`)
- **Used in:** All pages
- **Purpose:** Dynamic meta tags and SEO
- **Features:**
  - Title management
  - OG tags for social sharing
  - Meta descriptions

**Example Usage:**
```javascript
import { Helmet } from "react-helmet";

<Helmet>
  <title>ห้างเพชรทองโกลด์เด้น 99 จำกัด</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
</Helmet>
```

---

### Context API

**React Context** (`react` built-in)
- **Used in:** OTP, Auth pages
- **Context:** `ModalContext`
- **Purpose:** Modal alert management
- **Features:**
  - Global modal state
  - Alert messages (info, success, error)

**Example Usage:**
```javascript
import ModalContext from "contexts/ModalContext";

const { modalAlert } = useContext(ModalContext);

modalAlert.info({
  open: true,
  title: "Error",
  subTitle: "Invalid OTP",
  content: "Please try again"
});
```

---

### Utility Libraries

**Custom Helpers** (`services/helper`)
- **Used in:** All pages
- **Functions:**
  - `convertMobileNoFormat(mobile, separator)` - Format mobile numbers
  - `convertDateFormat(date, format)` - Format dates
  - `checkIdCardFormat(idCard)` - Validate ID card
  - `breakKeyDownEnter(e)` - Prevent form submit on Enter
  - `Helper.FNFORM.handleCharOnly` - Thai characters only filter
  - `Helper.FNFORM.handleNumberOnly` - Numeric input filter

**Example Usage:**
```javascript
import Helper, {
  convertMobileNoFormat,
  convertDateFormat,
  checkIdCardFormat
} from "services/helper";

// Format: 0812345678 → 081-234-5678
const formatted = convertMobileNoFormat("0812345678", "-");

// Format: 2024-01-15 → 15/01/2024
const displayDate = convertDateFormat("2024-01-15", "d/m/y");

// Validate ID card format
const isValid = checkIdCardFormat("1234567890123");

// Input filters
<input
  onInput={Helper.FNFORM.handleNumberOnly}  // Only numbers
  onInput={Helper.FNFORM.handleCharOnly}    // Only Thai chars
/>
```

---

### API Client

**Custom API Wrapper** (`services/Api`)
- **Used in:** All API calls
- **Functions:**
  - `get({ url, params })` - GET requests
  - `post({ url, data, timeOut })` - POST requests
- **Features:**
  - Centralized error handling
  - Timeout configuration
  - JWT token injection (from localStorage)
  - Base URL configuration

**Example Usage:**
```javascript
import { get, post } from "services/Api/Config";

// GET request
const { data } = await get({
  url: `/api/sb/v1/customer`,
  params: { q: "verify", idCard: "xxx" }
});

// POST request
const { data } = await post({
  url: `/api/sb/v1/customer/create`,
  data: payload,
  timeOut: 20000
});
```

---

### Internationalization

**Custom i18n** (`i18n/useTranslations`)
- **Used in:** All pages
- **Purpose:** Multi-language support (Thai/English)
- **Hook:** `useTranslations()`
- **Features:**
  - Translation object per page
  - Dynamic language switching
  - Nested translation keys

**Example Usage:**
```javascript
import useTranslations from "../../../i18n/useTranslations";

const { t } = useTranslations();

<h2>{t.registerPage.headTitle}</h2>
<p>{t.formField.fullname.label}</p>
<span>{t.formField.idCard.validate.required}</span>
```

---

## Summary of Library Responsibilities

| Library | Responsibility | Why It's Used |
|---------|---------------|---------------|
| **react-hook-form** | Form state, validation | Reduces boilerplate, optimized re-renders |
| **react-number-format** | Input formatting | Automatic phone number formatting |
| **react-redux** | Global state | Share data across pages (registration flow) |
| **@reduxjs/toolkit** | Redux setup | Simplified Redux configuration |
| **react-router-dom** | Routing | Multi-page navigation |
| **react-helmet** | SEO/Meta tags | Dynamic page titles and OG tags |
| **React Context** | Modal management | Global modal alerts without prop drilling |
| **Custom helpers** | Utilities | Reusable validation and formatting functions |
| **Custom API client** | HTTP requests | Centralized API communication with auth |
| **Custom i18n** | Translations | Multi-language support |

---

## Notes & Best Practices

### Form Validation Strategy

1. **Client-side first** - Immediate feedback using `react-hook-form`
2. **Real-time validation** - ID card uniqueness checked on input
3. **Server-side confirmation** - OTP verification ensures authenticity
4. **Progressive disclosure** - Show errors only after user interaction

### State Management Strategy

1. **Redux for cross-page data** - Registration flow spans multiple pages
2. **Local state for UI** - Form state managed by `react-hook-form`
3. **Context for modals** - Global alert system
4. **localStorage for persistence** - JWT token survives reload

### Security Considerations

1. **No sensitive data in Redux** - Only store non-sensitive user info
2. **JWT in localStorage** - Standard web app pattern (consider httpOnly cookies for production)
3. **OTP verification** - Proves phone ownership
4. **PDPA compliance** - Explicit consent tracking
5. **LINE OAuth** - No password management required

### Code Organization

1. **Separation of concerns** - API logic in `otp.api.js`, utilities in `otp.utils.js`
2. **Reusable helpers** - Centralized formatting and validation
3. **Consistent patterns** - All pages follow similar structure
4. **Type safety** - Consider migrating to TypeScript for better type checking

### UX Enhancements

1. **Auto-advance OTP** - Smooth 6-digit input experience
2. **Paste support** - Quick OTP entry from SMS
3. **Loading states** - Disable submit during API calls
4. **Error recovery** - Clear error messages with retry options
5. **Progressive steps** - Clear 1/3, 2/3, 3/3 indicators

---

## Future Improvements

1. **TypeScript Migration** - Add type safety across the codebase
2. **Error Boundary** - Catch and handle runtime errors gracefully
3. **Analytics** - Track conversion funnel (registration completion rate)
4. **A/B Testing** - Test different registration flows
5. **Accessibility** - ARIA labels, keyboard navigation, screen reader support
6. **Performance** - Code splitting, lazy loading, image optimization
7. **Testing** - Unit tests (Jest), integration tests (React Testing Library), E2E (Playwright)
8. **Validation Enhancement** - Add ID card checksum validation algorithm
9. **Rate Limiting** - Client-side OTP request throttling
10. **Session Management** - Token refresh mechanism, auto-logout on expiry

---

## Troubleshooting

### Common Issues

**Issue: Form not submitting**
- Check: All required fields filled
- Check: Validation errors in `formState.errors`
- Check: `isValid` state from `react-hook-form`

**Issue: OTP not received**
- Check: Mobile number format (10 digits)
- Check: Network connectivity
- Use: "Resend OTP" functionality

**Issue: "ID Card already exists"**
- Resolution: Use authentication flow instead of registration
- Path: Home → Auth User (existing customer flow)

**Issue: Token not persisting**
- Check: localStorage available (not in incognito mode)
- Check: Browser localStorage quota
- Check: Token save function called after successful OTP

**Issue: Navigation not working**
- Check: Redux state `currentPage` and `prevPage`
- Check: `dataUser` object populated
- Check: Protected route logic (authenticated users shouldn't access register)

---

## Contact & Support

For questions or issues with this workflow, please refer to:
- Project repository documentation
- API documentation (backend team)
- UX/UI design specifications
- LINE Platform integration guide

---

**Document Version:** 1.0
**Last Updated:** 2025-12-15
**Maintained By:** Development Team
