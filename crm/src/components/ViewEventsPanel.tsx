'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { crmApi, ViewEntityType, ViewEvent, ViewEventStats } from '@/lib/crm-api';

type FilterForm = {
  entityType: ViewEntityType | '';
  entityId: string;
  entitySearch: string;
  from: string;
  to: string;
  visitorId: string;
  sessionId: string;
  userId: string;
};

type ViewEventsPanelProps = {
  token: string;
  onOpenCustomer: (userId: string) => void;
};

const emptyFilters: FilterForm = {
  entityType: '',
  entityId: '',
  entitySearch: '',
  from: '',
  to: '',
  visitorId: '',
  sessionId: '',
  userId: '',
};

function localDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function asIsoDateTime(value: string, endOfDay = false): string {
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00'}`);
  return date.toISOString();
}

function countLabel(value: string): string {
  try {
    return BigInt(value || '0').toLocaleString('vi-VN');
  } catch {
    return '0';
  }
}

function entityLabel(type: ViewEntityType): string {
  return { category: 'Danh mục', brand: 'Thương hiệu', product: 'Sản phẩm' }[type];
}

export default function ViewEventsPanel({ token, onOpenCustomer }: ViewEventsPanelProps) {
  const [form, setForm] = useState<FilterForm>(emptyFilters);
  const [filters, setFilters] = useState<FilterForm | null>(null);
  const [events, setEvents] = useState<ViewEvent[]>([]);
  const [stats, setStats] = useState<ViewEventStats | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 25;

  useEffect(() => {
    const defaultFilters = { ...emptyFilters, from: localDate(29), to: localDate(0) };
    setForm(defaultFilters);
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    if (!filters) return;
    let active = true;
    setLoading(true);
    setError('');
    setEvents([]);
    setTotal('0');
    setStats(null);
    const from = filters.from ? asIsoDateTime(filters.from) : '';
    const to = filters.to ? asIsoDateTime(filters.to, true) : '';
    Promise.all([
      crmApi.getViewEvents({
        ...filters,
        from,
        to,
        page,
        limit: pageSize,
      }, token),
      crmApi.getViewEventStats({
        entityType: filters.entityType,
        from,
        to,
      }, token),
    ]).then(([eventPage, viewStats]) => {
      if (!active) return;
      setEvents(eventPage.items || []);
      setTotal(eventPage.total || '0');
      setStats(viewStats);
    }).catch((requestError: Error) => {
      if (active) {
        setError(requestError.message);
        setEvents([]);
        setTotal('0');
        setStats(null);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [filters, page, token]);

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setFilters({ ...form });
  };

  const clearFilters = () => {
    const cleared = { ...emptyFilters, from: localDate(29), to: localDate(0) };
    setForm(cleared);
    setPage(1);
    setFilters(cleared);
  };

  const totalPages = Math.max(1, Math.ceil(Number(total) / pageSize));

  return (
    <section className="orders-section view-events-page">
      <div className="section-heading">
        <div>
          <h2>Quan tâm của khách hàng</h2>
          <p>Lượt xem danh mục, thương hiệu và sản phẩm; không phải đơn hàng hoặc giao dịch.</p>
        </div>
      </div>

      <form className="view-event-filters" onSubmit={applyFilters}>
        <label>Loại đối tượng
          <select value={form.entityType} onChange={(event) => setForm({ ...form, entityType: event.target.value as ViewEntityType | '' })}>
            <option value="">Tất cả</option>
            <option value="category">Danh mục</option>
            <option value="brand">Thương hiệu</option>
            <option value="product">Sản phẩm</option>
          </select>
        </label>
        <label>Từ ngày<input type="date" value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })} /></label>
        <label>Đến ngày<input type="date" value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })} /></label>
        <label>Mã hoặc tên đối tượng<input value={form.entityId || form.entitySearch} onChange={(event) => {
          const value = event.target.value;
          setForm({ ...form, entityId: /^\d+$/.test(value) ? value : '', entitySearch: /^\d+$/.test(value) ? '' : value });
        }} placeholder="Nhập mã hoặc tên" /></label>
        <label>Mã khách truy cập<input value={form.visitorId} onChange={(event) => setForm({ ...form, visitorId: event.target.value })} /></label>
        <label>Mã phiên<input value={form.sessionId} onChange={(event) => setForm({ ...form, sessionId: event.target.value })} /></label>
        <label>Mã khách hàng<input value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} /></label>
        <div className="view-event-filter-actions">
          <button className="primary-button" type="submit"><Search size={15} /> Lọc dữ liệu</button>
          <button className="filter-button" type="button" onClick={clearFilters}>Đặt lại</button>
        </div>
      </form>

      {error && <p className="view-event-error" role="alert">Không thể tải dữ liệu lượt xem: {error}</p>}

      <div className="view-event-stat-grid">
        <article className="view-event-stat"><span>Tổng lượt xem</span><strong>{loading ? 'Đang tải…' : countLabel(stats?.totalViews || '0')}</strong><small>Trong khoảng thời gian đã chọn</small></article>
        <article className="view-event-stat"><span>Khách truy cập duy nhất</span><strong>{loading ? 'Đang tải…' : countLabel(stats?.uniqueVisitors || '0')}</strong><small>Chỉ đếm mã khách truy cập đã nhận diện</small></article>
      </div>

      <div className="view-event-insights">
        {(['product', 'brand', 'category'] as const).map((type) => {
          const top = stats?.topEntities?.filter((item) => item.entityType === type) || [];
          return (
            <section className="view-event-insight" key={type}>
              <h3>{`Được xem nhiều: ${entityLabel(type).toLowerCase()}`}</h3>
              {loading ? <p>Đang tải dữ liệu...</p> : top.length === 0 ? <p>Chưa có dữ liệu trong khoảng thời gian này.</p> : (
                <ol>
                  {top.map((item) => <li key={`${item.entityType}-${item.entityId}`}><span>{item.entityName || `${entityLabel(type)} #${item.entityId}`}</span><strong>{countLabel(item.views)}</strong></li>)}
                </ol>
              )}
            </section>
          );
        })}
      </div>

      <section className="view-event-daily">
        <h3>Lượt xem theo ngày</h3>
        {loading ? <p>Đang tải dữ liệu...</p> : !stats?.dailyViews?.length ? <p>Chưa có dữ liệu theo ngày.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>NGÀY</th><th>LƯỢT XEM</th></tr></thead>
              <tbody>{stats.dailyViews?.map((item) => <tr key={item.date}><td>{new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN')}</td><td>{countLabel(item.views)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      <div className="section-heading view-event-list-heading">
        <div><h3>Lịch sử xem</h3><p>{countLabel(total)} sự kiện, mới nhất trước</p></div>
      </div>
      <div className="table-wrap view-event-table">
        <table>
          <thead><tr><th>THỜI GIAN</th><th>ĐỐI TƯỢNG</th><th>KHÁCH TRUY CẬP</th><th>PHIÊN</th><th>KHÁCH HÀNG</th><th>TRANG / NGUỒN</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="view-event-state">Đang tải sự kiện...</td></tr>}
            {!loading && !error && events.length === 0 && <tr><td colSpan={6} className="view-event-state">Không tìm thấy lượt xem phù hợp.</td></tr>}
            {!loading && events.map((item) => (
              <tr key={item.viewEventId}>
                <td>{new Date(item.viewedAt).toLocaleString('vi-VN')}</td>
                <td><strong>{item.entityName || `${entityLabel(item.entityType)} #${item.entityId}`}</strong><small className="view-event-subtext">{entityLabel(item.entityType)} · #{item.entityId}</small></td>
                <td>{item.visitorId || 'Ẩn danh chưa định danh'}</td>
                <td>{item.sessionId || '—'}</td>
                <td>{item.userId ? <button type="button" className="text-button" onClick={() => onOpenCustomer(item.userId)}>#{item.userId}</button> : 'Khách ẩn danh'}</td>
                <td><span className="view-event-url" title={item.pageUrl}>{item.pageUrl || '—'}</span><small className="view-event-subtext" title={item.referrerUrl}>Từ: {item.referrerUrl || 'trực tiếp'}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>Trang {page} / {totalPages} · {countLabel(total)} lượt xem</span>
        <div>
          <button type="button" aria-label="Trang trước" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</button>
          <button type="button" aria-label="Trang tiếp theo" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Tiếp</button>
        </div>
      </div>
    </section>
  );
}
