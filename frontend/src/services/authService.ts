const API_URL = '/api/auth';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Login failed');
  }

  return response.json(); // returns { accessToken: '...' }
};

export const signUp = async (username: string, email: string, password: string, postalCode: string) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, postalCode }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Signup failed');
  }

  return response.text();
};
