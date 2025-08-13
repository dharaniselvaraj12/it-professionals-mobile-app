import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your PHP backend API
const BASE_URL = 'https://itprofessionals.dharaniselvaraj.com/itpro/public';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token if available
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage and redirect to login
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    expertise?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/register_working.php', userData);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/login_working.php', credentials);
  }

  // User endpoints
  async getUsers(): Promise<AxiosResponse> {
    return this.api.get('/users_working.php');
  }

  async getUserById(userId: string): Promise<AxiosResponse> {
    return this.api.get(`/users_working.php?id=${userId}`);
  }

  async updateUser(userData: any): Promise<AxiosResponse> {
    return this.api.put('/users_working.php', userData);
  }

  // Posts endpoints
  async getPosts(): Promise<AxiosResponse> {
    return this.api.get('/posts_working.php');
  }

  async createPost(postData: {
    content: string;
    image_url?: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/posts_working.php', postData);
  }

  async updatePost(postId: string, postData: any): Promise<AxiosResponse> {
    return this.api.put('/posts_working.php', { id: postId, ...postData });
  }

  async deletePost(postId: string): Promise<AxiosResponse> {
    return this.api.delete(`/posts_working.php?id=${postId}`);
  }

  // Connections endpoints
  async getConnections(): Promise<AxiosResponse> {
    return this.api.get('/connections_working.php');
  }

  async sendConnectionRequest(targetUserId: string): Promise<AxiosResponse> {
    return this.api.post('/connections_working.php', {
      target_user_id: targetUserId,
    });
  }

  async respondToConnection(
    connectionId: string,
    status: 'accepted' | 'rejected'
  ): Promise<AxiosResponse> {
    return this.api.put('/connections_working.php', {
      id: connectionId,
      status,
    });
  }

  // Messages endpoints
  async getMessages(): Promise<AxiosResponse> {
    return this.api.get('/messages_working.php');
  }

  async sendMessage(messageData: {
    receiver_id: string;
    content: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/messages_working.php', messageData);
  }

  // Jobs endpoints
  async getJobs(): Promise<AxiosResponse> {
    return this.api.get('/jobs_working.php');
  }

  async createJob(jobData: {
    title: string;
    description: string;
    company: string;
    location?: string;
    salary_range?: string;
    job_type?: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/jobs_working.php', jobData);
  }

  async applyToJob(jobId: string): Promise<AxiosResponse> {
    return this.api.post('/jobs_working.php', {
      job_id: jobId,
      action: 'apply',
    });
  }

  // Events endpoints
  async getEvents(): Promise<AxiosResponse> {
    return this.api.get('/events_working.php');
  }

  async createEvent(eventData: {
    title: string;
    description: string;
    date: string;
    location?: string;
    event_type?: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/events_working.php', eventData);
  }

  async joinEvent(eventId: string): Promise<AxiosResponse> {
    return this.api.post('/events_working.php', {
      event_id: eventId,
      action: 'join',
    });
  }

  // Notifications endpoints
  async getNotifications(): Promise<AxiosResponse> {
    return this.api.get('/notifications_working.php');
  }

  async markNotificationAsRead(notificationId: string): Promise<AxiosResponse> {
    return this.api.put('/notifications_working.php', {
      id: notificationId,
      is_read: true,
    });
  }
}

export default new ApiService();
