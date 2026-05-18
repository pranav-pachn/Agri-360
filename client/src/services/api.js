// In development `VITE_API_URL` can point to the API server. In production
// prefer a relative path so the front-end talks to the same origin (or set
// `VITE_API_URL` at build time for a dedicated API host).
export const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Clone headers
  const headers = { ...options.headers };
  
  // Automatically set Content-Type to JSON if not uploading FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // If it IS FormData, explicitly ensure we don't have a Content-Type set.
  // The browser MUST set this automatically to include the multi-part boundary string!
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const api = {
  get: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => {
    return fetchApi(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },
  chat: ({ message, language = 'en', context = {} }) => {
    return fetchApi('/v1/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        language,
        context
      })
    });
  },
};
