const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred";
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => request<any>("/auth/me"),
  demoLogin: (role: string) => request<any>(`/auth/demo-login/${role}`, { method: "POST" }),

  // Student Endpoints
  getStudentProfile: () => request<any>("/students/profile"),
  updateStudentProfile: (data: any) => request<any>("/students/profile", { method: "PUT", body: JSON.stringify(data) }),
  getRecommendedInternships: (params?: { min_score?: number; location_type?: string; search?: string; engine_name?: string }) => {
    const query = new URLSearchParams();
    if (params?.min_score !== undefined) query.set("min_score", params.min_score.toString());
    if (params?.location_type) query.set("location_type", params.location_type);
    if (params?.search) query.set("search", params.search);
    if (params?.engine_name) query.set("engine_name", params.engine_name);
    return request<any[]>(`/students/recommendations?${query.toString()}`);
  },
  getMyApplications: () => request<any[]>("/students/applications"),

  // Company Endpoints
  getCompanyProfile: () => request<any>("/companies/profile"),
  updateCompanyProfile: (data: any) => request<any>("/companies/profile", { method: "PUT", body: JSON.stringify(data) }),
  getCompanyInternships: () => request<any[]>("/companies/internships"),
  createInternship: (data: any) => request<any>("/companies/internships", { method: "POST", body: JSON.stringify(data) }),
  updateInternship: (id: number, data: any) => request<any>(`/companies/internships/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInternship: (id: number) => request<any>(`/companies/internships/${id}`, { method: "DELETE" }),
  getInternshipApplicants: (internshipId: number) => request<any[]>(`/companies/internships/${internshipId}/applicants`),
  updateApplicantStatus: (applicationId: number, status: string) =>
    request<any>(`/companies/applications/${applicationId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Internships Public
  listInternships: (params?: { search?: string; skill?: string; location_type?: string; min_stipend?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.skill) query.set("skill", params.skill);
    if (params?.location_type) query.set("location_type", params.location_type);
    if (params?.min_stipend !== undefined) query.set("min_stipend", params.min_stipend.toString());
    return request<any[]>(`/internships?${query.toString()}`);
  },
  getInternshipDetail: (id: number) => request<any>(`/internships/${id}`),
  getInternshipMatchScore: (id: number, engineName?: string) => {
    const query = engineName ? `?engine_name=${engineName}` : "";
    return request<any>(`/internships/${id}/match-score${query}`);
  },

  // Applications
  applyToInternship: (internshipId: number, coverLetter?: string) =>
    request<any>("/applications", {
      method: "POST",
      body: JSON.stringify({ internship_id: internshipId, cover_letter: coverLetter }),
    }),
  withdrawApplication: (id: number) => request<any>(`/applications/${id}`, { method: "DELETE" }),

  // Admin
  getAdminStats: () => request<any>("/admin/stats"),
  listUsers: (role?: string) => {
    const query = role ? `?role=${role}` : "";
    return request<any[]>(`/admin/users${query}`);
  },
  toggleUserStatus: (userId: number, isActive: boolean) =>
    request<any>(`/admin/users/${userId}/status?is_active=${isActive}`, { method: "PUT" }),
  listCompanies: () => request<any[]>("/admin/companies"),
  verifyCompany: (companyId: number, isVerified: boolean) =>
    request<any>(`/admin/companies/${companyId}/verify?is_verified=${isVerified}`, { method: "PUT" }),
  listAdminInternships: () => request<any[]>("/admin/internships"),
  updateInternshipStatusAdmin: (id: number, status: string) =>
    request<any>(`/admin/internships/${id}/status?status=${status}`, { method: "PUT" }),
  getMatchingConfig: () => request<any>("/admin/matching-config"),
};
