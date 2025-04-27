export interface IUom {
    _id: string;
    uom: string; // Long name (e.g., "Kilogram")
    uom_short: string; // Short name (e.g., "kg")
    isActive: boolean;
  }