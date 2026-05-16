import { API_URL } from './api';

const FARMER_BASE_PATHS = ['/v1/farmers', '/farmers'];

const withJsonHeaders = (headers = {}) => ({
  'Content-Type': 'application/json',
  ...headers,
});

const requestFarmerApi = async (pathSuffix = '', options = {}) => {
  let lastResponse = null;

  for (const basePath of FARMER_BASE_PATHS) {
    const response = await fetch(`${API_URL}${basePath}${pathSuffix}`, options);
    if (response.status !== 404) {
      return response;
    }
    lastResponse = response;
  }

  return lastResponse;
};

export const syncFarmerProfileRequest = (payload) =>
  requestFarmerApi('', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify(payload),
  });

export const getFarmerProfileRequest = (farmerId) =>
  requestFarmerApi(`/${encodeURIComponent(farmerId)}`);

export const getFarmerDetailsRequest = (farmerId) =>
  requestFarmerApi(`/${encodeURIComponent(farmerId)}/details`);

export const getPendingApplicationsRequest = (limit = 42) =>
  requestFarmerApi(`/pending-applications?limit=${encodeURIComponent(limit)}`);

export const getLoanApplicationsRequest = ({ status = '', page = 1, pageSize = 10, search = '' } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (search) params.set('search', search);

  return requestFarmerApi(`/loan-applications?${params.toString()}`);
};

export const updateLoanApplicationStatusRequest = (applicationId, status) =>
  requestFarmerApi(`/loan-applications/${encodeURIComponent(applicationId)}/status`, {
    method: 'PATCH',
    headers: withJsonHeaders(),
    body: JSON.stringify({ status }),
  });

export const updateFarmerProfileRequest = (farmerId, payload) =>
  requestFarmerApi(`/${encodeURIComponent(farmerId)}`, {
    method: 'PUT',
    headers: withJsonHeaders(),
    body: JSON.stringify(payload),
  });