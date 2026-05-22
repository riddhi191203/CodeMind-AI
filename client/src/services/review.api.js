import api from "../api/api";

export const analyzeCode = (data) => api.post("/api/review/analyze", data);

export const solveError = (data) => api.post("/api/review/error-solver", data);

export const refactorCode = (data) => api.post("/api/review/refactor", data);

export const analyzeComplexity = (data) => api.post("/api/review/complexity", data);

export const formatCode = (data) => api.post("/api/review/format", data);

export const getReports = (params) => api.get("/api/review/history", { params });

export const getReport = (id) => api.get(`/api/review/${id}`);

export const deleteReport = (id) => api.delete(`/api/review/${id}`);

export const compareReports = (data) => api.post("/api/review/compare", data);

export const getSupportedLanguages = () => api.get("/api/review/languages");
