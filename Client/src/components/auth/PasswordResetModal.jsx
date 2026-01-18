import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Key, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usersAPI } from "@/api/users";

export default function PasswordResetModal({ isOpen, onClose, user, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowSuccess(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to reset password
      await usersAPI.resetPassword(user.id, newPassword);

      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Reset password for <span className="font-semibold">{user.name}</span>
            <br />
            <span className="text-muted-foreground text-sm">
              Username: {user.username} • Role: {user.role}
            </span>
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-green-700">Password Reset Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The password has been updated successfully.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
              />
              {newPassword && (
                <div className="text-xs text-muted-foreground space-y-1 mt-1">
                  <div className={`flex items-center gap-1 ${newPassword.length >= 6 ? "text-green-600" : "text-muted-foreground"}`}>
                    {newPassword.length >= 6 ? "✓" : "○"} At least 6 characters
                  </div>
                  <div className={`flex items-center gap-1 ${/(?=.*[a-z])/.test(newPassword) ? "text-green-600" : "text-muted-foreground"}`}>
                    {/(?=.*[a-z])/.test(newPassword) ? "✓" : "○"} One lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${/(?=.*[A-Z])/.test(newPassword) ? "text-green-600" : "text-muted-foreground"}`}>
                    {/(?=.*[A-Z])/.test(newPassword) ? "✓" : "○"} One uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${/(?=.*\d)/.test(newPassword) ? "text-green-600" : "text-muted-foreground"}`}>
                    {/(?=.*\d)/.test(newPassword) ? "✓" : "○"} One number
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
              {confirmPassword && newPassword && (
                <div className={`text-xs ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}