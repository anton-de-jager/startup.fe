import { Guid } from "guid-typescript";
import { EstablishmentType } from "./establihmentType.model";
import { User } from "./user.model";

export class Establishment {
    id: Guid;
    userId: Guid;
    user: User;
    establishmentTypeId: Guid;
    establishmentType: EstablishmentType;
    name: string;
    description: string;
    phone: string;
    email: string;
    web: string;
    lat: number;
    lon: number;
    urlImage: string;

    constructor(
        id: Guid,
        userId: Guid,
        user: User,
        establishmentTypeId: Guid,
        establishmentType: EstablishmentType,
        name: string,
        description: string,
        phone: string,
        email: string,
        web: string,
        lat: number,
        lon: number,
        urlImage: string
    ) {
        this.id = id;
        this.userId = userId;
        this.user = user;
        this.establishmentTypeId = establishmentTypeId;
        this.establishmentType = establishmentType;
        this.name = name;
        this.description = description;
        this.phone = phone;
        this.email = email;
        this.web = web;
        this.lat = lat;
        this.lon = lon;
        this.urlImage = urlImage;
    }
}