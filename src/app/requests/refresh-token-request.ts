import { Guid } from "guid-typescript";

export interface RefreshTokenRequest {
    userId: Guid;
    refreshToken: string;
}