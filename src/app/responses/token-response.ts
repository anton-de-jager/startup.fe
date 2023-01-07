import { Guid } from "guid-typescript";

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    name: string;
    userId: Guid;
}