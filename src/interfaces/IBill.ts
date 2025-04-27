
interface ICustomer{
    name:string;
    contact:string;
    paymentMethod:string;
    billDate:string | Date;
}

export interface IBillProduct{
    value:string;
    label:string;
    price:number;
    gstRate:18;
    hsnSacCode:string;
    unitOfMeasure:string;
    _id?:string
}
export interface Items{
    product:IBillProduct | null;
    quantity:number;
}


interface ISummary{
    subtotal:number;
    sgstTotal:number;
    cgstTotal:number;
    igstTotal:number;
    totalTax:number;
    total:number;
    
}
export interface IBiill{
    _id?:string;
    customer:ICustomer;
    items:Items[];
    billType:string;
    gstStatus:string;
    summary:ISummary;
    invoiceNo?:string;
    createdAt?:string | Date;

}

