export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string | null;
  refreshToken: string | null;
}

export interface AccessLevelOwnerModel {
  tenantId?: number;
  name?: string | null;
}

export interface TenancyShareBaseModel {
  tenantId?: number;
  name?: string | null;
}

export interface AccessLevelDetailsResponse {
  id?: number;
  name?: string | null;
  description?: string | null;
  owner?: AccessLevelOwnerModel;
  sharedAccessLevelTenants?: TenancyShareBaseModel[] | null;
}

export interface AddAssetRequest {
  assetName: string;
  assetCode: string;
  tagId?: string | null;
  allUsers?: boolean;
  assetSupplier?: string | null;
  assetManufacturer?: string | null;
  assetModel?: string | null;
  assetOwner?: string | null;
  assetSerialNumber?: string | null;
  accessLevels?: number[] | null;
  workflows?: number[] | null;
  assetTypes?: number[] | null;
  zones?: number[] | null;
  customFields?: Array<Record<string, unknown>> | null;
}

export interface AssetDetailsResponse {
  id?: number;
  assetName?: string | null;
  assetCode?: string | null;
  tagId?: string | null;
  [key: string]: unknown;
}

export interface BlyottClientConfig {
  baseUrl?: string;
  token?: string;
  fetchImpl?: typeof fetch;
}
