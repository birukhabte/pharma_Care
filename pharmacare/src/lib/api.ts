const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
}

export const api = new ApiClient();
