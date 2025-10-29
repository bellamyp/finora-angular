import { getSpringApiUrl } from './backend-config';

describe('BackendConfig', () => {

  it('should return localhost URL when hostname is localhost', () => {
    expect(getSpringApiUrl('localhost')).toBe('http://localhost:8080/api');
  });

  it('should return production URL when hostname is not localhost', () => {
    expect(getSpringApiUrl('example.com')).toBe('https://finora-spring.onrender.com/api');
  });

});
