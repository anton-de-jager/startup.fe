import { Guid } from "guid-typescript"

export interface UserResponse {
    id: Guid;
    userTypeId: Guid;
    name: string;
    description: string;
    email: string;
    phone: string;
    web: string;
    lat: number;
    lon: number;
    address: string;
    urlImage: string;
    ts: Date;
    statusId: Guid;
}