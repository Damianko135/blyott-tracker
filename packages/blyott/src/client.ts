import { assertLoginRequest, parseLoginResponse } from './schema';
import {
  type AccessLevelDetailsResponse,
  type AddAssetRequest,
  type AssetDetailsResponse,
  type BlyottClientConfig,
  type LoginRequest,
  type LoginResponse
} from './types';

const DEFAULT_BASE_URL = 'https://api.blyott.com';

export class BlyottClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private token: string | null;

  constructor(config: BlyottClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.token = config.token ?? null;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    assertLoginRequest(request);
    const payload = await this.request<unknown>('POST', '/login', {
      body: request
    });
    const parsed = parseLoginResponse(payload);
    if (parsed.token) {
      this.token = parsed.token;
    }
    return parsed;
  }

  async getAccessLevel(accessLevelId: number): Promise<AccessLevelDetailsResponse> {
    return this.request<AccessLevelDetailsResponse>('GET', `/accessLevel/${accessLevelId}`, {
      requiresAuth: true
    });
  }

  async addAsset(request: AddAssetRequest): Promise<AssetDetailsResponse> {
    return this.request<AssetDetailsResponse>('POST', '/asset', {
      requiresAuth: true,
      body: request
    });
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    options: { requiresAuth?: boolean; body?: unknown } = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    };

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (options.requiresAuth) {
      if (!this.token) {
        throw new Error('Blyott token is not set');
      }
      headers.token = this.token;
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Blyott API request failed (${response.status}): ${errorText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}

export function createBlyottClient(config: BlyottClientConfig = {}): BlyottClient {
  return new BlyottClient(config);
}
