export const BackendConfig = {
  springApiUrl: getSpringApiUrl()
};

function getSpringApiUrl(): string {
  return window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://finora-spring.onrender.com/api';
}
