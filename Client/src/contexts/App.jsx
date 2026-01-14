// import React, { createContext, useContext, useReducer, useEffect } from "react";
// import {
//   sampleUsers,
//   sampleCustomers,
//   sampleRooms,
//   sampleBookings,
//   sampleInvoices,
//   sampleMessages,
//   sampleTemplates,
//   sampleSettings,
// } from "@/data/sampleData";

// // Storage keys
// const STORAGE_KEY = "hotel_management_data";

// // Initial state
// const initialState = {
//   user: null,
//   customers: sampleCustomers,
//   rooms: sampleRooms,
//   bookings: sampleBookings,
//   invoices: sampleInvoices,
//   messages: sampleMessages,
//   templates: sampleTemplates,
//   users: sampleUsers,
//   settings: sampleSettings,
// };

// // Reducer
// function appReducer(state, action) {
//   switch (action.type) {
//     case "SET_USER":
//       return { ...state, user: action.payload };
//     case "SET_CUSTOMERS":
//       return { ...state, customers: action.payload };
//     case "ADD_CUSTOMER":
//       return { ...state, customers: [...state.customers, action.payload] };
//     case "UPDATE_CUSTOMER":
//       return {
//         ...state,
//         customers: state.customers.map((c) =>
//           c.id === action.payload.id ? action.payload : c
//         ),
//       };
//     case "DELETE_CUSTOMER":
//       return {
//         ...state,
//         customers: state.customers.filter((c) => c.id !== action.payload),
//       };
//     case "SET_ROOMS":
//       return { ...state, rooms: action.payload };
//     case "UPDATE_ROOM":
//       return {
//         ...state,
//         rooms: state.rooms.map((r) =>
//           r.id === action.payload.id ? action.payload : r
//         ),
//       };
//     case "ADD_ROOM":
//       return { ...state, rooms: [...state.rooms, action.payload] };
//     case "DELETE_ROOM":
//       return {
//         ...state,
//         rooms: state.rooms.filter((r) => r.id !== action.payload),
//       };
//     case "SET_BOOKINGS":
//       return { ...state, bookings: action.payload };
//     case "ADD_BOOKING":
//       return { ...state, bookings: [...state.bookings, action.payload] };
//     case "UPDATE_BOOKING":
//       return {
//         ...state,
//         bookings: state.bookings.map((b) =>
//           b.id === action.payload.id ? action.payload : b
//         ),
//       };
//     case "SET_INVOICES":
//       return { ...state, invoices: action.payload };
//     case "ADD_INVOICE":
//       return { ...state, invoices: [...state.invoices, action.payload] };
//     case "SET_MESSAGES":
//       return { ...state, messages: action.payload };
//     case "ADD_MESSAGE":
//       return { ...state, messages: [...state.messages, action.payload] };
//     case "SET_TEMPLATES":
//       return { ...state, templates: action.payload };
//     case "UPDATE_TEMPLATE":
//       return {
//         ...state,
//         templates: state.templates.map((t) =>
//           t.id === action.payload.id ? action.payload : t
//         ),
//       };
//     case "SET_USERS":
//       return { ...state, users: action.payload };
//     case "ADD_USER":
//       return { ...state, users: [...state.users, action.payload] };
//     case "UPDATE_USER":
//       return {
//         ...state,
//         users: state.users.map((u) =>
//           u.id === action.payload.id ? action.payload : u
//         ),
//       };
//     case "DELETE_USER":
//       return {
//         ...state,
//         users: state.users.filter((u) => u.id !== action.payload),
//       };
//     case "SET_SETTINGS":
//       return { ...state, settings: action.payload };
//     case "RESET_DATA":
//       localStorage.removeItem(STORAGE_KEY);
//       return { ...initialState, user: null };
//     case "LOAD_DATA":
//       return { ...action.payload };
//     default:
//       return state;
//   }
// }

// // Context
// const AppContext = createContext(undefined);

// // Provider
// export function AppProvider({ children }) {
//   const [state, dispatch] = useReducer(appReducer, initialState);

//   // Load data from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem(STORAGE_KEY);
//     if (savedData) {
//       try {
//         const parsed = JSON.parse(savedData);
//         dispatch({
//           type: "LOAD_DATA",
//           payload: { ...initialState, ...parsed, user: null },
//         });
//       } catch (error) {
//         console.error("Failed to parse saved data:", error);
//       }
//     }
//   }, []);

//   // Save data to localStorage whenever state changes (except user)
//   useEffect(() => {
//     const dataToSave = { ...state, user: null };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//   }, [
//     state.customers,
//     state.rooms,
//     state.bookings,
//     state.invoices,
//     state.messages,
//     state.templates,
//     state.users,
//     state.settings,
//   ]);

//   const login = (username, password) => {
//     const user = state.users.find(
//       (u) => u.username === username && u.password === password && u.isActive
//     );
//     if (user) {
//       dispatch({ type: "SET_USER", payload: user });
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     dispatch({ type: "SET_USER", payload: null });
//   };

//   const hasPermission = (permission) => {
//     if (!state.user) return false;

//     const permissions = {
//       admin: ["all"],
//       manager: [
//         "view_reports",
//         "manage_rooms",
//         "view_bookings",
//         "view_customers",
//         "view_billing",
//         "view_messages",
//       ],
//       receptionist: [
//         "manage_customers",
//         "manage_bookings",
//         "manage_checkin",
//         "manage_billing",
//         "send_messages",
//       ],
//     };

//     const userPermissions = permissions[state.user.role] || [];
//     return (
//       userPermissions.includes("all") || userPermissions.includes(permission)
//     );
//   };

//   return (
//     <AppContext.Provider
//       value={{ state, dispatch, login, logout, hasPermission }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// // Hook
// export function useApp() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useApp must be used within an ");
//   }
//   return context;
// }

// // Helper hooks
// export function useAuth() {
//   const { state, login, logout, hasPermission } = useApp();
//   return { user: state.user, login, logout, hasPermission };
// }

// export function useCustomers() {
//   const { state, dispatch } = useApp();
//   return {
//     customers: state.customers,
//     addCustomer: (customer) =>
//       dispatch({ type: "ADD_CUSTOMER", payload: customer }),
//     updateCustomer: (customer) =>
//       dispatch({ type: "UPDATE_CUSTOMER", payload: customer }),
//     deleteCustomer: (id) => dispatch({ type: "DELETE_CUSTOMER", payload: id }),
//   };
// }

// export function useRooms() {
//   const { state, dispatch } = useApp();
//   return {
//     rooms: state.rooms,
//     addRoom: (room) => dispatch({ type: "ADD_ROOM", payload: room }),
//     updateRoom: (room) => dispatch({ type: "UPDATE_ROOM", payload: room }),
//     deleteRoom: (id) => dispatch({ type: "DELETE_ROOM", payload: id }),
//   };
// }

// export function useBookings() {
//   const { state, dispatch } = useApp();
//   return {
//     bookings: state.bookings,
//     addBooking: (booking) =>
//       dispatch({ type: "ADD_BOOKING", payload: booking }),
//     updateBooking: (booking) =>
//       dispatch({ type: "UPDATE_BOOKING", payload: booking }),
//   };
// }

// export function useInvoices() {
//   const { state, dispatch } = useApp();
//   return {
//     invoices: state.invoices,
//     addInvoice: (invoice) =>
//       dispatch({ type: "ADD_INVOICE", payload: invoice }),
//   };
// }

// export function useMessages() {
//   const { state, dispatch } = useApp();
//   return {
//     messages: state.messages,
//     templates: state.templates,
//     addMessage: (message) =>
//       dispatch({ type: "ADD_MESSAGE", payload: message }),
//     updateTemplate: (template) =>
//       dispatch({ type: "UPDATE_TEMPLATE", payload: template }),
//   };
// }

// export function useSettings() {
//   const { state, dispatch } = useApp();
//   return {
//     settings: state.settings,
//     updateSettings: (settings) =>
//       dispatch({ type: "SET_SETTINGS", payload: settings }),
//   };
// }

// export function useUsers() {
//   const { state, dispatch } = useApp();
//   return {
//     users: state.users,
//     addUser: (user) => dispatch({ type: "ADD_USER", payload: user }),
//     updateUser: (user) => dispatch({ type: "UPDATE_USER", payload: user }),
//     deleteUser: (id) => dispatch({ type: "DELETE_USER", payload: id }),
//   };
// }

// export function useResetData() {
//   const { dispatch } = useApp();
//   return () => dispatch({ type: "RESET_DATA" });
// }
