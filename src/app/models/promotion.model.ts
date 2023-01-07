import { Guid } from "guid-typescript";
import { Establishment } from "./establishment.model";

export class Promotion {
    id: Guid;
    establishmentId: Guid;
    establishment: Establishment;
    title: string;
    content: string;
    imageUrl: string;
    promotionDate: Date;
    countSent: number;
    countRead: number;

    constructor(
        id: Guid,
        establishmentId: Guid,
        establishment: Establishment,
        title: string,
        content: string,
        imageUrl: string,
        promotionDate: Date,
        countSent: number,
        countRead: number
    ) {
        this.id = id;
        this.establishmentId = establishmentId;
        this.establishment = establishment;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.promotionDate = promotionDate;
        this.countSent = countSent;
        this.countRead = countRead;
    }
}