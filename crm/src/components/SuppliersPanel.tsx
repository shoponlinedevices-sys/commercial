'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, LockKeyhole, Pencil, Plus, Search, UnlockKeyhole, X } from 'lucide-react';
import { crmApi, Supplier } from '@/lib/crm-api';

type Props = { token: string };
type SupplierForm = Pick<Supplier, 'name' | 'phone' | 'email' | 'address' | 'taxCode' | 'note'>;

const emptySupplier: SupplierForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  taxCode: '',
  note: '',
};

export default function SuppliersPanel({ token }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [details, setDetails] = useState<Supplier | null>(null);
  const [saving, setSaving] = useState(false);
  const limit = 10;

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await crmApi.getSuppliers(token, {
        search: search.trim() || undefined,
        status: status === '' ? undefined : Number(status),
        page,
        limit,
      });
      setSuppliers(result.items);
      setTotal(result.total);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, status, token]);

  useEffect(() => {
    const timer = window.setTimeout(loadSuppliers, 250);
    return () => window.clearTimeout(timer);
  }, [loadSuppliers]);

  const openForm = (supplier?: Supplier) => {
    setEditing(supplier || null);
    setFormOpen(true);
    setError('');
  };

  const saveSupplier = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: SupplierForm = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      taxCode: String(formData.get('taxCode') || '').trim(),
      note: String(formData.get('note') || '').trim(),
    };
    setSaving(true);
    setError('');
    try {
      if (editing) await crmApi.updateSupplier(token, editing.id, data);
      else await crmApi.createSupplier(token, data);
      setFormOpen(false);
      await loadSuppliers();
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (supplier: Supplier) => {
    setError('');
    try {
      await crmApi.setSupplierStatus(token, supplier.id, supplier.status === 1 ? 0 : 1);
      await loadSuppliers();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  };

  const showSupplierDetails = async (supplier: Supplier) => {
    setError('');
    try {
      setDetails(await crmApi.getSupplier(token, supplier.id));
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="orders-section supplier-page">
      <div className="section-heading">
        <div><h2>Quản lý nhà cung cấp</h2><p>{total} nhà cung cấp · {suppliers.filter((supplier) => supplier.status === 1).length} đang hoạt động trong trang này</p></div>
        <button className="primary-button" onClick={() => openForm()}><Plus size={18} /> Thêm nhà cung cấp</button>
      </div>
      <div className="toolbar">
        <div className="search-field"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm tên hoặc số điện thoại..." /></div>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Lọc trạng thái nhà cung cấp">
          <option value="">Tất cả trạng thái</option><option value="1">Đang hoạt động</option><option value="0">Đã khóa</option>
        </select>
      </div>
      {error && <p className="cost-error" role="alert">{error}</p>}
      <div className="table-wrap">
        <table className="supplier-table">
          <thead><tr><th>STT</th><th>TÊN NHÀ CUNG CẤP</th><th>SỐ ĐIỆN THOẠI</th><th>EMAIL</th><th>ĐỊA CHỈ</th><th>TRẠNG THÁI</th><th>NGÀY TẠO</th><th>THAO TÁC</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="cost-state">Đang tải nhà cung cấp...</td></tr>}
            {!loading && suppliers.length === 0 && <tr><td colSpan={8} className="cost-state">Chưa có nhà cung cấp phù hợp.</td></tr>}
            {!loading && suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td><strong>{supplier.name}</strong></td>
                <td>{supplier.phone || '—'}</td>
                <td>{supplier.email || '—'}</td>
                <td className="supplier-address">{supplier.address || '—'}</td>
                <td><span className={`supplier-status ${supplier.status === 1 ? 'active' : 'locked'}`}>{supplier.status === 1 ? 'Hoạt động' : 'Đã khóa'}</span></td>
                <td>{new Date(supplier.createdAt).toLocaleDateString('vi-VN')}</td>
                <td><div className="table-actions">
                  <button className="icon-action" title="Xem chi tiết" aria-label={`Xem ${supplier.name}`} onClick={() => showSupplierDetails(supplier)}><Eye size={16} /></button>
                  <button className="icon-action" title="Chỉnh sửa" aria-label={`Sửa ${supplier.name}`} onClick={() => openForm(supplier)}><Pencil size={16} /></button>
                  <button className="icon-action" title={supplier.status === 1 ? 'Khóa nhà cung cấp' : 'Mở khóa nhà cung cấp'} aria-label={supplier.status === 1 ? `Khóa ${supplier.name}` : `Mở khóa ${supplier.name}`} onClick={() => toggleStatus(supplier)}>{supplier.status === 1 ? <LockKeyhole size={16} /> : <UnlockKeyhole size={16} />}</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination"><span>{total === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, total)} trên {total} nhà cung cấp</span><div><button aria-label="Trang trước" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} /></button><strong>Trang {page} / {totalPages}</strong><button aria-label="Trang sau" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight size={16} /></button></div></div>

      {formOpen && <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}><div className="modal supplier-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><p className="eyebrow">{editing ? 'CẬP NHẬT THÔNG TIN' : 'NHÀ CUNG CẤP MỚI'}</p><h2>{editing ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h2></div><button className="close-button" onClick={() => setFormOpen(false)} aria-label="Đóng"><X size={20} /></button></div>
        <form onSubmit={saveSupplier}>
          <label>Tên nhà cung cấp<input name="name" required maxLength={255} defaultValue={editing?.name || ''} placeholder="Tên công ty / cửa hàng" /></label>
          <div className="form-row"><label>Số điện thoại<input name="phone" maxLength={20} defaultValue={editing?.phone || ''} /></label><label>Email<input name="email" type="email" maxLength={100} defaultValue={editing?.email || ''} /></label></div>
          <div className="form-row"><label>Địa chỉ<input name="address" defaultValue={editing?.address || ''} /></label><label>Mã số thuế<input name="taxCode" maxLength={50} defaultValue={editing?.taxCode || ''} /></label></div>
          <label>Ghi chú<textarea name="note" rows={3} defaultValue={editing?.note || ''} /></label>
          {error && <p className="cost-error" role="alert">{error}</p>}
          <button className="primary-button submit-button" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu nhà cung cấp'}</button>
        </form>
      </div></div>}

      {details && <div className="modal-backdrop" onMouseDown={() => setDetails(null)}><div className="modal supplier-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><p className="eyebrow">CHI TIẾT NHÀ CUNG CẤP</p><h2>{details.name}</h2></div><button className="close-button" onClick={() => setDetails(null)} aria-label="Đóng"><X size={20} /></button></div>
        <dl className="supplier-details"><dt>Trạng thái</dt><dd>{details.status === 1 ? 'Hoạt động' : 'Đã khóa'}</dd><dt>Số điện thoại</dt><dd>{details.phone || '—'}</dd><dt>Email</dt><dd>{details.email || '—'}</dd><dt>Địa chỉ</dt><dd>{details.address || '—'}</dd><dt>Mã số thuế</dt><dd>{details.taxCode || '—'}</dd><dt>Ghi chú</dt><dd>{details.note || '—'}</dd><dt>Ngày tạo</dt><dd>{new Date(details.createdAt).toLocaleString('vi-VN')}</dd></dl>
      </div></div>}
    </section>
  );
}
