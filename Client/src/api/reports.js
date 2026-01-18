import api from './axios';

export const reportsAPI = {
  // Occupancy Reports
  getOccupancyReport: (params) => api.get('/reports/occupancy', { params }),
  exportOccupancyReport: (params) => {
    return api.get('/reports/occupancy/export', { 
      params, 
      responseType: 'blob' 
    });
  },

  // Revenue Reports
  getRevenueReport: (params) => api.get('/reports/revenue', { params }),
  exportRevenueReport: (params) => {
    return api.get('/reports/revenue/export', { 
      params, 
      responseType: 'blob' 
    });
  },

  // Booking Reports
  getBookingReport: (params) => api.get('/reports/bookings', { params }),

  // Customer Reports
  getCustomerReport: (params) => api.get('/reports/customers', { params }),
};

// Helper function to download Excel files
export const downloadExcelFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};