# Supplier and product cost records

Apply `migrations/20261123-create-supplier-product-cost-tables.sql` to the
existing MySQL database before deploying this feature. The migration adds
`tbl_supplier` and `tbl_product_cost`; it does not alter `tbl_product`.

The CRM calls Gateway's admin-protected REST API. Gateway forwards the requests
to `products-svc` over the existing ProductService gRPC connection configured
with `PRODUCTS_GRPC_URL`; no supplier or cost data is served through a new
public HTTP endpoint.

The CRM exposes the feature from its **Nhà cung cấp** and **Giá nhập** sidebar
items. Product history is available from the **Lịch sử giá nhập** action in
the CRM product list. These records do not update inventory.
