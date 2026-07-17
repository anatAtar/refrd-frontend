import { api, serverFetch } from './client';
import type { ApiResponse, ApplicationWithDetails } from '../types';

export const applicationsApi = {
  /** Submit a CV (multipart) */
  submit: (form: FormData) =>
    api.upload<ApiResponse<{ id: string }>>('/api/applications', form),

  /** Referrer inbox — received CVs */
  inbox: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = params?.status ? `?status=${params.status}` : '';
    return api.get<{ data: ApplicationWithDetails[] }>(`/api/applications/inbox${qs}`);
  },

  /** Seeker's sent applications */
  mine: () =>
    api.get<{ data: ApplicationWithDetails[] }>('/api/applications/mine'),

  /** Single application */
  byId: (id: string) =>
    api.get<{ data: ApplicationWithDetails }>(`/api/applications/${id}`),

  /** Update status (referrer: viewed | rejected) */
  updateStatus: (id: string, status: 'viewed' | 'rejected') =>
    api.patch(`/api/applications/${id}/status`, { status }),

  /** Forward to HR */
  forward: (id: string, body: { hrEmail: string; referrerNote?: string }) =>
    api.post(`/api/applications/${id}/forward`, body),

  /** CV download URL — forces file save */
  cvUrl: (id: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}/cv`,

  /** CV preview URL — opens inline in browser (PDF displays, Word downloads) */
  cvPreviewUrl: (id: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}/cv/preview`,
};

/** Server Component: fetch inbox */
export async function getServerInbox(cookieHeader: string) {
  try {
    const res = await serverFetch<{ data: ApplicationWithDetails[] }>(
      '/api/applications/inbox',
      cookieHeader,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

/** Server Component: fetch seeker's applications */
export async function getServerMyApplications(cookieHeader: string) {
  try {
    const res = await serverFetch<{ data: ApplicationWithDetails[] }>(
      '/api/applications/mine',
      cookieHeader,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}
