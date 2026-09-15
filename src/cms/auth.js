import api from '../services/api';
import i18n from '../i18n';

export const auth = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response && response.accessToken) {
      api.setTokens(response.accessToken, response.refreshToken);
      return { token: response.accessToken, user: { email, name: email.split('@')[0] } };
    }
    throw new Error(i18n.t('auth.loginFailed', 'Login failed'));
  },

  logout() {
    api.clearTokens();
  },
};

export default auth;
