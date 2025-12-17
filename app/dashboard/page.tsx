"use client";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold text-primary-foreground mb-6">
        Welcome to Dashboard!
      </h2>
      {user && (
        <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full">
          <h3 className="text-xl font-semibold text-primary-foreground mb-4">
            User Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Name</p>
                <p className="font-medium text-primary-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Email</p>
                <p className="font-medium text-primary-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Role</p>
                <p className="font-medium text-primary-foreground">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">User ID</p>
                <p className="font-medium text-primary-foreground break-all">{user.id}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Tenant ID</p>
                <p className="font-medium text-primary-foreground break-all">{user.tenantId}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Email Verified</p>
                <p className="font-medium text-primary-foreground">
                  {user.isEmailVerified ? (
                    <span className="text-green-600 dark:text-green-400">Verified</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Not Verified</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Status</p>
                <p className="font-medium text-primary-foreground capitalize">{user.status}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground mb-1">Created At</p>
                <p className="font-medium text-primary-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
