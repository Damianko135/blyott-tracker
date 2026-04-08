// Authentication module for Blyott Tracker
// This module handles user authentication and token management.
// 


const API_URL = 'https://api.blyott.com'; // Base URL for the Blyott API
// Using current swagger configuration, the login endpoint is POST /login with body { username: string, password: string } and response { token: string }
// As shown in the /tools/blyott.swagger.json file

export interface TokenStore {
  saveAccessToken(token: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  clearAccessToken(): Promise<void>;
}

class NoopTokenStore implements TokenStore {
  async saveAccessToken(_: string): Promise<void> {}

  async getAccessToken(): Promise<string | null> {
    return null;
  }

  async clearAccessToken(): Promise<void> {}
}

/**
 * Auth class to manage user authentication and token handling.
 */
export class Auth {
  private token: string | null = null; // Store the authentication token in memory
  private refreshToken: string | null = null; // Store the refresh token (in memory only, more secure)

  constructor(private readonly tokenStore: TokenStore = new NoopTokenStore()) {}

  /**
   * Hydrate in-memory auth token from persistent storage.
   * This restores auth state after process restart without persisting refresh tokens.
   */
  async initializeFromStore(): Promise<void> {
    this.token = await this.tokenStore.getAccessToken();
  }

  /**
   * Authenticate the user with the provided credentials.
   * @param username - The user's username
   * @param password - The user's password
   * @return A promise that resolves when authentication is successful
   * or rejects with an error message if authentication fails.
   */
  async login(username: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Authentication failed (${response.status}): ${errorBody}`);
      }
      const data = await response.json();
      this.token = data.token; // Store the token for future use
      this.refreshToken = data.refreshToken; // Store the refresh token for future use
      
      // Persist token to storage (refresh token NOT persisted for security)
      await this.tokenStore.saveAccessToken(this.token);
    } catch (error) {
      throw new Error(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh the authentication token using the refresh token.
   * @return A promise that resolves when token refresh is successful
   * or rejects with an error message if refresh fails.
   */
  async refresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Token refresh failed (${response.status}): ${errorBody}`);
      }
      const data = await response.json();
      this.token = data.token;
      this.refreshToken = data.refreshToken;
      
      // Persist updated token to storage
      await this.tokenStore.saveAccessToken(this.token);
    } catch (error) {
      throw new Error(`Refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Logout the user by clearing the stored tokens.
   */
  async logout(): Promise<void> {
    this.token = null; // Clear the token from memory
    this.refreshToken = null; // Clear the refresh token from memory
    
    // Clear persisted token from storage
    await this.tokenStore.clearAccessToken();
  }

  /**
   * Check if the user is currently authenticated.
   * @return true if user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * Get the current authentication token.
   * @return The authentication token or null if not authenticated.
   * This method can be used to retrieve the token for making authenticated API requests.
   */
  getToken(): string | null {
    return this.token; // Return the current token
  }

  /**
   * Get the current refresh token.
   * @return The refresh token or null if not available.
   */
  getRefreshToken(): string | null {
    return this.refreshToken; // Return the current refresh token
  }

}