export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  authProviders?: unknown[];
  socialAccounts?: unknown[];
  twoFactorAuth?: {
    isEnabled: boolean;
    backupCodes: unknown[];
  };
  activeSessions?: unknown[];
  loginCount?: number;
  failedLoginAttempts?: number;
  securitySettings?: {
    requireTwoFactor: boolean;
    allowSocialLogin: boolean;
    maxFailedAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    notifyOnNewLogin: boolean;
    notifyOnPasswordChange: boolean;
  };
  [key: string]: unknown;
}

