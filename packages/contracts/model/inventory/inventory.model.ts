
export type IInventorySummaryRequest = Record<string, never>;

export interface IInventorySummary {
  totalProducts: number;
  totalOnHand: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
  hasCostData: boolean;
}
