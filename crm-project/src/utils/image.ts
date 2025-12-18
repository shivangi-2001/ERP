const BACKEND_URL = "http://127.0.0.1:8000"; // Or your production domain

export const getPocImageUrl = (path: string | undefined) => {
  if (!path) return "";
  
  // If it's already a full URL or a Base64 string, return it as is
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  // If it's a relative path from the media folder, ensure /media/ is included
  // Some setups return 'clients/...' and some return '/media/clients/...'
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${BACKEND_URL}/media${cleanPath}`;
};