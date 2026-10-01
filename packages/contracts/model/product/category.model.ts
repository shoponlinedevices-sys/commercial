import { Id } from "../common/common.model";

export interface ICategory extends Id {
    sortOrder: string,
    name: string,
    slug: string,
    isActive: number,
    icon: string,
    createdAt: string,
    updatedAt: string,
}