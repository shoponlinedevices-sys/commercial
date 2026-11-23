export interface ISupplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    taxCode: string;
    note: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}
export interface ISupplierMutation {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    taxCode?: string;
    note?: string;
}
export interface ISupplierFilters {
    search?: string;
    status?: number;
    page: number;
    limit: number;
}
export interface IProductCost {
    id: string;
    productId: number;
    productName: string;
    sku: string;
    salePrice: string;
    supplierId: number;
    supplierName: string;
    importPrice: string;
    quantity: number;
    shippingFee: string;
    otherFee: string;
    totalGoods: string;
    totalFees: string;
    totalValue: string;
    unitCost: string;
    expectedProfit: string;
    profitMarginPercent: string;
    hasProfitMargin: boolean;
    importDate: string;
    note: string;
    createdAt: string;
    hasSupplier: boolean;
}
export interface IProductCostMutation {
    id?: string;
    productId?: number;
    supplierId?: number | null;
    importPrice?: number;
    quantity?: number;
    shippingFee?: number;
    otherFee?: number;
    importDate?: string;
    note?: string;
}
export interface IProductCostFilters {
    productId?: number;
    supplierId?: number;
    search?: string;
    from?: string;
    to?: string;
    page: number;
    limit: number;
}
export interface IProductCostSummary {
    totalImports: string;
    totalValue: string;
    productsWithCost: string;
}
