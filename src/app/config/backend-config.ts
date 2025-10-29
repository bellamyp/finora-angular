export const BackendConfig = {
  springApiUrl: getSpringApiUrl(window.location.hostname)
};

export function getSpringApiUrl(hostname: string): string {
  return hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://finora-spring.onrender.com/api';
}
