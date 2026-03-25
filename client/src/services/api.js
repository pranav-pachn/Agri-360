export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  chat: ({ message, language = 'en', aiResult = {}, risk = {}, yieldData = {}, trust = {}, context = {} }) => {
    const derivedContext = {
      disease: aiResult.disease || context.disease,
      riskLevel: risk.level || context.riskLevel,
      projectedYield: yieldData.projectedYield || context.projectedYield,
      trustScore: trust.score || context.trustScore
    };

    return fetchApi('/v1/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        language,
        context: derivedContext
      })
    });
  },
};