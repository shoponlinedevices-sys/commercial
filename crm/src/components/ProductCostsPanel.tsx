'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, X } from 'lucide-react';
import { crmApi, GatewayProduct, ProductCost, Supplier } from '@/lib/crm-api';

type Props = { token: string; products: GatewayProduct[]; initialProductId?: number | null };
type CostForm = {
  productId: string;
  supplierId: string;
  importPrice: string;
  quantity: string;
  shippingFee: string;
  otherFee: string;
  importDate: string;
  note: string;
};

const nowForInput = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const localDateTime = (value: string) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const emptyForm = (productId?: number): CostForm => ({
  productId: productId ? String(productId) : '',
  supplierId: '',
  importPrice: '',
  quantity: '1',
  shippingFee: '0',
  otherFee: '0',
  importDate: nowForInput(),
  note: '',
});
const formatVnd = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(value || 0);

export default function ProductCostsPanel({ token, products, initialProductId }: Props) {
  const [rows, setRows] = useState<ProductCost[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState({ totalImports: 0, totalValue: 0, productsWithCost: 0 });
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [productId, setProductId] = useState<number | undefined>(initialProductId ?? undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [latest, setLatest] = useState<ProductCost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCost | null>(null);
  const [details, setDetails] = useState<ProductCost | null>(null);
  const [form, setForm] = useState<CostForm>(emptyForm(initialProductId ?? undefined));
  const [productSearch, setProductSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const limit = 10;

  const selectedProduct = products.find((product) => product.id === productId);
  const editingSupplier = editing?.supplierId == null
    ? undefined
    : suppliers.find((supplier) => supplier.id === editing.supplierId);
  const needsCurrentSupplierOption = editing?.supplierId != null
    && !suppliers.some((supplier) => supplier.id === editing.supplierId && supplier.status === 1);
  const matchingProducts = useMemo(() => {
    const query = productSearch.trim().toLocaleLowerCase();
    return products
      .filter((product) => !query || `${product.name} ${product.sku || ''}`.toLocaleLowerCase().includes(query))
      .slice(0, 8);
  }, [productSearch, products]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await crmApi.getProductCosts(token, {
        productId,
        supplierId: supplierId ? Number(supplierId) : undefined,
        search: search.trim() || undefined,
        from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
        to: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
        page,
        limit,
      });
      setRows(result.items);
      setTotal(result.total);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }, [from, limit, page, productId, search, supplierId, to, token]);

  useEffect(() => {
    setProductId(initialProductId ?? undefined);
    setPage(1);
  }, [initialProductId]);

  useEffect(() => {
    crmApi.getProductCostSummary(token).then(setSummary).catch((requestError: Error) => setError(requestError.message));
    crmApi.getSuppliers(token, { page: 1, limit: 100 }).then((result) => setSuppliers(result.items)).catch((requestError: Error) => setError(requestError.message));
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(loadList, 250);
    return () => window.clearTimeout(timer);
  }, [loadList]);

  useEffect(() => {
    if (productId === undefined) {
      setLatest(null);
      return;
    }
    let active = true;
    crmApi.getLatestProductCost(token, productId)
      .then((result) => { if (active) setLatest(result.item); })
      .catch((requestError: Error) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [productId, token]);

  const resetFilters = () => {
    setSearch('');
    setSupplierId('');
    setFrom('');
    setTo('');
    setProductId(initialProductId ?? undefined);
    setPage(1);
  };

  const openForm = (cost?: ProductCost) => {
    setEditing(cost || null);
    const selectedId = cost?.productId ?? productId;
    setForm(cost ? {
      productId: String(cost.productId),
      supplierId: cost.supplierId == null ? '' : String(cost.supplierId),
      importPrice: String(cost.importPrice),
      quantity: String(cost.quantity),
      shippingFee: String(cost.shippingFee),
      otherFee: String(cost.otherFee),
      importDate: localDateTime(cost.importDate),
      note: cost.note || '',
    } : emptyForm(selectedId));
    setProductSearch(products.find((product) => product.id === selectedId)?.name || '');
    setFormOpen(true);
    setError('');
  };

  const saveCost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.productId) {
      setError('Hãy chọn sản phẩm từ danh sách.');
      return;
    }
    const payload = {
      productId: Number(form.productId),
      supplierId: form.supplierId ? Number(form.supplierId) : null,
      importPrice: Number(form.importPrice),
      quantity: Number(form.quantity),
      shippingFee: Number(form.shippingFee || 0),
      otherFee: Number(form.otherFee || 0),
      importDate: new Date(form.importDate).toISOString(),
      note: form.note.trim(),
    };
    setSaving(true);
    setError('');
    try {
      if (editing) await crmApi.updateProductCost(token, editing.id, payload);
      else await crmApi.createProductCost(token, payload);
      setFormOpen(false);
      const [nextSummary] = await Promise.all([
        crmApi.getProductCostSummary(token),
        loadList(),
      ]);
      setSummary(nextSummary);
      if (productId !== undefined) {
        const latestResult = await crmApi.getLatestProductCost(token, productId);
        setLatest(latestResult.item);
      }
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const totalGoods = Number(form.importPrice || 0) * Number(form.quantity || 0);
  const totalFees = Number(form.shippingFee || 0) + Number(form.otherFee || 0);
  const totalValue = totalGoods + totalFees;
  const unitCost = Number(form.quantity) > 0 ? totalValue / Number(form.quantity) : 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="orders-section product-cost-page">
      <div className="section-heading">
        <div><h2>{selectedProduct ? `Lịch sử giá nhập · ${selectedProduct.name}` : 'Quản lý giá nhập'}</h2><p>Theo dõi giá vốn và các lần nhập hàng đã ghi nhận · không làm thay đổi tồn kho</p></div>
        <button className="primary-button" onClick={() => openForm()}><Plus size={18} /> Ghi nhận giá nhập</button>
      </div>

      <div className="cost-summary-grid">
        <article className="cost-summary-card"><span>Tổng số lần nhập</span><strong>{summary.totalImports.toLocaleString('vi-VN')}</strong><small>lần nhập đã lưu</small></article>
        <article className="cost-summary-card"><span>Tổng giá trị nhập</span><strong>{formatVnd(summary.totalValue)}</strong><small>đã bao gồm các khoản phí</small></article>
        <article className="cost-summary-card"><span>Sản phẩm có giá nhập</span><strong>{summary.productsWithCost.toLocaleString('vi-VN')}</strong><small>sản phẩm có lịch sử nhập</small></article>
      </div>

      {selectedProduct && <div className="latest-cost-panel">
        <div><span>Giá bán hiện tại</span><strong>{formatVnd(Number(selectedProduct.price))}</strong></div>
        <div><span>Giá nhập gần nhất</span><strong>{latest ? formatVnd(latest.importPrice) : 'Chưa có dữ liệu'}</strong></div>
        <div><span>Nhà cung cấp gần nhất</span><strong>{latest?.supplierName || '—'}</strong></div>
        <div><span>Giá vốn / đơn vị</span><strong>{latest ? formatVnd(latest.unitCost) : '—'}</strong></div>
        <div><span>Lợi nhuận dự kiến / đơn vị</span><strong className={latest && latest.expectedProfit < 0 ? 'negative-value' : ''}>{latest ? formatVnd(latest.expectedProfit) : '—'}</strong>{latest && <small>{latest.profitMarginPercent === null ? 'Chưa thể tính tỷ suất' : `Tỷ suất ${latest.profitMarginPercent.toFixed(1)}%`}</small>}</div>
      </div>}

      <div className="cost-filter-grid">
        <label className="cost-search"><span>Tìm sản phẩm</span><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tên sản phẩm hoặc SKU..." /></div></label>
        <label><span>Nhà cung cấp</span><select value={supplierId} onChange={(event) => { setSupplierId(event.target.value); setPage(1); }}><option value="">Tất cả nhà cung cấp</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}{supplier.status !== 1 ? ' (đã khóa)' : ''}</option>)}</select></label>
        <label><span>Từ ngày</span><input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(1); }} /></label>
        <label><span>Đến ngày</span><input type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(1); }} /></label>
        <button className="filter-button cost-reset" onClick={resetFilters}>Đặt lại bộ lọc</button>
      </div>
      {error && <p className="cost-error" role="alert">{error}</p>}
      <div className="table-wrap">
        <table className="product-cost-table">
          <thead><tr><th>STT</th><th>SẢN PHẨM</th><th>SKU</th><th>NHÀ CUNG CẤP</th><th>GIÁ NHẬP</th><th>SỐ LƯỢNG</th><th>PHÍ VẬN CHUYỂN</th><th>CHI PHÍ KHÁC</th><th>TỔNG TIỀN</th><th>NGÀY NHẬP</th><th>THAO TÁC</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={11} className="cost-state">Đang tải lịch sử giá nhập...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={11} className="cost-state">Chưa có lịch sử nhập hàng phù hợp.</td></tr>}
            {!loading && rows.map((row, index) => (
              <tr key={row.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td><strong>{row.productName}</strong></td><td>{row.sku || `SP-${row.productId}`}</td>
                <td>{row.supplierName || '—'}</td><td>{formatVnd(row.importPrice)}</td><td>{row.quantity.toLocaleString('vi-VN')}</td>
                <td>{formatVnd(row.shippingFee)}</td><td>{formatVnd(row.otherFee)}</td><td><strong>{formatVnd(row.totalValue)}</strong></td>
                <td>{new Date(row.importDate).toLocaleString('vi-VN')}</td>
                <td><div className="table-actions"><button className="icon-action" title="Xem chi tiết" aria-label="Xem lần nhập" onClick={() => setDetails(row)}><Eye size={16} /></button><button className="icon-action" title="Chỉnh sửa" aria-label="Sửa lần nhập" onClick={() => openForm(row)}><Pencil size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination"><span>{total === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, total)} trên {total} lần nhập</span><div><button aria-label="Trang trước" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} /></button><strong>Trang {page} / {totalPages}</strong><button aria-label="Trang sau" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight size={16} /></button></div></div>

      {formOpen && <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}><div className="modal cost-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><p className="eyebrow">{editing ? 'CẬP NHẬT LẦN NHẬP' : 'LỊCH SỬ GIÁ NHẬP MỚI'}</p><h2>{editing ? 'Chỉnh sửa lần nhập' : 'Ghi nhận giá nhập'}</h2></div><button className="close-button" onClick={() => setFormOpen(false)} aria-label="Đóng"><X size={20} /></button></div>
        <form onSubmit={saveCost}>
          <label>Sản phẩm <span className="required-mark">*</span>
            <input value={productSearch} onChange={(event) => { setProductSearch(event.target.value); setForm((current) => ({ ...current, productId: '' })); }} placeholder="Nhập tên hoặc SKU để tìm..." autoComplete="off" required={!form.productId} />
            {productSearch && form.productId === '' && <div className="product-choice-list">{matchingProducts.map((product) => <button type="button" key={product.id} onClick={() => { setForm((current) => ({ ...current, productId: String(product.id) })); setProductSearch(`${product.name}${product.sku ? ` (${product.sku})` : ''}`); }}>{product.name} {product.sku ? `· ${product.sku}` : ''}</button>)}{matchingProducts.length === 0 && <small>Không tìm thấy sản phẩm.</small>}</div>}
          </label>
          <label>Nhà cung cấp<select value={form.supplierId} onChange={(event) => setForm((current) => ({ ...current, supplierId: event.target.value }))}><option value="">Không chọn nhà cung cấp</option>{needsCurrentSupplierOption && <option value={form.supplierId} disabled={editingSupplier?.status !== 1}>{editingSupplier?.name || editing?.supplierName || `Nhà cung cấp #${editing?.supplierId}`}{editingSupplier?.status !== 1 ? ' (đã khóa, giữ nguyên lịch sử)' : ''}</option>}{suppliers.filter((supplier) => supplier.status === 1).map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label>
          <div className="form-row"><label>Giá nhập đơn vị (VND)<input type="number" min="0" step="0.01" value={form.importPrice} onChange={(event) => setForm((current) => ({ ...current, importPrice: event.target.value }))} required /></label><label>Số lượng<input type="number" min="1" step="1" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} required /></label></div>
          <div className="form-row"><label>Phí vận chuyển<input type="number" min="0" step="0.01" value={form.shippingFee} onChange={(event) => setForm((current) => ({ ...current, shippingFee: event.target.value }))} /></label><label>Chi phí khác<input type="number" min="0" step="0.01" value={form.otherFee} onChange={(event) => setForm((current) => ({ ...current, otherFee: event.target.value }))} /></label></div>
          <label>Ngày nhập<input type="datetime-local" value={form.importDate} onChange={(event) => setForm((current) => ({ ...current, importDate: event.target.value }))} required /></label>
          <label>Ghi chú<textarea rows={2} value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} /></label>
          <div className="cost-calculation"><div><span>Tổng tiền hàng</span><strong>{formatVnd(totalGoods)}</strong></div><div><span>Tổng chi phí</span><strong>{formatVnd(totalFees)}</strong></div><div><span>Tổng giá trị nhập</span><strong>{formatVnd(totalValue)}</strong></div><div><span>Giá vốn / đơn vị</span><strong>{formatVnd(unitCost)}</strong></div></div>
          {error && <p className="cost-error" role="alert">{error}</p>}
          <button className="primary-button submit-button" type="submit" disabled={saving || !form.productId}>{saving ? 'Đang lưu...' : 'Lưu lần nhập'}</button>
        </form>
      </div></div>}

      {details && <div className="modal-backdrop" onMouseDown={() => setDetails(null)}><div className="modal cost-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><p className="eyebrow">CHI TIẾT LẦN NHẬP</p><h2>{details.productName}</h2></div><button className="close-button" onClick={() => setDetails(null)} aria-label="Đóng"><X size={20} /></button></div>
        <dl className="supplier-details"><dt>SKU</dt><dd>{details.sku || `SP-${details.productId}`}</dd><dt>Nhà cung cấp</dt><dd>{details.supplierName || '—'}</dd><dt>Giá nhập đơn vị</dt><dd>{formatVnd(details.importPrice)}</dd><dt>Số lượng</dt><dd>{details.quantity}</dd><dt>Phí vận chuyển</dt><dd>{formatVnd(details.shippingFee)}</dd><dt>Chi phí khác</dt><dd>{formatVnd(details.otherFee)}</dd><dt>Tổng giá trị nhập</dt><dd>{formatVnd(details.totalValue)}</dd><dt>Giá vốn / đơn vị</dt><dd>{formatVnd(details.unitCost)}</dd><dt>Ngày nhập</dt><dd>{new Date(details.importDate).toLocaleString('vi-VN')}</dd><dt>Ghi chú</dt><dd>{details.note || '—'}</dd></dl>
      </div></div>}
    </section>
  );
}
