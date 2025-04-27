import { ICategory } from "./ICategory";
import { ISubCategory } from "./ISubCategory";
import { IUom } from "./IUom";

export interface IProduct{
    _id:string;
    productName:string;
    category:ICategory | string;
    subCategory:ISubCategory | string;
    isActive:boolean;
    stock:number;
    gstRate:number;
    hsnSacCode:string;
    price:number;
    unitOfMeasure:string | IUom;
    addedBy:string;
    createdAt:string;
    updatedAt:string;
    categoryId?:string;
    subcategoryId?:string
}