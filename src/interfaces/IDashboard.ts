
interface IData{
    withTax:number;
    withoutTax:number;
}
interface MonthWiseData {
    [month: string]: {
      withTax: number;
      withoutTax: number;
    };
  }
  
  interface CategoryWiseData {
    [category: string]: number;
  }
  
  interface GstWiseData {
    [gstRate: string]: number;
  }
  
  

export interface IOverview{
    monthWise:MonthWiseData
    currentMonth:IData;
    today:IData
}

export interface IAnalytics{
    monthWise:MonthWiseData,
    categoryWise:CategoryWiseData,
    gstWise:GstWiseData
}