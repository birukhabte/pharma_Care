const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Generic HTTP methods
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Set cookie for middleware
      document.cookie = `auth_token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    pharmacyName: string;
    role: string;
  }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Set cookie for middleware
      document.cookie = `auth_token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }
    return data;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Clear cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
  }

  // Medicines
  async getMedicines() {
    return this.request('/medicines');
  }

  async getMedicine(id: string) {
    return this.request(`/medicines/${id}`);
  }

  async createMedicine(medicine: any) {
    return this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    });
  }

  async updateMedicine(id: string, medicine: any) {
    return this.request(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    });
  }

  async patchMedicine(id: string, updates: any) {
    return this.request(`/medicines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteMedicine(id: string) {
    return this.request(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteMedicines(ids: string[]) {
    return this.request('/medicines', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request('/dashboard/metrics');
  }

  async getSalesTrend() {
    return this.request('/dashboard/sales-trend');
  }

  async getTopMedicines() {
    return this.request('/dashboard/top-medicines');
  }

  async getRecentSales() {
    return this.request('/dashboard/recent-sales');
  }

  async getExpiryAlerts() {
    return this.request('/dashboard/expiry-alerts');
  }

  // Customers
  async getCustomers() {
    const data = await this.request('/customers');
    return data.customers || []; // Extract customers array from response
  }

  async getCustomer(id: string) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customer: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: string, customer: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  async deleteCustomer(id: string) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getSuppliers() {
    return this.request('/suppliers');
  }

  async getSupplier(id: string) {
    return this.request(`/suppliers/${id}`);
  }

  async createSupplier(supplier: any) {
    return this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  async updateSupplier(id: string, supplier: any) {
    return this.request(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplier),
    });
  }

  async deleteSupplier(id: string) {
    return this.request(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Prescriptions
  async getPrescriptions() {
    return this.request('/prescriptions');
  }

  async getPrescription(id: string) {
    return this.request(`/prescriptions/${id}`);
  }

  async createPrescription(prescription: any) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    });
  }

  async updatePrescription(id: string, prescription: any) {
    return this.request('/prescriptions/${id}', {
      method: 'PUT',
      body: JSON.stringify(prescription),
    });
  }

  async deletePrescription(id: string) {
    return this.request(`/prescriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Products (Non-medicine inventory)
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getPendingOrders() {
    return this.request('/orders/pending');
  }

  async getOrders(filters?: { status?: string; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/orders?${params}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(order: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async completeOrder(id: string, payment: any) {
    return this.request(`/orders/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async getSalesAnalytics(filters?: { startDate?: string; endDate?: string; groupBy?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/orders/analytics?${params}`);
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  async createSampleOrders() {
    return this.request('/orders/create-sample-data', {
      method: 'POST',
    });
  }

  // Users
  async getUsers(filters?: { role?: string; status?: string; search?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/users?${params}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(user: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async updateUserPassword(id: string, password: string) {
    return this.request(`/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(params?: { read?: boolean; type?: string; category?: string; priority?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) queryParams.append('read', String(params.read));
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    const query = queryParams.toString();
    return this.request(`/notifications${query ? `?${query}` : ''}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAllReadNotifications() {
    return this.request('/notifications/read/all', {
      method: 'DELETE',
    });
  }

  async getNotificationStats() {
    return this.request('/notifications/stats');
  }
}

export const api = new ApiClient();
// Commit on 2024-06-24 at 9:57
// Commit on 2024-06-6 at 10:14
