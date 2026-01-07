module.exports = {
  USER_ROLES: {
    ADMIN: "admin",
    MANAGER: "manager",
    RECEPTIONIST: "receptionist",
  },

  BOOKING_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CHECKED_IN: "checked_in",
    CHECKED_OUT: "checked_out",
    CANCELLED: "cancelled",
  },

  ROOM_STATUS: {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    MAINTENANCE: "maintenance",
    RESERVED: "reserved",
    CLEANING: "cleaning",
  },

  PAYMENT_STATUS: {
    PAID: "paid",
    PENDING: "pending",
    PARTIAL: "partial",
    REFUNDED: "refunded",
  },

  PAYMENT_METHODS: {
    CASH: "cash",
    UPI: "upi",
    CREDIT_CARD: "credit_card",
    DEBIT_CARD: "debit_card",
    NET_BANKING: "net_banking",
  },

  INVOICE_PREFIX: "INV",
  BOOKING_PREFIX: "BKG",
  PAYMENT_PREFIX: "PAY",
};
