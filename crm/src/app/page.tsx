'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Bell, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3, LayoutDashboard,
  History, Menu, PackageCheck, Plus, Search, Settings, ShoppingBag, TrendingUp, Users, X,
} from 'lucide-react';
import { crmApi, FeatureSetting, GatewayOrder, GatewayProduct, HistoryLog, UserProfile } from '@/lib/crm-api';

type Status = 'Mới' | 'Đang xử lý' | 'Đã giao' | 'Đã hủy';
type Order = { id: string; userId: string | number; customer: string; email: string; items: number; total: number; status: Status; createdAt: string; date: string; initials: string; tone: string };
type PageType = 'dashboard' | 'orders' | 'customers' | 'products' | 'logs' | 'settings' | 'help';

const formatVnd = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
const statusToLabel: Record<string, Status> = { pending: 'Mới', processing: 'Đang xử lý', completed: 'Đã giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const labelToStatus: Record<Status, string> = { 'Mới': 'pending', 'Đang xử lý': 'processing', 'Đã giao': 'delivered', 'Đã hủy': 'cancelled' };
const getOrderDateParts = (createdAt: string) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric' }).formatToParts(new Date(createdAt));
  return { year: parts.find((part) => part.type === 'year')?.value || '', month: parts.find((part) => part.type === 'month')?.value || '' };
};
const mapOrder = (order: GatewayOrder, customerProfile?: UserProfile): Order => {
  const customer = customerProfile?.full_name || customerProfile?.username || 'Khách hàng chưa cập nhật tên';
  const lineTotal = order.orderLines?.reduce((sum, line) => sum + Number(line.unitPrice) * line.quantity, 0) || 0;
  const total = Number(order.totalAmount) || lineTotal;
  return { id: `#DH-${order.id}`, userId: order.userId, customer, email: customerProfile?.email || 'Chưa có email', items: order.orderLines?.reduce((sum, line) => sum + line.quantity, 0) || 0, total, status: statusToLabel[order.status] || 'Mới', createdAt: order.createdAt, date: new Date(order.createdAt).toLocaleString('vi-VN'), initials: customer.split(' ').map((part) => part[0]).slice(-2).join('').toUpperCase(), tone: 'blue' };
};

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRevenueOrders, setMonthlyRevenueOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'Tất cả' | Status>('Tất cả');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [notice, setNotice] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<GatewayProduct[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [featureSettings, setFeatureSettings] = useState<FeatureSetting[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyAction, setHistoryAction] = useState('Tất cả');
  const [historySource, setHistorySource] = useState('Tất cả');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [customerProfiles, setCustomerProfiles] = useState<Record<string, UserProfile>>({});
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const savedToken = localStorage.getItem('crm_access_token');
    const savedUser = localStorage.getItem('crm_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
    const startOfMonthDate = new Date(`${today.slice(0, 7)}-01T00:00:00+07:00`);
    const startOfNextMonthDate = new Date(startOfMonthDate);
    startOfNextMonthDate.setUTCMonth(startOfNextMonthDate.getUTCMonth() + 1);
    const startOfMonth = startOfMonthDate.toISOString();
    const startOfNextMonth = startOfNextMonthDate.toISOString();
    Promise.all([
      crmApi.getOrders(token),
      crmApi.getOrders(token, { from: startOfMonth, to: startOfNextMonth, statuses: ['completed', 'delivered'] }),
    ]).then(([data, revenueData]) => {
      setMonthlyRevenueOrders(revenueData.map((order) => mapOrder(order, customerProfiles[String(order.userId)])));
      setOrders(data.map((order) => mapOrder(order, customerProfiles[String(order.userId)])));
      const userIds = Array.from(new Set(data.map((order) => String(order.userId))));
      return Promise.all(userIds.map(async (userId) => {
        try { return [userId, await crmApi.getProfile(Number(userId), token)] as const; } catch { return null; }
      })).then((profiles) => {
        const resolvedProfiles = Object.fromEntries(profiles.filter((entry): entry is readonly [string, UserProfile] => entry !== null));
        setCustomerProfiles((current) => ({ ...current, ...resolvedProfiles }));
        setOrders(data.map((order) => mapOrder(order, resolvedProfiles[String(order.userId)] || customerProfiles[String(order.userId)])));
      });
    }).catch((requestError: Error) => {
      setError(requestError.message);
      if (requestError.message.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('crm_access_token');
        localStorage.removeItem('crm_refresh_token');
        localStorage.removeItem('crm_user');
        setToken(null);
        setUser(null);
        setOrders([]);
      }
    }).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    Promise.allSettled([crmApi.getProducts(token), crmApi.getProfile(user.id, token), crmApi.getFeatureSettings(token)]).then(([productResult, profileResult, settingsResult]) => {
      if (productResult.status === 'fulfilled') setProducts(productResult.value.products || []);
      if (profileResult.status === 'fulfilled') setProfile(profileResult.value);
      if (settingsResult.status === 'fulfilled') setFeatureSettings(settingsResult.value || []);
    });
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    setHistoryLoading(true);
    crmApi.getHistoryLogs(token).then(setHistoryLogs).catch((requestError: Error) => setError(requestError.message)).finally(() => setHistoryLoading(false));
  }, [token]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(query.toLowerCase());
    const orderDate = getOrderDateParts(order.createdAt);
    const matchesMonth = !selectedMonth || orderDate.month === selectedMonth;
    const matchesYear = !selectedYear || orderDate.year === selectedYear;
    return matchesQuery && (status === 'Tất cả' || order.status === status) && matchesMonth && matchesYear;
  }), [orders, query, status, selectedMonth, selectedYear]);

  const availableYears = useMemo(() => Array.from(new Set(orders.map((order) => getOrderDateParts(order.createdAt).year))).sort((first, second) => Number(second) - Number(first)), [orders]);

  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const displayedOrders = currentPage === 'dashboard'
    ? filteredOrders.slice(0, 10)
    : filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage);

  useEffect(() => {
    setOrderPage(1);
  }, [query, status, selectedMonth, selectedYear, currentPage]);

  const stats = useMemo(() => {
    const revenue = monthlyRevenueOrders.reduce((sum, order) => sum + order.total, 0);
    const pending = orders.filter(o => o.status === 'Mới').length;
    const totalOrders = orders.length;
    return { revenue, pending, monthlyRevenueOrders: monthlyRevenueOrders.length, totalOrders };
  }, [orders, monthlyRevenueOrders]);

  const customers = useMemo(() => Array.from(new Map(orders.map((order) => [order.customer, order])).values()), [orders]);
  const filteredHistoryLogs = useMemo(() => historyLogs.filter((log) => {
    const searchable = `${log.action} ${log.entityType} ${log.entityId} ${log.source} ${log.createdBy}`.toLowerCase();
    return searchable.includes(historyQuery.toLowerCase()) && (historyAction === 'Tất cả' || log.action === historyAction) && (historySource === 'Tất cả' || log.source === historySource);
  }), [historyLogs, historyQuery, historyAction, historySource]);
  const navigate = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !user) return;
    const data = new FormData(event.currentTarget);
    try {
      const updatedProfile = await crmApi.updateProfile(user.id, {
        full_name: String(data.get('full_name') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
      }, token);
      setProfile(updatedProfile);
      setProfileMessage('Đã lưu thay đổi hồ sơ');
      window.setTimeout(() => setProfileMessage(''), 2500);
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  };

  const toggleFeature = async (setting: FeatureSetting) => {
    if (!token) return;
    try {
      const updated = await crmApi.updateFeatureSetting(setting.featureKey, !setting.isEnabled, token);
      setFeatureSettings((current) => current.map((item) => item.featureKey === setting.featureKey ? updated : item));
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  };

  const changeStatus = async (id: string, nextStatus: Status) => {
    if (!token) return;
    try {
      await crmApi.updateStatus(id.replace('#DH-', ''), labelToStatus[nextStatus], token);
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status: nextStatus } : order));
      setNotice(`Đã cập nhật trạng thái ${id}`);
      window.setTimeout(() => setNotice(''), 2500);
    } catch (requestError) { setError((requestError as Error).message); }
  };

  const addOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = String(data.get('customer'));
    const total = Number(data.get('total'));
    const initials = customer.split(' ').map((part) => part[0]).slice(-2).join('').toUpperCase();
    if (!token || !user) return;
    crmApi.createOrder(user.id, Number(data.get('productId')), total, Number(data.get('items')), Math.round(total / Number(data.get('items'))), token).then((createdOrder) => {
      setOrders((current) => [mapOrder(createdOrder, profile || undefined), ...current]);
      setShowForm(false);
      setNotice('Đã tạo đơn hàng mới');
      window.setTimeout(() => setNotice(''), 2500);
    }).catch((requestError: Error) => setError(requestError.message));
  };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const data = new FormData(event.currentTarget);
    setSavingProduct(true);
    setError('');
    try {
      const image = String(data.get('image') || '').trim();
      if (image.length > 0 && image.length > 65535) {
        setError('Ảnh sản phẩm quá lớn. Vui lòng dùng URL ảnh hoặc ảnh nhỏ hơn 64 KB.');
        return;
      }
      const result = await crmApi.createProduct({
        name: String(data.get('name') || '').trim(),
        price: Number(data.get('price')),
        description: String(data.get('description') || '').trim(),
        image,
        oldPrice: data.get('oldPrice') ? Number(data.get('oldPrice')) : undefined,
        badge: String(data.get('badge') || '').trim(),
        sku: String(data.get('sku') || '').trim(),
        unit: String(data.get('unit') || '').trim(),
        moq: String(data.get('moq') || '').trim(),
        category: String(data.get('category') || '').trim() || undefined,
      }, token);
      setProducts((current) => [...current, result.product]);
      setShowProductForm(false);
      setNotice('Đã thêm sản phẩm mới');
      window.setTimeout(() => setNotice(''), 2500);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSavingProduct(false);
    }
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const result = await crmApi.login(String(data.get('username')), String(data.get('password')));
      localStorage.setItem('crm_access_token', result.access_token);
      localStorage.setItem('crm_refresh_token', result.refresh_token);
      localStorage.setItem('crm_user', JSON.stringify(result.user));
      setToken(result.access_token);
      setUser(result.user);
      setLoginError('');
    } catch (requestError) { 
      const errorMsg = (requestError as Error).message;
      setLoginError(errorMsg.includes('Internal server error') ? 'Đăng nhập thất bại. Vui lòng kiểm tra lại username/password.' : errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_access_token');
    localStorage.removeItem('crm_refresh_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
    setOrders([]);
    setProfile(null);
  };

  if (!token) return <div className="login-screen"><div className="login-panel"><div className="brand"><div className="brand-mark"><ShoppingBag size={19} /></div><span>mộc <b>CRM</b></span></div><p className="eyebrow">KẾT NỐI GATEWAY</p><h1>Đăng nhập CRM</h1><p className="subtitle">Dùng tài khoản đã có trên hệ thống để xem dữ liệu đơn hàng.</p><form onSubmit={login}><label>Tên đăng nhập<input name="username" required autoComplete="username" /></label><label>Mật khẩu<input name="password" type="password" required autoComplete="current-password" /></label>{loginError && <p className="form-error">{loginError}</p>}<button className="primary-button submit-button" type="submit">Đăng nhập</button></form></div></div>;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><ShoppingBag size={19} /></div><span>mộc <b>CRM</b></span></div>
        <div className="workspace-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="nav-list">
          <button onClick={() => navigate('dashboard')} className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><LayoutDashboard size={18} /> Tổng quan</button>
          <button onClick={() => navigate('orders')} className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><ClipboardList size={18} /> Đơn hàng <span className="nav-count">{orders.length}</span></button>
          <button onClick={() => navigate('customers')} className={`nav-item ${currentPage === 'customers' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><Users size={18} /> Khách hàng</button>
          <button onClick={() => navigate('products')} className={`nav-item ${currentPage === 'products' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><PackageCheck size={18} /> Sản phẩm</button>
          <button onClick={() => navigate('logs')} className={`nav-item ${currentPage === 'logs' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><History size={18} /> Nhật ký <span className="nav-count">{historyLogs.length}</span></button>
        </nav>
        <div className="sidebar-bottom"><button onClick={() => navigate('settings')} className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><Settings size={18} /> Cài đặt</button><button onClick={() => navigate('help')} className={`nav-item ${currentPage === 'help' ? 'active' : ''}`} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}><CircleHelp size={18} /> Trợ giúp</button></div>
        <div className="user-card" onClick={logout} style={{ cursor: 'pointer' }} title="Nhấp để đăng xuất"><div className="avatar avatar-dark">{user?.username?.slice(0, 2).toUpperCase() || 'TH'}</div><div><strong>{user?.username || 'Thảo Hà'}</strong><small>Nhấp để đăng xuất</small></div><ChevronDown size={15} /></div>
      </aside>

      <section className="content">
        <header className="topbar"><button className="mobile-menu" aria-label="Mở menu" onClick={() => setMobileMenuOpen((open) => !open)}><Menu size={20} /></button><div className="breadcrumbs"><span>Tổng quan</span><b>/</b><strong>{currentPage === 'dashboard' && 'Đơn hàng'}{currentPage === 'orders' && 'Đơn hàng'}{currentPage === 'customers' && 'Khách hàng'}{currentPage === 'products' && 'Sản phẩm'}{currentPage === 'logs' && 'Nhật ký hoạt động'}{currentPage === 'settings' && 'Cài đặt'}{currentPage === 'help' && 'Trợ giúp'}</strong></div><div className="topbar-actions"><button className="icon-button" aria-label="Thông báo" onClick={() => setNotice('Bạn không có thông báo mới')}><Bell size={19} /><i /></button><div className="avatar avatar-dark top-avatar">{user?.username?.slice(0, 2).toUpperCase() || 'TH'}</div></div></header>
        <div className="main-content">

          {currentPage === 'dashboard' && (
            <>
              <div className="intro"><div><p className="eyebrow">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</p><h1>Chào buổi sáng, {user?.username || 'Thảo'} <span>✦</span></h1><p className="subtitle">Đây là những gì đang diễn ra với cửa hàng hôm nay.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Tạo đơn hàng</button></div>
              <div className="stats-grid"><Stat icon={<TrendingUp size={19} />} label="Doanh thu tháng này" value={formatVnd(stats.revenue)} trend={stats.revenue > 0 ? stats.monthlyRevenueOrders + ' đơn đã giao' : '—'} hint="đơn đã giao hoặc hoàn thành" tone="orange" /><Stat icon={<ClipboardList size={19} />} label="Tổng đơn hàng" value={String(stats.totalOrders)} trend={stats.totalOrders > 0 ? '+' + stats.monthlyRevenueOrders : '0'} hint="từ dữ liệu thực" tone="blue" /><Stat icon={<Clock3 size={19} />} label="Chờ xử lý" value={String(stats.pending).padStart(2, '0')} trend={stats.pending > 0 ? 'Cần chú ý' : 'Không có'} hint={stats.pending > 0 ? 'đơn hàng mới' : 'tất cả đã xử lý'} tone={stats.pending > 0 ? 'yellow' : 'green'} /><Stat icon={<Users size={19} />} label="Khách hàng riêng biệt" value={String(new Set(orders.map(o => o.customer)).size)} trend={stats.totalOrders > 0 ? 'Có dữ liệu' : '—'} hint="từ đơn hàng" tone="green" /></div>
            </>
          )}

          {(currentPage === 'dashboard' || currentPage === 'orders') && (
            <section className="orders-section"><div className="section-heading"><div><h2>{currentPage === 'dashboard' ? 'Đơn hàng gần đây' : 'Quản lý đơn hàng'}</h2><p>{currentPage === 'dashboard' ? 'Theo dõi và xử lý các đơn hàng mới nhất' : 'Tìm kiếm, lọc và cập nhật trạng thái đơn hàng'}</p></div>{currentPage === 'dashboard' ? <button className="text-button" onClick={() => navigate('orders')}>Xem tất cả <span>→</span></button> : <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Tạo đơn hàng</button>}</div>
                <div className="toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã đơn, tên khách hàng..." /></div><select value={status} onChange={(event) => setStatus(event.target.value as 'Tất cả' | Status)} aria-label="Lọc trạng thái"><option>Tất cả</option><option>Mới</option><option>Đang xử lý</option><option>Đã giao</option><option>Đã hủy</option></select><select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} aria-label="Lọc theo tháng"><option value="">Tất cả tháng</option>{Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => <option key={month} value={month}>Tháng {month}</option>)}</select><select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} aria-label="Lọc theo năm"><option value="">Tất cả năm</option>{availableYears.map((year) => <option key={year} value={year}>{year}</option>)}</select><button className="filter-button" onClick={() => { setQuery(''); setStatus('Tất cả'); setSelectedMonth(''); setSelectedYear(''); }}><span>⌘</span> Đặt lại</button></div>
                <div className="table-wrap"><table><thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th><th>THỜI GIAN</th><th /></tr></thead><tbody>{loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>}{error && error.includes('Unauthorized') && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'red' }}>⚠ Lỗi xác thực. Hãy <button onClick={logout} style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontWeight: 'bold' }}>đăng nhập lại</button></td></tr>}{error && !error.includes('Unauthorized') && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</td></tr>}{!loading && !error && displayedOrders.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy đơn hàng nào.</td></tr>}{displayedOrders.map((order) => <tr key={order.id}><td><strong className="order-id">{order.id}</strong></td><td><div className="customer"><div className={`avatar avatar-${order.tone}`}>{order.initials}</div><div><strong>{order.customer}</strong><small>{order.email}</small></div></div></td><td>{order.items} sản phẩm</td><td><strong>{formatVnd(order.total)}</strong></td><td><select className={`status status-${order.status}`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as Status)} aria-label={`Trạng thái ${order.id}`}><option>Mới</option><option>Đang xử lý</option><option>Đã giao</option><option>Đã hủy</option></select></td><td className="date-cell">{order.date}</td><td>{order.status === 'Mới' ? <button className="deliver-button" onClick={() => changeStatus(order.id, 'Đã giao')} aria-label={`Đánh dấu đã giao ${order.id}`} title="Đánh dấu đã giao"><PackageCheck size={17} /></button> : <button className="more-button" aria-label={`Tùy chọn ${order.id}`}>•••</button>}</td></tr>)}</tbody></table></div>
                {currentPage === 'orders' && <div className="pagination"><span>{filteredOrders.length === 0 ? '0' : (orderPage - 1) * ordersPerPage + 1}-{Math.min(orderPage * ordersPerPage, filteredOrders.length)} trên {filteredOrders.length} đơn hàng</span><div><button aria-label="Trang trước" disabled={orderPage === 1} onClick={() => setOrderPage((page) => Math.max(1, page - 1))}><ChevronLeft size={16} /></button><strong>Trang {orderPage} / {totalOrderPages}</strong><button aria-label="Trang sau" disabled={orderPage === totalOrderPages} onClick={() => setOrderPage((page) => Math.min(totalOrderPages, page + 1))}><ChevronRight size={16} /></button></div></div>}
            </section>
          )}

          {currentPage === 'customers' && (
            <section className="orders-section">
              <div className="section-heading"><div><h2>Quản lý khách hàng</h2><p>{customers.length} khách hàng từ dữ liệu đơn hàng</p></div><button className="text-button" onClick={() => navigate('orders')}>Xem đơn hàng <span>→</span></button></div>
              <div className="table-wrap"><table><thead><tr><th>KHÁCH HÀNG</th><th>EMAIL</th><th>SỐ ĐƠN</th><th>ĐƠN GẦN NHẤT</th><th>TỔNG CHI TIÊU</th></tr></thead><tbody>{customers.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>Chưa có dữ liệu khách hàng.</td></tr> : customers.map((customer) => { const customerOrders = orders.filter((order) => order.customer === customer.customer); return <tr key={customer.customer}><td><div className="customer"><div className={`avatar avatar-${customer.tone}`}>{customer.initials}</div><strong>{customer.customer}</strong></div></td><td>{customer.email}</td><td>{customerOrders.length}</td><td>{customer.date}</td><td><strong>{formatVnd(customerOrders.reduce((sum, order) => sum + order.total, 0))}</strong></td></tr>; })}</tbody></table></div>
            </section>
          )}

          {currentPage === 'products' && (
            <section className="orders-section">
              <div className="section-heading"><div><h2>Quản lý sản phẩm</h2><p>{products.length} sản phẩm từ Product Service</p></div><div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><button className="text-button" onClick={() => navigate('orders')}>Tạo đơn hàng <span>→</span></button><button className="primary-button" onClick={() => setShowProductForm(true)}><Plus size={18} /> Thêm sản phẩm</button></div></div>
              <div className="table-wrap"><table><thead><tr><th>SẢN PHẨM</th><th>SKU</th><th>ĐƠN VỊ</th><th>GIÁ</th><th>NHÃN</th></tr></thead><tbody>{products.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>Chưa tải được sản phẩm hoặc kho đang trống.</td></tr> : products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small style={{ display: 'block', color: '#9aa4a1', marginTop: '4px' }}>{product.description || 'Không có mô tả'}</small></td><td>{product.sku || `SP-${product.id}`}</td><td>{product.unit || '—'}</td><td><strong>{formatVnd(Number(product.price))}</strong></td><td>{product.badge || '—'}</td></tr>)}</tbody></table></div>
            </section>
          )}

          {currentPage === 'logs' && (
            <section className="orders-section">
              <div className="section-heading"><div><h2>Nhật ký hoạt động</h2><p>Theo dõi các thay đổi tạo từ gateway và microservices</p></div><button className="text-button" onClick={() => navigate('logs')}>↻ Tải lại</button></div>
              <div className="toolbar"><div className="search-field"><Search size={17} /><input value={historyQuery} onChange={(event) => setHistoryQuery(event.target.value)} placeholder="Tìm theo đối tượng, service, người tạo..." /></div><select value={historyAction} onChange={(event) => setHistoryAction(event.target.value)} aria-label="Lọc thao tác"><option>Tất cả</option><option>CREATE</option><option>UPDATE</option></select><select value={historySource} onChange={(event) => setHistorySource(event.target.value)} aria-label="Lọc service"><option>Tất cả</option>{Array.from(new Set(historyLogs.map((log) => log.source))).map((source) => <option key={source}>{source}</option>)}</select></div>
              <div className="table-wrap"><table><thead><tr><th>THỜI GIAN</th><th>THAO TÁC</th><th>ĐỐI TƯỢNG</th><th>SERVICE</th><th>NGƯỜI TẠO</th><th>CHI TIẾT</th></tr></thead><tbody>{historyLoading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Đang tải nhật ký...</td></tr> : filteredHistoryLogs.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Chưa có nhật ký phù hợp.</td></tr> : filteredHistoryLogs.map((log) => <tr key={`${log.source}-${log.id}`}><td className="date-cell">{new Date(log.createdAt).toLocaleString('vi-VN')}</td><td><span className={`log-action log-${log.action.toLowerCase()}`}>{log.action}</span></td><td><strong>{log.entityType}</strong><small style={{ display: 'block', color: '#9aa4a1', marginTop: '4px' }}>#{log.entityId}</small></td><td>{log.source}</td><td>{log.createdBy}</td><td><small>{log.metadata ? JSON.stringify(log.metadata) : '—'}</small></td></tr>)}</tbody></table></div>
            </section>
          )}

          {currentPage === 'settings' && (
            <section className="orders-section">
              <div className="section-heading"><div><h2>Cài đặt</h2><p>Quản lý hồ sơ và tính năng vận hành</p></div></div>
              <form className="settings-form" onSubmit={saveProfile}><h3>Hồ sơ tài khoản</h3><div className="form-row"><label>Tên đăng nhập<input value={profile?.username || user?.username || ''} disabled /></label><label>Vai trò<input value={profile?.role || 'Nhân viên'} disabled /></label></div><div className="form-row"><label>Họ và tên<input name="full_name" defaultValue={profile?.full_name || ''} placeholder="Nguyễn Văn An" /></label><label>Email<input name="email" type="email" defaultValue={profile?.email || ''} placeholder="email@example.com" /></label></div><label>Số điện thoại<input name="phone" defaultValue={profile?.phone || ''} placeholder="090 000 0000" /></label><button className="primary-button" type="submit">Lưu hồ sơ</button>{profileMessage && <span style={{ color: 'var(--green)', marginLeft: '12px', fontSize: '13px' }}>{profileMessage}</span>}</form>
              <div className="settings-form"><h3>Tính năng hệ thống</h3>{featureSettings.length === 0 ? <p style={{ color: '#999' }}>Chưa có feature setting để cấu hình.</p> : featureSettings.map((setting) => <label key={setting.featureKey} className="setting-row"><span><strong>{setting.featureName}</strong><small>{setting.featureKey}</small></span><input type="checkbox" checked={setting.isEnabled} onChange={() => toggleFeature(setting)} /></label>)}</div>
            </section>
          )}

          {currentPage === 'help' && (
            <section className="orders-section">
              <div className="section-heading"><div><h2>Trợ giúp & Hỗ trợ</h2><p>Tìm kiếm câu trả lời và liên hệ hỗ trợ</p></div></div>
              <div className="help-list"><details open><summary>Làm thế nào để cập nhật trạng thái đơn?</summary><p>Vào menu Đơn hàng, chọn trạng thái mới trong cột Trạng thái. Thay đổi sẽ được lưu trực tiếp qua gateway.</p></details><details><summary>Vì sao sản phẩm chưa hiển thị?</summary><p>Kiểm tra Product Service và kết nối gateway. Bạn có thể tải lại trang sau khi dịch vụ hoạt động.</p></details><details><summary>Dữ liệu khách hàng lấy từ đâu?</summary><p>Danh sách khách hàng được tổng hợp từ các đơn hàng đã tải về trong phiên làm việc hiện tại.</p></details></div><a className="primary-button help-contact" href="mailto:support@mokcrm.local">Liên hệ hỗ trợ</a>
            </section>
          )}

          <footer><span>© 2026 mộc CRM</span><span>Đã đồng bộ vừa xong <b className="sync-dot" /></span></footer>
        </div>
      </section>
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
      {error && <div className="toast" style={{ background: '#ff6b6b' }}><span>✗</span>{error}</div>}
      {showForm && <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">ĐƠN HÀNG MỚI</p><h2>Tạo đơn hàng</h2></div><button className="close-button" onClick={() => setShowForm(false)} aria-label="Đóng"><X size={20} /></button></div><form onSubmit={addOrder}><label>Khách hàng<input name="customer" required placeholder="Nguyễn Văn An" /></label><label>Email<input name="email" type="email" required placeholder="email@example.com" /></label><label>Mã sản phẩm<input name="productId" type="number" min="1" defaultValue="1" required /></label><div className="form-row"><label>Số sản phẩm<input name="items" type="number" min="1" defaultValue="1" required /></label><label>Tổng tiền<input name="total" type="number" min="0" step="1000" required placeholder="0" /></label></div><button className="primary-button submit-button" type="submit"><Plus size={18} /> Tạo đơn hàng</button></form></div></div>}
      {showProductForm && <div className="modal-backdrop" onMouseDown={() => setShowProductForm(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">SẢN PHẨM MỚI</p><h2>Thêm sản phẩm</h2></div><button className="close-button" onClick={() => setShowProductForm(false)} aria-label="Đóng"><X size={20} /></button></div><form onSubmit={addProduct}><label>Tên sản phẩm<input name="name" required placeholder="Ví dụ: Máy cắt cầm tay" /></label><div className="form-row"><label>Giá bán<input name="price" type="number" min="0" step="1000" required placeholder="0" /></label><label>Giá cũ<input name="oldPrice" type="number" min="0" step="1000" placeholder="Không bắt buộc" /></label></div><div className="form-row"><label>SKU<input name="sku" placeholder="SP-001" /></label><label>Đơn vị<input name="unit" placeholder="Cái" /></label></div><div className="form-row"><label>Nhãn<input name="badge" placeholder="Bán chạy" /></label><label>MOQ<input name="moq" placeholder="1" /></label></div><label>Mô tả<textarea name="description" rows={3} placeholder="Mô tả ngắn về sản phẩm" /></label><label>Ảnh sản phẩm<input name="image" type="url" placeholder="https://..." /></label><label>Mã danh mục<input name="category" placeholder="Không bắt buộc" /></label><button className="primary-button submit-button" type="submit" disabled={savingProduct}><Plus size={18} /> {savingProduct ? 'Đang lưu...' : 'Thêm sản phẩm'}</button></form></div></div>}
    </main>
  );
}

function Stat({ icon, label, value, trend, hint, tone }: { icon: React.ReactNode; label: string; value: string; trend: string; hint: string; tone: string }) { return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><p>{label}</p><strong>{value}</strong><div className="stat-foot"><span className={tone === 'yellow' ? 'warning' : ''}>{trend}</span><small>{hint}</small></div></article>; }
