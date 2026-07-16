import { api } from './client';
import type { ApiResponse, User, PublicUser } from '../types';

export const usersApi = {
  me: () =>
    api.get<ApiResponse<User>>('/api/users/me'),

  updateMe: (body: Partial<Pick<User, 'fullName' | 'headline' | 'companyName' | 'isReferrer' | 'isSeeker' | 'avatarUrl' | 'onboarded'>>) =>
    api.patch<ApiResponse<User>>('/api/users/me', body),

  byId: (id: string) =>
    api.get<ApiResponse<PublicUser>>(`/api/users/${id}`),

  search: (q: string, page = 1, limit = 20) =>
    api.get<{ data: PublicUser[] }>(`/api/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  deleteMe: () =>
    api.delete('/api/users/me'),
};
