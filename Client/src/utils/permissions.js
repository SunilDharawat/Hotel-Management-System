// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "dashboard.view",

  // Customers
  VIEW_CUSTOMERS: "customers.view",
  CREATE_CUSTOMER: "customers.create",
  EDIT_CUSTOMER: "customers.edit",
  DELETE_CUSTOMER: "customers.delete",

  // Rooms
  VIEW_ROOMS: "rooms.view",
  CREATE_ROOM: "rooms.create",
  EDIT_ROOM: "rooms.edit",
  DELETE_ROOM: "rooms.delete",

  // Bookings
  VIEW_BOOKINGS: "bookings.view",
  CREATE_BOOKING: "bookings.create",
  EDIT_BOOKING: "bookings.edit",
  DELETE_BOOKING: "bookings.delete",
  CHECKIN: "bookings.checkin",
  CHECKOUT: "bookings.checkout",

  // Invoices
  VIEW_INVOICES: "invoices.view",
  CREATE_INVOICE: "invoices.create",
  EDIT_INVOICE: "invoices.edit",

  // Payments
  VIEW_PAYMENTS: "payments.view",
  CREATE_PAYMENT: "payments.create",

  // Users
  VIEW_USERS: "users.view",
  CREATE_USER: "users.create",
  EDIT_USER: "users.edit",
  DELETE_USER: "users.delete",

  // Settings
  VIEW_SETTINGS: "settings.view",
  EDIT_SETTINGS: "settings.edit",

  // Reports
  VIEW_REPORTS: "reports.view",
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  admin: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],

  manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.EDIT_ROOM,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.EDIT_BOOKING,
    PERMISSIONS.CHECKIN,
    PERMISSIONS.CHECKOUT,
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.CREATE_PAYMENT,
    PERMISSIONS.VIEW_REPORTS,
  ],

  receptionist: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.EDIT_BOOKING,
    PERMISSIONS.CHECKIN,
    PERMISSIONS.CHECKOUT,
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.CREATE_PAYMENT,
  ],
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

// Check if user has any of the permissions
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

// Check if user has all permissions
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};
