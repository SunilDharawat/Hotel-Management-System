import { useAuth } from "@/contexts/AppContext";

export default function PermissionGuard({
  permission,
  fallback = null,
  children,
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}
