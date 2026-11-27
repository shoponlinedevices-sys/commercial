import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import {
  clearSession, crmApi, FeatureSetting, HistoryLog, InventoryItem, InventorySummary, loadSession,
  Order, Product, ProductCost, Profile, saveSession, Supplier, User, ViewEvent, ViewStats,
} from './src/api';

type Screen = 'Tổng quan' | 'Đơn hàng' | 'Khách hàng' | 'Sản phẩm' | 'Tồn kho' | 'Nhà cung cấp' | 'Giá nhập' | 'Lượt xem' | 'Nhật ký' | 'Cài đặt' | 'Trợ giúp';
type FormKind = 'order' | 'product' | 'inventory' | 'supplier' | 'cost' | null;
type FormState = Record<string, string>;
type OrderStatus = 'Mới' | 'Đang xử lý' | 'Đã giao' | 'Đã hủy';

const screens: Array<{ name: Screen; icon: keyof typeof Ionicons.glyphMap }> = [
  { name: 'Tổng quan', icon: 'grid-outline' },
  { name: 'Đơn hàng', icon: 'receipt-outline' },
  { name: 'Khách hàng', icon: 'people-outline' },
  { name: 'Sản phẩm', icon: 'cube-outline' },
  { name: 'Tồn kho', icon: 'file-tray-stacked-outline' },
  { name: 'Nhà cung cấp', icon: 'business-outline' },
  { name: 'Giá nhập', icon: 'cash-outline' },
  { name: 'Lượt xem', icon: 'eye-outline' },
  { name: 'Nhật ký', icon: 'time-outline' },
  { name: 'Cài đặt', icon: 'settings-outline' },
  { name: 'Trợ giúp', icon: 'help-circle-outline' },
];
const orderLabels: Record<string, OrderStatus> = { pending: 'Mới', processing: 'Đang xử lý', completed: 'Đã giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const orderValues: Record<OrderStatus, string> = { 'Mới': 'pending', 'Đang xử lý': 'processing', 'Đã giao': 'delivered', 'Đã hủy': 'cancelled' };
const inventoryActions = [
  { id: 'import', label: 'Nhập kho' }, { id: 'adjust', label: 'Điều chỉnh' }, { id: 'reserve', label: 'Giữ chỗ' },
  { id: 'release', label: 'Giải phóng' }, { id: 'sale', label: 'Bán hàng' }, { id: 'return', label: 'Trả hàng' },
] as const;
type InventoryAction = typeof inventoryActions[number]['id'];
const emptyInventory: InventorySummary = { totalProducts: 0, totalOnHand: 0, lowStockItems: 0, outOfStockItems: 0, inventoryValue: 0, hasCostData: false };
const emptyViewFilters = { from: '', to: '', entityType: '', entitySearch: '', visitorId: '', sessionId: '', userId: '' };
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
const defaultViewFilters = () => {
  const date = new Date();
  date.setDate(date.getDate() - 29);
  const from = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return { ...emptyViewFilters, from, to: today() };
};
const formatMoney = (value: number | string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value) || 0);
const formatDate = (value?: string) => value ? new Date(value).toLocaleString('vi-VN') : '—';
const asError = (error: unknown) => error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
const initials = (value: string) => value.trim().split(/\s+/).slice(-2).map((part) => part[0] || '').join('').toUpperCase();
const orderDateParts = (value: string) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric' }).formatToParts(new Date(value));
  return { year: parts.find((part) => part.type === 'year')?.value || '', month: parts.find((part) => part.type === 'month')?.value || '' };
};

export default function App() {
  return <SafeAreaProvider><CrmApp /></SafeAreaProvider>;
}

function CrmApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('Tổng quan');
  const [booting, setBooting] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [features, setFeatures] = useState<FeatureSetting[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary>(emptyInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierTotal, setSupplierTotal] = useState(0);
  const [supplierPage, setSupplierPage] = useState(1);
  const [costs, setCosts] = useState<ProductCost[]>([]);
  const [costTotal, setCostTotal] = useState(0);
  const [costPage, setCostPage] = useState(1);
  const [costSummary, setCostSummary] = useState({ totalImports: 0, totalValue: 0, productsWithCost: 0 });
  const [selectedCostProductId, setSelectedCostProductId] = useState('');
  const [latestCost, setLatestCost] = useState<ProductCost | null>(null);
  const [supplierDetails, setSupplierDetails] = useState<Supplier | null>(null);
  const [costDetails, setCostDetails] = useState<ProductCost | null>(null);
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [online, setOnline] = useState<number | null>(null);
  const [hourly, setHourly] = useState<Array<{ hour: number; activeVisitors: number }>>([]);
  const [presenceDate, setPresenceDate] = useState(today());
  const [exportFromDate, setExportFromDate] = useState(`${today().slice(0, 7)}-01`);
  const [exportToDate, setExportToDate] = useState(today());
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [viewEvents, setViewEvents] = useState<ViewEvent[]>([]);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [viewTotal, setViewTotal] = useState('0');
  const [viewPage, setViewPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | OrderStatus>('Tất cả');
  const [orderMonth, setOrderMonth] = useState('');
  const [orderYear, setOrderYear] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [supplierStatus, setSupplierStatus] = useState('Tất cả');
  const [costSupplier, setCostSupplier] = useState('');
  const [costFrom, setCostFrom] = useState('');
  const [costTo, setCostTo] = useState('');
  const [inventoryAction, setInventoryAction] = useState<InventoryAction>('import');
  const [customerFocus, setCustomerFocus] = useState('');
  const [formKind, setFormKind] = useState<FormKind>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingCost, setEditingCost] = useState<ProductCost | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [saving, setSaving] = useState(false);
  const [viewFilters, setViewFilters] = useState(defaultViewFilters);
  const [appliedViewFilters, setAppliedViewFilters] = useState(defaultViewFilters);
  const [logAction, setLogAction] = useState('Tất cả');
  const [logSource, setLogSource] = useState('Tất cả');

  const isAdmin = user?.role === 'admin';
  const visibleScreens = useMemo(() => screens.filter((item) => isAdmin || !['Nhà cung cấp', 'Giá nhập'].includes(item.name)), [isAdmin]);

  const loadData = useCallback(async (activeToken: string, activeUser: User) => {
    setLoading(true);
    setError('');
    try {
      const [orderResult, productResult, profileResult, featureResult, logResult, onlineResult] = await Promise.allSettled([
        crmApi.getOrders(activeToken),
        crmApi.getProducts(activeToken),
        crmApi.getProfile(activeToken, activeUser.id),
        crmApi.getFeatureSettings(activeToken),
        crmApi.getHistoryLogs(activeToken),
        crmApi.getOnlinePresence(activeToken),
      ]);
      if (orderResult.status === 'rejected') throw orderResult.reason;
      const orderList = orderResult.value;
      setOrders(orderList);
      if (productResult.status === 'fulfilled') setProducts(productResult.value.products || []);
      if (profileResult.status === 'fulfilled') setProfile(profileResult.value);
      if (featureResult.status === 'fulfilled') setFeatures(featureResult.value || []);
      if (logResult.status === 'fulfilled') setLogs(logResult.value || []);
      if (onlineResult.status === 'fulfilled') setOnline(onlineResult.value.activeVisitors);
      const optionalErrors = [productResult, profileResult, featureResult, logResult, onlineResult]
        .filter((result) => result.status === 'rejected');
      if (optionalErrors.length) setError(`Đã tải đơn hàng nhưng có ${optionalErrors.length} dịch vụ phụ chưa phản hồi.`);
      const ids = Array.from(new Set(orderList.map((order) => String(order.userId))));
      const customerProfiles = await Promise.all(ids.map(async (id) => {
        try { return [id, await crmApi.getProfile(activeToken, Number(id))] as const; }
        catch { return null; }
      }));
      setProfiles(Object.fromEntries(customerProfiles.filter((entry): entry is readonly [string, Profile] => entry !== null)));
    } catch (requestError) {
      const message = asError(requestError);
      setError(message);
      if (/unauthorized|unauthenticated/i.test(message)) {
        await clearSession();
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession().then((session) => {
      if (session) {
        setToken(session.token);
        setUser(session.user);
        void loadData(session.token, session.user);
      }
    }).catch((sessionError) => setError(asError(sessionError))).finally(() => setBooting(false));
  }, [loadData]);

  useEffect(() => {
    if (!token || !/unauthorized|unauthenticated/i.test(error)) return;
    void clearSession().then(() => { setToken(null); setUser(null); });
  }, [error, token]);

  useEffect(() => {
    if (!token || screen !== 'Tổng quan') return;
    let active = true;
    const fetchPresence = async () => {
      try {
        const [current, history] = await Promise.all([
          crmApi.getOnlinePresence(token),
          crmApi.getHourlyPresence(token, presenceDate),
        ]);
        if (active) { setOnline(current.activeVisitors); setHourly(history.samples || []); }
      } catch (presenceError) {
        if (active) setError(asError(presenceError));
      }
    };
    void fetchPresence();
    const timer = setInterval(fetchPresence, 15000);
    return () => { active = false; clearInterval(timer); };
  }, [presenceDate, screen, token]);

  const loadInventory = useCallback(async () => {
    if (!token) return;
    try {
      const [summary, page] = await Promise.all([crmApi.getInventorySummary(token), crmApi.getInventory(token)]);
      setInventorySummary(summary);
      setInventory(page.items || []);
    } catch (requestError) { setError(asError(requestError)); }
  }, [token]);
  useEffect(() => { if (screen === 'Tồn kho') void loadInventory(); }, [loadInventory, screen]);

  const loadAdminData = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const [supplierPage, summary, costPage] = await Promise.all([
        crmApi.getSuppliers(token, { page: 1, limit: 100 }),
        crmApi.getCostSummary(token),
        crmApi.getProductCosts(token, { page: 1, limit: 100 }),
      ]);
      setSuppliers(supplierPage.items || []);
      setSupplierTotal(supplierPage.total);
      setSupplierPage(1);
      setCostSummary(summary);
      setCosts(costPage.items || []);
      setCostTotal(costPage.total);
      setCostPage(1);
    } catch (requestError) { setError(asError(requestError)); }
  }, [isAdmin, token]);
  useEffect(() => { if (screen === 'Nhà cung cấp' || screen === 'Giá nhập') void loadAdminData(); }, [loadAdminData, screen]);

  useEffect(() => {
    if (!token || !selectedCostProductId) { setLatestCost(null); return; }
    let active = true;
    crmApi.getLatestCost(token, Number(selectedCostProductId))
      .then((result) => { if (active) setLatestCost(result.item); })
      .catch((requestError) => { if (active) setError(asError(requestError)); });
    return () => { active = false; };
  }, [selectedCostProductId, token]);

  const loadViews = useCallback(async (page = 1, filters = appliedViewFilters) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const fromDate = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
      const toDate = filters.to ? new Date(`${filters.to}T23:59:59.999`) : null;
      if ((fromDate && Number.isNaN(fromDate.getTime())) || (toDate && Number.isNaN(toDate.getTime()))) {
        throw new Error('Ngày lọc không hợp lệ. Dùng định dạng YYYY-MM-DD.');
      }
      if (filters.from && filters.to && filters.from > filters.to) throw new Error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
      const from = fromDate?.toISOString() || '';
      const to = toDate?.toISOString() || '';
      const idSearch = /^\d+$/.test(filters.entitySearch) ? filters.entitySearch : '';
      const [eventPage, stats] = await Promise.all([
        crmApi.getViewEvents(token, {
          entityType: filters.entityType, entityId: idSearch,
          entitySearch: idSearch ? '' : filters.entitySearch, visitorId: filters.visitorId,
          sessionId: filters.sessionId, userId: filters.userId, from, to, page, limit: 25,
        }),
        crmApi.getViewStats(token, { entityType: filters.entityType, from, to }),
      ]);
      setViewEvents(eventPage.items || []);
      setViewTotal(eventPage.total || '0');
      setViewStats(stats);
      setViewPage(page);
    } catch (requestError) { setError(asError(requestError)); }
    finally { setLoading(false); }
  }, [appliedViewFilters, token]);

  const loadMoreSuppliers = async () => {
    if (!token) return;
    const nextPage = supplierPage + 1;
    try {
      const result = await crmApi.getSuppliers(token, { page: nextPage, limit: 100 });
      setSuppliers((current) => [...current, ...result.items]);
      setSupplierPage(nextPage);
    } catch (requestError) { setError(asError(requestError)); }
  };
  const loadMoreCosts = async () => {
    if (!token) return;
    const nextPage = costPage + 1;
    try {
      const result = await crmApi.getProductCosts(token, { page: nextPage, limit: 100 });
      setCosts((current) => [...current, ...result.items]);
      setCostPage(nextPage);
    } catch (requestError) { setError(asError(requestError)); }
  };

  const onRefresh = async () => {
    if (!token || !user) return;
    setRefreshing(true);
    await loadData(token, user);
    if (screen === 'Tồn kho') await loadInventory();
    if (screen === 'Nhà cung cấp' || screen === 'Giá nhập') await loadAdminData();
    if (screen === 'Lượt xem') await loadViews(viewPage, appliedViewFilters);
    setRefreshing(false);
  };

  const signIn = async () => {
    if (!username.trim() || !password) { Alert.alert('Thiếu thông tin', 'Nhập tên đăng nhập và mật khẩu.'); return; }
    setLoginBusy(true);
    setError('');
    try {
      const result = await crmApi.login(username.trim(), password);
      await saveSession(result.access_token, result.refresh_token, result.user);
      setToken(result.access_token);
      setUser(result.user);
      setScreen('Tổng quan');
      await loadData(result.access_token, result.user);
    } catch (loginError) { setError(asError(loginError)); }
    finally { setLoginBusy(false); }
  };

  const signOut = async () => {
    await clearSession();
    setToken(null); setUser(null); setOrders([]); setProfile(null);
  };

  const exportPresenceReport = async () => {
    if (!token || exportFromDate > exportToDate || exportToDate > today()) {
      setError('Khoảng ngày xuất báo cáo không hợp lệ.');
      return;
    }
    setExporting(true);
    setExportMessage('');
    setError('');
    try {
      const { samples } = await crmApi.getHourlyPresenceRange(token, exportFromDate, exportToDate);
      if (!samples.length) throw new Error('Khoảng ngày đã chọn chưa có dữ liệu online để xuất.');
      const { default: ExcelJS } = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      const sampleMap = new Map(samples.map((sample) => [`${sample.date}:${sample.hour}`, sample.activeVisitors]));
      const days: string[] = [];
      const cursor = new Date(`${exportFromDate}T00:00:00.000Z`);
      const last = new Date(`${exportToDate}T00:00:00.000Z`);
      while (cursor <= last) {
        days.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }

      const dailySheet = workbook.addWorksheet('Theo ngay');
      dailySheet.columns = [
        { header: 'Ngày', key: 'date', width: 16 },
        { header: 'Mức online cao nhất trong ngày', key: 'peakVisitors', width: 32 },
        { header: 'Giờ đạt mức cao nhất', key: 'peakHours', width: 26 },
        { header: 'Số giờ có dữ liệu', key: 'recordedHours', width: 20 },
      ];
      dailySheet.addRows(days.map((day) => {
        const daySamples = samples.filter((sample) => sample.date === day);
        const peak = daySamples.length ? Math.max(...daySamples.map((sample) => sample.activeVisitors)) : null;
        return {
          date: day,
          peakVisitors: peak,
          peakHours: peak === null ? '' : daySamples.filter((sample) => sample.activeVisitors === peak)
            .map((sample) => `${String(sample.hour).padStart(2, '0')}:00`).join(', '),
          recordedHours: daySamples.length,
        };
      }));

      const hourlySheet = workbook.addWorksheet('Theo gio');
      hourlySheet.columns = [
        { header: 'Ngày', key: 'date', width: 16 },
        { header: 'Khung giờ', key: 'hour', width: 22 },
        { header: 'Mức online cao nhất', key: 'activeVisitors', width: 24 },
      ];
      hourlySheet.addRows(days.flatMap((day) => Array.from({ length: 24 }, (_, hour) => ({
        date: day,
        hour: `${String(hour).padStart(2, '0')}:00 - ${String((hour + 1) % 24).padStart(2, '0')}:00`,
        activeVisitors: sampleMap.get(`${day}:${hour}`) ?? null,
      }))));

      for (const sheet of [dailySheet, hourlySheet]) {
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF167A62' } };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
        sheet.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + sheet.columnCount)}1` };
      }

      const output = await workbook.xlsx.writeBuffer();
      const directory = FileSystem.documentDirectory;
      if (!directory) throw new Error('Không thể truy cập thư mục lưu báo cáo trên thiết bị.');
      const fileUri = `${directory}bao-cao-online-${exportFromDate}-${exportToDate}.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, Buffer.from(output).toString('base64'), { encoding: FileSystem.EncodingType.Base64 });
      if (!await Sharing.isAvailableAsync()) throw new Error('Thiết bị hiện không hỗ trợ chia sẻ file.');
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Chia sẻ báo cáo online',
        UTI: 'com.microsoft.excel.xlsx',
      });
      setExportMessage('Đã tạo báo cáo Excel và mở bảng chia sẻ.');
    } catch (exportError) { setError(asError(exportError)); }
    finally { setExporting(false); }
  };

  const changeOrderStatus = async (order: Order, next: OrderStatus) => {
    if (!token) return;
    try {
      await crmApi.updateStatus(token, order.id, orderValues[next]);
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: orderValues[next] } : item));
    } catch (statusError) { setError(asError(statusError)); }
  };

  const openForm = (kind: Exclude<FormKind, null>, supplier?: Supplier, cost?: ProductCost) => {
    setEditingSupplier(supplier || null);
    setEditingCost(cost || null);
    setForm(kind === 'supplier' ? {
      name: supplier?.name || '', phone: supplier?.phone || '', email: supplier?.email || '',
      address: supplier?.address || '', taxCode: supplier?.taxCode || '', note: supplier?.note || '',
    } : kind === 'cost' ? {
      productId: String(cost?.productId || products[0]?.id || ''),
      supplierId: cost?.supplierId ? String(cost.supplierId) : '',
      importPrice: String(cost?.importPrice ?? ''), quantity: String(cost?.quantity ?? '1'),
      shippingFee: String(cost?.shippingFee ?? '0'), otherFee: String(cost?.otherFee ?? '0'),
      importDate: cost?.importDate ? cost.importDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
      note: cost?.note || '',
    } : kind === 'inventory' ? {
      productId: String(products[0]?.id || ''), quantity: '', note: '', reason: '',
    } : kind === 'order' ? {
      productId: String(products[0]?.id || ''), quantity: '1', total: '',
    } : { name: '', price: '', sku: '', unit: '', badge: '', moq: '1', description: '', image: '', category: '' });
    setFormKind(kind);
  };

  const updateForm = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submitForm = async () => {
    if (!token || !user || !formKind) return;
    setSaving(true);
    setError('');
    try {
      if (formKind === 'order') {
        const quantity = Number(form.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Số lượng phải là số nguyên lớn hơn 0.');
        if (!Number.isFinite(Number(form.productId)) || Number(form.productId) <= 0 || !Number.isFinite(Number(form.total)) || Number(form.total) < 0) {
          throw new Error('Chọn sản phẩm hợp lệ và nhập tổng tiền không âm.');
        }
        await crmApi.createOrder(token, user.id, Number(form.productId), Number(form.total), quantity);
        const result = await crmApi.getOrders(token);
        setOrders(result);
      } else if (formKind === 'product') {
        if (!form.name.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
          throw new Error('Tên sản phẩm và giá bán hợp lệ là bắt buộc.');
        }
        await crmApi.createProduct(token, {
          name: form.name.trim(), price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          sku: form.sku.trim(), unit: form.unit.trim(), badge: form.badge.trim(), moq: form.moq.trim(),
          description: form.description.trim(), image: form.image.trim(), category: form.category.trim() || undefined,
        });
        const result = await crmApi.getProducts(token);
        setProducts(result.products || []);
      } else if (formKind === 'inventory') {
        const quantity = Number(form.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Số lượng phải là số nguyên lớn hơn 0.');
        const data = form.inventoryAction as InventoryAction | undefined;
        const action = data || inventoryAction;
        const payload = action === 'adjust'
          ? { productId: Number(form.productId), quantityAfter: quantity, reason: form.reason || form.note || 'Điều chỉnh kho', note: form.note, createdBy: user.id }
          : { productId: Number(form.productId), quantity, note: form.note || `Thao tác ${action} từ CRM`, createdBy: user.id };
        await crmApi.inventoryAction(token, action, payload);
        await loadInventory();
      } else if (formKind === 'supplier') {
        if (!form.name.trim()) throw new Error('Tên nhà cung cấp là bắt buộc.');
        await crmApi.saveSupplier(token, {
          name: form.name.trim(), phone: form.phone.trim() || null, email: form.email.trim() || null,
          address: form.address.trim() || null, taxCode: form.taxCode.trim() || null, note: form.note.trim() || null,
        }, editingSupplier?.id);
        await loadAdminData();
      } else if (formKind === 'cost') {
        const quantity = Number(form.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Số lượng phải là số nguyên lớn hơn 0.');
        if (!Number.isFinite(Number(form.productId)) || Number(form.productId) <= 0 || !Number.isFinite(Number(form.importPrice)) || Number(form.importPrice) < 0) {
          throw new Error('Chọn sản phẩm hợp lệ và nhập giá nhập không âm.');
        }
        await crmApi.saveCost(token, {
          productId: Number(form.productId), supplierId: form.supplierId ? Number(form.supplierId) : null,
          importPrice: Number(form.importPrice), quantity, shippingFee: Number(form.shippingFee || 0),
          otherFee: Number(form.otherFee || 0), importDate: new Date(form.importDate).toISOString(), note: form.note.trim(),
        }, editingCost?.id);
        await loadAdminData();
      }
      setFormKind(null);
    } catch (submitError) { setError(asError(submitError)); }
    finally { setSaving(false); }
  };

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const customer = profiles[String(order.userId)];
    const label = customer?.full_name || customer?.username || `Khách #${order.userId}`;
    const searchable = `${order.id} ${label} ${customer?.email || ''}`.toLowerCase();
    const date = orderDateParts(order.createdAt);
    return searchable.includes(query.toLowerCase())
      && (statusFilter === 'Tất cả' || orderLabels[order.status] === statusFilter)
      && (!orderMonth || date.month === orderMonth)
      && (!orderYear || date.year === orderYear);
  }), [orderMonth, orderYear, orders, profiles, query, statusFilter]);
  const orderYears = useMemo(() => Array.from(new Set(orders.map((order) => orderDateParts(order.createdAt).year))).filter(Boolean).sort((a, b) => Number(b) - Number(a)), [orders]);
  const orderPages = Math.max(1, Math.ceil(filteredOrders.length / 10));
  const pagedOrders = filteredOrders.slice((orderPage - 1) * 10, orderPage * 10);
  useEffect(() => { setOrderPage(1); }, [query, statusFilter, orderMonth, orderYear, screen]);
  const customers = useMemo(() => Array.from(new Set(orders.map((order) => String(order.userId))))
    .map((id) => ({ id, profile: profiles[id], orders: orders.filter((order) => String(order.userId) === id) }))
    .filter((customer) => !customerFocus || customer.id === customerFocus), [customerFocus, orders, profiles]);
  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.sku || ''}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const filteredSuppliers = useMemo(() => suppliers.filter((supplier) => `${supplier.name} ${supplier.phone || ''}`.toLowerCase().includes(query.toLowerCase())
    && (supplierStatus === 'Tất cả' || (supplierStatus === 'Đang hoạt động' ? supplier.status === 1 : supplier.status !== 1))), [query, supplierStatus, suppliers]);
  const filteredCosts = useMemo(() => costs.filter((cost) => `${cost.productName} ${cost.sku || ''} ${cost.supplierName || ''}`.toLowerCase().includes(query.toLowerCase())
    && (!selectedCostProductId || String(cost.productId) === selectedCostProductId)
    && (!costSupplier || cost.supplierName === costSupplier)
    && (!costFrom || cost.importDate.slice(0, 10) >= costFrom)
    && (!costTo || cost.importDate.slice(0, 10) <= costTo)), [costFrom, costSupplier, costTo, costs, query, selectedCostProductId]);
  const filteredLogs = useMemo(() => logs.filter((log) => `${log.action} ${log.entityType} ${log.entityId} ${log.source} ${log.createdBy}`.toLowerCase().includes(query.toLowerCase()) && (logAction === 'Tất cả' || log.action === logAction) && (logSource === 'Tất cả' || log.source === logSource)), [logAction, logSource, logs, query]);
  const monthRevenue = useMemo(() => {
    const date = new Date();
    return orders.filter((order) => ['delivered', 'completed'].includes(order.status) && new Date(order.createdAt).getMonth() === date.getMonth() && new Date(order.createdAt).getFullYear() === date.getFullYear()).reduce((sum, order) => sum + Number(order.totalAmount), 0);
  }, [orders]);
  const pendingOrders = orders.filter((order) => ['pending', 'new'].includes(order.status)).length;

  if (booting) return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#167a62" /><Text style={styles.muted}>Đang khởi tạo CRM...</Text></SafeAreaView>;
  if (!token || !user) return (
    <SafeAreaView style={styles.loginPage}>
      <ExpoStatusBar style="dark" />
      <View style={styles.brandIcon}><Ionicons name="bag-handle" size={30} color="#fff" /></View>
      <Text style={styles.brandTitle}>CRM</Text>
      <Text style={styles.loginTitle}>Đăng nhập CRM</Text>
      <Text style={styles.muted}>Dùng tài khoản hiện có để kết nối dữ liệu qua Gateway.</Text>
      <Field label="Tên đăng nhập" value={username} onChangeText={setUsername} placeholder="Nhập tên đăng nhập" autoCapitalize="none" />
      <Field label="Mật khẩu" value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" secureTextEntry />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label={loginBusy ? 'Đang đăng nhập...' : 'Đăng nhập'} onPress={signIn} disabled={loginBusy} />
      <Text style={styles.loginFoot}>Kết nối an toàn đến API Gateway · Không thay đổi backend</Text>
    </SafeAreaView>
  );

  const screenContent = () => {
    if (screen === 'Tổng quan') return (
      <>
        <Text style={styles.greeting}>Chào {user.username} 👋</Text>
        <Text style={styles.muted}>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        <View style={styles.statGrid}>
          <Stat label="Doanh thu tháng" value={formatMoney(monthRevenue)} icon="trending-up-outline" />
          <Stat label="Tổng đơn hàng" value={String(orders.length)} icon="receipt-outline" />
          <Stat label="Chờ xử lý" value={String(pendingOrders)} icon="time-outline" />
          <Stat label="Khách hàng" value={String(new Set(orders.map((order) => String(order.userId))).size)} icon="people-outline" />
          <Stat label="Đang online" value={online === null ? '—' : String(online)} icon="radio-outline" />
        </View>
        <Card title="Đơn hàng gần đây" action={<LinkButton label="Tất cả" onPress={() => setScreen('Đơn hàng')} />}>
          {orders.slice(0, 5).map((order) => <OrderCard key={String(order.id)} order={order} customer={profiles[String(order.userId)]} onStatus={changeOrderStatus} />)}
          {!orders.length && <Empty label="Chưa có đơn hàng." />}
        </Card>
        <Card title="Lịch sử người đang online" subtitle="Mức online cao nhất theo giờ trong ngày">
          <Field label="Ngày xem (YYYY-MM-DD)" value={presenceDate} onChangeText={setPresenceDate} placeholder={today()} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourRow}>
            {Array.from({ length: 24 }, (_, hour) => {
              const sample = hourly.find((item) => item.hour === hour);
              const max = Math.max(1, ...hourly.map((item) => item.activeVisitors));
              return <View style={styles.hourColumn} key={hour}><Text style={styles.hourNumber}>{sample?.activeVisitors ?? '—'}</Text><View style={styles.hourTrack}><View style={[styles.hourBar, { height: sample ? `${Math.max(4, sample.activeVisitors / max * 100)}%` : 0 }]} /></View><Text style={styles.hourLabel}>{hour % 3 === 0 ? `${String(hour).padStart(2, '0')}h` : ''}</Text></View>;
            })}
          </ScrollView>
          <Text style={styles.muted}>Lấy mẫu mỗi 30 giây · cập nhật hiện tại {online ?? '—'} khách</Text>
          <View style={styles.exportRow}>
            <Field label="Xuất từ ngày" value={exportFromDate} onChangeText={setExportFromDate} placeholder="YYYY-MM-DD" />
            <Field label="Đến ngày" value={exportToDate} onChangeText={setExportToDate} placeholder="YYYY-MM-DD" />
          </View>
          <Button label={exporting ? 'Đang tạo Excel...' : 'Xuất báo cáo Excel'} icon="download-outline" onPress={() => void exportPresenceReport()} disabled={exporting} />
          {exportMessage ? <Text style={styles.success}>{exportMessage}</Text> : null}
        </Card>
      </>
    );

    if (screen === 'Đơn hàng') return (
      <>
        <Card title="Quản lý đơn hàng" subtitle={`${filteredOrders.length} đơn hàng`}>
          <Field label="Tìm mã đơn hoặc khách hàng" value={query} onChangeText={setQuery} placeholder="Tìm kiếm..." />
          <ChoiceRow values={['Tất cả', 'Mới', 'Đang xử lý', 'Đã giao', 'Đã hủy']} selected={statusFilter} onSelect={(value) => setStatusFilter(value as typeof statusFilter)} />
          <Text style={styles.fieldLabel}>Lọc tháng</Text>
          <ChoiceRow values={['Tất cả tháng', ...Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`)]} selected={orderMonth ? `Tháng ${orderMonth}` : 'Tất cả tháng'} onSelect={(value) => setOrderMonth(value === 'Tất cả tháng' ? '' : value.replace('Tháng ', ''))} />
          <Text style={styles.fieldLabel}>Lọc năm</Text>
          <ChoiceRow values={['Tất cả năm', ...orderYears]} selected={orderYear || 'Tất cả năm'} onSelect={(value) => setOrderYear(value === 'Tất cả năm' ? '' : value)} />
          <LinkButton label="Đặt lại bộ lọc" onPress={() => { setQuery(''); setStatusFilter('Tất cả'); setOrderMonth(''); setOrderYear(''); }} />
          <Button label="Tạo đơn hàng" icon="add" onPress={() => openForm('order')} />
          {pagedOrders.map((order) => <OrderCard key={String(order.id)} order={order} customer={profiles[String(order.userId)]} onStatus={changeOrderStatus} />)}
          {!filteredOrders.length && <Empty label="Không tìm thấy đơn hàng." />}
          <View style={styles.actions}><LinkButton label="← Trước" disabled={orderPage <= 1} onPress={() => setOrderPage((page) => Math.max(1, page - 1))} /><Text style={styles.muted}>Trang {orderPage} / {orderPages} · {filteredOrders.length} đơn</Text><LinkButton label="Tiếp →" disabled={orderPage >= orderPages} onPress={() => setOrderPage((page) => Math.min(orderPages, page + 1))} /></View>
        </Card>
      </>
    );

    if (screen === 'Khách hàng') return (
      <Card title="Khách hàng" subtitle={`${customers.length} khách hàng từ đơn hàng`}>
        <Field label="Lọc theo mã khách hàng" value={customerFocus || query} onChangeText={(value) => { setCustomerFocus(''); setQuery(value); }} placeholder="Tên, email hoặc mã khách hàng" />
        {customerFocus ? <LinkButton label="Xem tất cả khách hàng" onPress={() => setCustomerFocus('')} /> : null}
        {customers.map(({ id, profile: customer, orders: customerOrders }) => {
          const spend = customerOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
          const latest = customerOrders.reduce((recent, order) => !recent || order.createdAt > recent.createdAt ? order : recent, undefined as Order | undefined);
          const name = customer?.full_name || customer?.username || `Khách hàng #${id}`;
          if (query && !`${name} ${customer?.email || ''} ${id}`.toLowerCase().includes(query.toLowerCase())) return null;
          return <View style={styles.customerRow} key={id}><View style={styles.avatar}><Text style={styles.avatarText}>{initials(name)}</Text></View><View style={styles.flex}><Text style={styles.cardTitle}>{name}</Text><Text style={styles.muted}>{customer?.email || 'Chưa có email'} · {id}</Text><Text style={styles.detailText}>{customerOrders.length} đơn · Gần nhất {formatDate(latest?.createdAt)}</Text><Text style={styles.money}>{formatMoney(spend)}</Text></View></View>;
        })}
        {!orders.length && <Empty label="Chưa có dữ liệu khách hàng." />}
      </Card>
    );

    if (screen === 'Sản phẩm') return (
      <Card title="Quản lý sản phẩm" subtitle={`${products.length} sản phẩm`}>
        <Field label="Tìm sản phẩm" value={query} onChangeText={setQuery} placeholder="Tên sản phẩm hoặc SKU..." />
        <Button label="Thêm sản phẩm" icon="add" onPress={() => openForm('product')} />
        {filteredProducts.map((product) => <View style={styles.itemRow} key={product.id}><View style={styles.productIcon}><Ionicons name="cube-outline" size={21} color="#167a62" /></View><View style={styles.flex}><Text style={styles.cardTitle}>{product.name}</Text><Text style={styles.muted}>{product.sku || `SP-${product.id}`} · {product.unit || 'Chưa có đơn vị'}</Text><Text style={styles.detailText}>{product.description || 'Không có mô tả'}</Text><Text style={styles.money}>{formatMoney(product.price)}</Text>{product.badge ? <Text style={styles.badge}>{product.badge}</Text> : null}</View>        {isAdmin && <LinkButton label="Giá nhập" onPress={() => { setQuery(product.name); setSelectedCostProductId(String(product.id)); setScreen('Giá nhập'); }} />}</View>)}
        {!filteredProducts.length && <Empty label="Chưa có sản phẩm phù hợp." />}
      </Card>
    );

    if (screen === 'Tồn kho') return (
      <>
        <View style={styles.statGrid}>
          <Stat label="Sản phẩm quản lý" value={String(inventorySummary.totalProducts)} icon="cube-outline" />
          <Stat label="Tổng tồn thực tế" value={String(inventorySummary.totalOnHand)} icon="layers-outline" />
          <Stat label="Sắp hết hàng" value={String(inventorySummary.lowStockItems)} icon="alert-circle-outline" />
          <Stat label="Hết hàng" value={String(inventorySummary.outOfStockItems)} icon="close-circle-outline" />
        </View>
        <Card title="Thao tác kho" subtitle="Nhập, điều chỉnh, giữ chỗ, giải phóng, bán hoặc trả hàng">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceScroll}>
            {inventoryActions.map((action) => <Pill key={action.id} label={action.label} selected={inventoryAction === action.id} onPress={() => setInventoryAction(action.id)} />)}
          </ScrollView>
          <Button label={inventoryActions.find((item) => item.id === inventoryAction)?.label || 'Thao tác kho'} icon="add" onPress={() => openForm('inventory')} />
          {inventorySummary.hasCostData && <Text style={styles.detailText}>Giá trị tồn kho theo giá vốn: {formatMoney(inventorySummary.inventoryValue)}</Text>}
        </Card>
        <Card title="Danh sách tồn kho">
          {inventory.map((item) => <View style={styles.itemRow} key={item.id}><View style={styles.flex}><Text style={styles.cardTitle}>{item.productName}</Text><Text style={styles.muted}>{item.sku || `SP-${item.productId}`} · {item.category || 'Chưa phân loại'}</Text><Text style={styles.detailText}>Tồn {item.quantityOnHand} · Giữ chỗ {item.quantityReserved} · Có thể bán {item.quantityAvailable}</Text><Text style={[styles.badge, item.status === 'Hết hàng' ? styles.badgeRed : item.status === 'Sắp hết hàng' ? styles.badgeAmber : null]}>{item.status}</Text></View></View>)}
          {!inventory.length && <Empty label="Chưa có dữ liệu tồn kho." />}
          <LinkButton label="Tải lại tồn kho" onPress={() => void loadInventory()} />
        </Card>
      </>
    );

    if (screen === 'Nhà cung cấp') return (
      <Card title="Nhà cung cấp" subtitle={`${suppliers.length} nhà cung cấp đã tải`}>
        <Field label="Tìm nhà cung cấp" value={query} onChangeText={setQuery} placeholder="Tên hoặc số điện thoại..." />
        <ChoiceRow values={['Tất cả', 'Đang hoạt động', 'Đã khóa']} selected={supplierStatus} onSelect={setSupplierStatus} />
        <Button label="Thêm nhà cung cấp" icon="add" onPress={() => openForm('supplier')} />
        {filteredSuppliers.map((supplier) => <View style={styles.itemRow} key={supplier.id}><View style={styles.flex}><Text style={styles.cardTitle}>{supplier.name}</Text><Text style={styles.muted}>{supplier.phone || 'Chưa có số điện thoại'} · {supplier.email || 'Chưa có email'}</Text><Text style={styles.detailText}>{supplier.address || 'Chưa có địa chỉ'}</Text><Text style={[styles.badge, supplier.status === 1 ? null : styles.badgeRed]}>{supplier.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}</Text></View><View style={styles.actions}><LinkButton label="Chi tiết" onPress={async () => { try { setSupplierDetails(await crmApi.getSupplier(token, supplier.id)); } catch (e) { setError(asError(e)); } }} /><LinkButton label="Sửa" onPress={() => openForm('supplier', supplier)} /><LinkButton label={supplier.status === 1 ? 'Khóa' : 'Mở'} onPress={async () => { try { await crmApi.setSupplierStatus(token, supplier.id, supplier.status === 1 ? 0 : 1); await loadAdminData(); } catch (e) { setError(asError(e)); } }} /></View></View>)}
        {!filteredSuppliers.length && <Empty label="Chưa có nhà cung cấp phù hợp." />}
        {supplierTotal > suppliers.length ? <Button label={`Tải thêm (${suppliers.length}/${supplierTotal})`} variant="secondary" onPress={() => void loadMoreSuppliers()} /> : null}
      </Card>
    );

    if (screen === 'Giá nhập') return (
      <>
        <View style={styles.statGrid}>
          <Stat label="Số lần nhập" value={String(costSummary.totalImports)} icon="repeat-outline" />
          <Stat label="Tổng giá trị nhập" value={formatMoney(costSummary.totalValue)} icon="cash-outline" />
          <Stat label="Sản phẩm có giá nhập" value={String(costSummary.productsWithCost)} icon="cube-outline" />
        </View>
        <Card title="Lịch sử giá nhập" subtitle="Giá vốn được theo dõi riêng, không làm thay đổi tồn kho">
          <Field label="Tìm sản phẩm / SKU / nhà cung cấp" value={query} onChangeText={setQuery} placeholder="Tìm kiếm..." />
          <Field label="Mã sản phẩm (để trống = tất cả)" value={selectedCostProductId} onChangeText={setSelectedCostProductId} keyboardType="numeric" placeholder="ID sản phẩm" />
          {selectedCostProductId ? <View style={styles.costHighlight}><Text style={styles.detailText}>Giá bán hiện tại: {formatMoney(products.find((product) => product.id === Number(selectedCostProductId))?.price || 0)}</Text><Text style={styles.detailText}>Giá nhập gần nhất: {latestCost ? formatMoney(latestCost.importPrice) : 'Chưa có dữ liệu'}</Text><Text style={styles.detailText}>Nhà cung cấp gần nhất: {latestCost?.supplierName || '—'}</Text><Text style={styles.detailText}>Giá vốn / đơn vị: {latestCost ? formatMoney(latestCost.unitCost) : '—'}</Text><Text style={styles.detailText}>Lợi nhuận dự kiến: {latestCost ? formatMoney(latestCost.expectedProfit) : '—'}{latestCost?.profitMarginPercent === null ? ' · Chưa thể tính tỷ suất' : latestCost?.profitMarginPercent !== undefined ? ` · Tỷ suất ${latestCost.profitMarginPercent.toFixed(1)}%` : ''}</Text></View> : null}
          <Text style={styles.fieldLabel}>Lọc nhà cung cấp</Text>
          <ChoiceRow values={['Tất cả nhà cung cấp', ...Array.from(new Set(costs.map((cost) => cost.supplierName).filter((name): name is string => Boolean(name))))]} selected={costSupplier || 'Tất cả nhà cung cấp'} onSelect={(value) => setCostSupplier(value === 'Tất cả nhà cung cấp' ? '' : value)} />
          <View style={styles.exportRow}><Field label="Từ ngày" value={costFrom} onChangeText={setCostFrom} placeholder="YYYY-MM-DD" /><Field label="Đến ngày" value={costTo} onChangeText={setCostTo} placeholder="YYYY-MM-DD" /></View>
          <LinkButton label="Đặt lại bộ lọc" onPress={() => { setQuery(''); setCostSupplier(''); setCostFrom(''); setCostTo(''); }} />
          <Button label="Ghi nhận giá nhập" icon="add" onPress={() => openForm('cost')} />
          {filteredCosts.map((cost) => <View style={styles.itemRow} key={cost.id}><View style={styles.flex}><Text style={styles.cardTitle}>{cost.productName}</Text><Text style={styles.muted}>{cost.sku || `SP-${cost.productId}`} · {cost.supplierName || 'Không có nhà cung cấp'}</Text><Text style={styles.detailText}>Giá nhập {formatMoney(cost.importPrice)} · SL {cost.quantity} · Phí {formatMoney(cost.shippingFee + cost.otherFee)}</Text><Text style={styles.money}>Tổng {formatMoney(cost.totalValue)} · {formatDate(cost.importDate)}</Text><View style={styles.actions}><LinkButton label="Chi tiết" onPress={async () => { try { setCostDetails(await crmApi.getProductCost(token, cost.id)); } catch (e) { setError(asError(e)); } }} /><LinkButton label="Sửa" onPress={() => openForm('cost', undefined, cost)} /></View></View></View>)}
          {!filteredCosts.length && <Empty label="Chưa có lịch sử giá nhập phù hợp." />}
          {costTotal > costs.length ? <Button label={`Tải thêm (${costs.length}/${costTotal})`} variant="secondary" onPress={() => void loadMoreCosts()} /> : null}
        </Card>
      </>
    );

    if (screen === 'Lượt xem') return (
      <Card title="Quan tâm của khách hàng" subtitle="Lượt xem danh mục, thương hiệu và sản phẩm; không phải đơn hàng">
        <Field label="Từ ngày (YYYY-MM-DD)" value={viewFilters.from} onChangeText={(value) => setViewFilters((current) => ({ ...current, from: value }))} placeholder="2026-01-01" />
        <Field label="Đến ngày (YYYY-MM-DD)" value={viewFilters.to} onChangeText={(value) => setViewFilters((current) => ({ ...current, to: value }))} placeholder={today()} />
        <Text style={styles.fieldLabel}>Loại đối tượng</Text>
        <ChoiceRow values={['Tất cả', 'Danh mục', 'Thương hiệu', 'Sản phẩm']} selected={({ category: 'Danh mục', brand: 'Thương hiệu', product: 'Sản phẩm' } as Record<string, string>)[viewFilters.entityType] || 'Tất cả'} onSelect={(value) => setViewFilters((current) => ({ ...current, entityType: ({ 'Danh mục': 'category', 'Thương hiệu': 'brand', 'Sản phẩm': 'product' } as Record<string, string>)[value] || '' }))} />
        <Field label="Mã hoặc tên đối tượng" value={viewFilters.entitySearch} onChangeText={(value) => setViewFilters((current) => ({ ...current, entitySearch: value }))} />
        <Field label="Mã khách truy cập" value={viewFilters.visitorId} onChangeText={(value) => setViewFilters((current) => ({ ...current, visitorId: value }))} />
        <Field label="Mã phiên" value={viewFilters.sessionId} onChangeText={(value) => setViewFilters((current) => ({ ...current, sessionId: value }))} />
        <Field label="Mã khách hàng" value={viewFilters.userId} onChangeText={(value) => setViewFilters((current) => ({ ...current, userId: value }))} keyboardType="numeric" />
        <View style={styles.actions}><Button label="Lọc dữ liệu" icon="search" onPress={() => { setAppliedViewFilters(viewFilters); void loadViews(1, viewFilters); }} /><LinkButton label="Đặt lại" onPress={() => { const defaults = defaultViewFilters(); setViewFilters(defaults); setAppliedViewFilters(defaults); void loadViews(1, defaults); }} /></View>
        <View style={styles.statGrid}><Stat label="Tổng lượt xem" value={viewStats?.totalViews || '0'} icon="eye-outline" /><Stat label="Khách truy cập duy nhất" value={viewStats?.uniqueVisitors || '0'} icon="people-outline" /></View>
        {viewStats?.topEntities?.map((entity) => <View style={styles.compactRow} key={`${entity.entityType}-${entity.entityId}`}><Text style={styles.flex}>{entity.entityName || `#${entity.entityId}`} · {entity.entityType}</Text><Text style={styles.cardTitle}>{entity.views} lượt</Text></View>)}
        <Text style={styles.sectionTitle}>Lượt xem theo ngày</Text>
        {viewStats?.dailyViews?.map((item) => <View style={styles.compactRow} key={item.date}><Text style={styles.flex}>{new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN')}</Text><Text style={styles.cardTitle}>{item.views} lượt</Text></View>)}
        <Text style={styles.sectionTitle}>Lịch sử xem · {viewTotal} sự kiện</Text>
        {viewEvents.map((event) => <View style={styles.itemRow} key={event.viewEventId}><View style={styles.flex}><Text style={styles.cardTitle}>{event.entityName || `${event.entityType} #${event.entityId}`}</Text><Text style={styles.muted}>{formatDate(event.viewedAt)} · {event.visitorId || 'Khách ẩn danh'}</Text><Text style={styles.detailText}>Phiên: {event.sessionId || '—'} · Trang: {event.pageUrl || '—'}</Text></View>{event.userId ? <LinkButton label={`KH #${event.userId}`} onPress={() => { setCustomerFocus(event.userId); setQuery(''); setScreen('Khách hàng'); }} /> : null}</View>)}
        {!viewEvents.length && <Empty label={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy lượt xem.'} />}
        <View style={styles.actions}><LinkButton label="← Trước" disabled={viewPage <= 1} onPress={() => void loadViews(Math.max(1, viewPage - 1))} /><Text style={styles.muted}>Trang {viewPage} / {Math.max(1, Math.ceil(Number(viewTotal) / 25))}</Text><LinkButton label="Tiếp →" disabled={viewPage >= Math.ceil(Number(viewTotal) / 25)} onPress={() => void loadViews(viewPage + 1)} /></View>
      </Card>
    );

    if (screen === 'Nhật ký') return (
      <Card title="Nhật ký hoạt động" subtitle={`${filteredLogs.length} bản ghi`}>
        <Field label="Tìm hoạt động" value={query} onChangeText={setQuery} placeholder="Đối tượng, service, người tạo..." />
        <ChoiceRow values={['Tất cả', 'CREATE', 'UPDATE']} selected={logAction} onSelect={setLogAction} />
        <Field label="Lọc service (để trống = tất cả)" value={logSource === 'Tất cả' ? '' : logSource} onChangeText={(value) => setLogSource(value || 'Tất cả')} placeholder="Tên service" />
        <LinkButton label="Tải lại nhật ký" onPress={async () => { try { setLogs(await crmApi.getHistoryLogs(token)); } catch (e) { setError(asError(e)); } }} />
        {filteredLogs.map((log) => <View style={styles.itemRow} key={`${log.source}-${log.id}`}><View style={styles.flex}><Text style={styles.cardTitle}>{log.action} · {log.entityType} #{log.entityId}</Text><Text style={styles.muted}>{formatDate(log.createdAt)} · {log.source}</Text><Text style={styles.detailText}>Người tạo: {log.createdBy}</Text>{log.metadata ? <Text style={styles.detailText}>{JSON.stringify(log.metadata)}</Text> : null}</View></View>)}
        {!filteredLogs.length && <Empty label="Chưa có nhật ký phù hợp." />}
      </Card>
    );

    if (screen === 'Cài đặt') return (
      <>
        <Card title="Hồ sơ tài khoản">
          <Field label="Tên đăng nhập" value={profile?.username || user.username} onChangeText={() => undefined} editable={false} />
          <Field label="Vai trò" value={profile?.role || user.role || 'Nhân viên'} onChangeText={() => undefined} editable={false} />
          <Field label="Họ và tên" value={form.profileName ?? profile?.full_name ?? ''} onChangeText={(value) => updateForm('profileName', value)} placeholder="Nguyễn Văn An" />
          <Field label="Email" value={form.profileEmail ?? profile?.email ?? ''} onChangeText={(value) => updateForm('profileEmail', value)} keyboardType="email-address" />
          <Field label="Số điện thoại" value={form.profilePhone ?? profile?.phone ?? ''} onChangeText={(value) => updateForm('profilePhone', value)} keyboardType="phone-pad" />
          <Button label="Lưu hồ sơ" onPress={async () => { try { const updated = await crmApi.updateProfile(token, user.id, { full_name: form.profileName ?? profile?.full_name ?? '', email: form.profileEmail ?? profile?.email ?? '', phone: form.profilePhone ?? profile?.phone ?? '' }); setProfile(updated); Alert.alert('Đã lưu', 'Thông tin hồ sơ đã được cập nhật.'); } catch (e) { setError(asError(e)); } }} />
        </Card>
        <Card title="Tính năng hệ thống">
          {features.length ? features.map((feature) => <View style={styles.compactRow} key={feature.featureKey}><View style={styles.flex}><Text style={styles.cardTitle}>{feature.featureName}</Text><Text style={styles.muted}>{feature.featureKey}</Text></View><Pill label={feature.isEnabled ? 'Bật' : 'Tắt'} selected={feature.isEnabled} onPress={async () => { try { const updated = await crmApi.updateFeatureSetting(token, feature.featureKey, !feature.isEnabled); setFeatures((current) => current.map((item) => item.featureKey === feature.featureKey ? updated : item)); } catch (e) { setError(asError(e)); } }} /></View>) : <Empty label="Chưa có feature setting để cấu hình." />}
        </Card>
        <Button label="Đăng xuất" icon="log-out-outline" variant="secondary" onPress={() => Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [{ text: 'Huỷ', style: 'cancel' }, { text: 'Đăng xuất', style: 'destructive', onPress: () => void signOut() }])} />
      </>
    );

    return <Card title="Trợ giúp & Hỗ trợ"><Text style={styles.cardTitle}>Cập nhật trạng thái đơn?</Text><Text style={styles.detailText}>Vào Đơn hàng, chọn trạng thái mới trên từng thẻ đơn. Thay đổi được gửi trực tiếp qua Gateway.</Text><Text style={styles.cardTitle}>Sản phẩm chưa hiển thị?</Text><Text style={styles.detailText}>Kiểm tra Product Service và kết nối Gateway, sau đó kéo xuống để tải lại dữ liệu.</Text><Text style={styles.cardTitle}>Dữ liệu khách hàng lấy từ đâu?</Text><Text style={styles.detailText}>CRM tổng hợp hồ sơ khách hàng từ user-profile của các đơn hàng.</Text><Text style={styles.muted}>Liên hệ hỗ trợ: support@mokcrm.local</Text></Card>;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ExpoStatusBar style="dark" />
      <View style={styles.topbar}>
        <View><Text style={styles.topTitle}>CRM</Text><Text style={styles.topSubtitle}>{user.username}{isAdmin ? ' · Admin' : ''}</Text></View>
        <Pressable onPress={() => void onRefresh()} style={styles.iconButton}><Ionicons name="refresh-outline" size={21} color="#167a62" /></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabs}>
        {visibleScreens.map((item) => <Pressable key={item.name} hitSlop={{ top: 5, bottom: 5 }} accessibilityLabel={item.name} onPress={() => { setScreen(item.name); setQuery(''); if (item.name === 'Lượt xem') void loadViews(1, appliedViewFilters); }} style={[styles.tab, screen === item.name && styles.tabActive]}><Ionicons name={item.icon} size={12} color={screen === item.name ? '#fff' : '#56716a'} /><Text style={[styles.tabText, screen === item.name && styles.tabTextActive]}>{item.name}</Text></Pressable>)}
      </ScrollView>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor="#167a62" />}
        keyboardShouldPersistTaps="handled"
      >
        {error ? <Pressable onPress={() => setError('')} style={styles.errorBox}><Text style={styles.error}>{error}  ·  Nhấn để đóng</Text></Pressable> : null}
        {loading && screen !== 'Tổng quan' ? <ActivityIndicator color="#167a62" style={styles.loader} /> : null}
        {screenContent()}
        <Text style={styles.footer}>CRM Mobile · Dữ liệu đồng bộ từ Gateway</Text>
      </ScrollView>
      <Modal visible={formKind !== null} transparent animationType="slide" onRequestClose={() => setFormKind(null)}>
        <KeyboardAvoidingView style={styles.modalShade} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}><Text style={styles.sectionTitle}>{formTitle(formKind, editingSupplier, editingCost)}</Text><Pressable onPress={() => setFormKind(null)}><Ionicons name="close" size={24} color="#52645f" /></Pressable></View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <FormFields kind={formKind} form={form} products={products} suppliers={suppliers} inventoryAction={inventoryAction} onChange={updateForm} onAction={setInventoryAction} />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <Button label={saving ? 'Đang lưu...' : formKind === 'inventory' ? `Xác nhận ${inventoryActions.find((item) => item.id === inventoryAction)?.label.toLowerCase()}` : 'Lưu thay đổi'} onPress={() => void submitForm()} disabled={saving} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={supplierDetails !== null} transparent animationType="fade" onRequestClose={() => setSupplierDetails(null)}>
        <View style={styles.detailModalShade}><View style={styles.detailModal}><View style={styles.modalHeader}><Text style={styles.sectionTitle}>{supplierDetails?.name || 'Nhà cung cấp'}</Text><Pressable onPress={() => setSupplierDetails(null)}><Ionicons name="close" size={24} color="#52645f" /></Pressable></View>{supplierDetails ? <><Text style={styles.detailText}>Trạng thái: {supplierDetails.status === 1 ? 'Hoạt động' : 'Đã khóa'}</Text><Text style={styles.detailText}>Điện thoại: {supplierDetails.phone || '—'}</Text><Text style={styles.detailText}>Email: {supplierDetails.email || '—'}</Text><Text style={styles.detailText}>Địa chỉ: {supplierDetails.address || '—'}</Text><Text style={styles.detailText}>Mã số thuế: {supplierDetails.taxCode || '—'}</Text><Text style={styles.detailText}>Ghi chú: {supplierDetails.note || '—'}</Text><Text style={styles.detailText}>Ngày tạo: {formatDate(supplierDetails.createdAt)}</Text></> : null}</View></View>
      </Modal>
      <Modal visible={costDetails !== null} transparent animationType="fade" onRequestClose={() => setCostDetails(null)}>
        <View style={styles.detailModalShade}><View style={styles.detailModal}><View style={styles.modalHeader}><Text style={styles.sectionTitle}>{costDetails?.productName || 'Chi tiết giá nhập'}</Text><Pressable onPress={() => setCostDetails(null)}><Ionicons name="close" size={24} color="#52645f" /></Pressable></View>{costDetails ? <><Text style={styles.detailText}>SKU: {costDetails.sku || `SP-${costDetails.productId}`}</Text><Text style={styles.detailText}>Nhà cung cấp: {costDetails.supplierName || '—'}</Text><Text style={styles.detailText}>Giá nhập đơn vị: {formatMoney(costDetails.importPrice)}</Text><Text style={styles.detailText}>Số lượng: {costDetails.quantity}</Text><Text style={styles.detailText}>Phí vận chuyển: {formatMoney(costDetails.shippingFee)}</Text><Text style={styles.detailText}>Chi phí khác: {formatMoney(costDetails.otherFee)}</Text><Text style={styles.detailText}>Tổng giá trị: {formatMoney(costDetails.totalValue)}</Text><Text style={styles.detailText}>Giá vốn / đơn vị: {formatMoney(costDetails.unitCost)}</Text><Text style={styles.detailText}>Ngày nhập: {formatDate(costDetails.importDate)}</Text><Text style={styles.detailText}>Ghi chú: {costDetails.note || '—'}</Text></> : null}</View></View>
      </Modal>
    </SafeAreaView>
  );
}

function formTitle(kind: FormKind, supplier: Supplier | null, cost: ProductCost | null): string {
  if (kind === 'order') return 'Tạo đơn hàng';
  if (kind === 'product') return 'Thêm sản phẩm';
  if (kind === 'inventory') return 'Thao tác kho';
  if (kind === 'supplier') return supplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp';
  if (kind === 'cost') return cost ? 'Chỉnh sửa giá nhập' : 'Ghi nhận giá nhập';
  return '';
}

function FormFields(props: { kind: FormKind; form: FormState; products: Product[]; suppliers: Supplier[]; inventoryAction: InventoryAction; onChange: (key: string, value: string) => void; onAction: (action: InventoryAction) => void }) {
  const { kind, form, products, suppliers, inventoryAction, onChange } = props;
  const field = (key: string, label: string, options: { number?: boolean; multiline?: boolean; secure?: boolean } = {}) => <Field key={key} label={label} value={form[key] || ''} onChangeText={(value) => onChange(key, value)} keyboardType={options.number ? 'numeric' : 'default'} multiline={options.multiline} secureTextEntry={options.secure} />;
  const productChoice = <View key="product-choice"><Text style={styles.fieldLabel}>Sản phẩm (ID)</Text><ScrollView style={styles.selectList} nestedScrollEnabled>{products.map((product) => <Pressable key={product.id} onPress={() => onChange('productId', String(product.id))} style={[styles.selectOption, form.productId === String(product.id) && styles.selectOptionActive]}><Text style={styles.detailText}>{product.name} · #{product.id}</Text></Pressable>)}</ScrollView></View>;
  if (kind === 'order') return <>{productChoice}{field('quantity', 'Số lượng', { number: true })}{field('total', 'Tổng tiền (VND)', { number: true })}</>;
  if (kind === 'product') return <>{field('name', 'Tên sản phẩm')}{field('price', 'Giá bán (VND)', { number: true })}{field('oldPrice', 'Giá cũ (không bắt buộc)', { number: true })}{field('sku', 'SKU')}{field('unit', 'Đơn vị')}{field('badge', 'Nhãn')}{field('moq', 'MOQ')}{field('category', 'Mã danh mục')}{field('description', 'Mô tả', { multiline: true })}{field('image', 'URL ảnh')}</>;
  if (kind === 'inventory') return <><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceScroll}>{inventoryActions.map((action) => <Pill key={action.id} label={action.label} selected={inventoryAction === action.id} onPress={() => props.onAction(action.id)} />)}</ScrollView>{productChoice}{field('quantity', inventoryAction === 'adjust' ? 'Tồn kho sau kiểm kê' : 'Số lượng', { number: true })}{inventoryAction === 'adjust' ? field('reason', 'Lý do') : null}{field('note', 'Ghi chú')}</>;
  if (kind === 'supplier') return <>{field('name', 'Tên nhà cung cấp')}{field('phone', 'Số điện thoại', { number: true })}{field('email', 'Email')}{field('address', 'Địa chỉ')}{field('taxCode', 'Mã số thuế')}{field('note', 'Ghi chú', { multiline: true })}</>;
  if (kind === 'cost') return <>{productChoice}<Text style={styles.fieldLabel}>Nhà cung cấp (ID)</Text><ScrollView style={styles.selectList} nestedScrollEnabled>{[{ id: '', name: 'Không chọn nhà cung cấp' }, ...suppliers.filter((supplier) => supplier.status === 1)].map((supplier) => <Pressable key={String(supplier.id)} onPress={() => onChange('supplierId', String(supplier.id))} style={[styles.selectOption, form.supplierId === String(supplier.id) && styles.selectOptionActive]}><Text style={styles.detailText}>{supplier.name}</Text></Pressable>)}</ScrollView>{field('importPrice', 'Giá nhập đơn vị (VND)', { number: true })}{field('quantity', 'Số lượng', { number: true })}{field('shippingFee', 'Phí vận chuyển', { number: true })}{field('otherFee', 'Chi phí khác', { number: true })}{field('importDate', 'Ngày nhập (ISO / YYYY-MM-DDTHH:mm)')}{field('note', 'Ghi chú', { multiline: true })}</>;
  return null;
}

function Field(props: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'; editable?: boolean; multiline?: boolean; autoCapitalize?: 'none' | 'sentences' | 'words' }) {
  return <View style={styles.fieldWrap}><Text style={styles.fieldLabel}>{props.label}</Text><TextInput
    value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder || ''} placeholderTextColor="#9aaca6"
    secureTextEntry={props.secureTextEntry} keyboardType={props.keyboardType || 'default'} editable={props.editable}
    multiline={props.multiline} autoCapitalize={props.autoCapitalize} style={[styles.input, props.multiline && styles.multiline, props.editable === false && styles.inputDisabled]}
  /></View>;
}

function Button(props: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary'; disabled?: boolean }) {
  return <Pressable onPress={props.onPress} disabled={props.disabled} style={[styles.button, props.variant === 'secondary' && styles.buttonSecondary, props.disabled && styles.disabled]}>{props.icon ? <Ionicons name={props.icon} size={18} color={props.variant === 'secondary' ? '#167a62' : '#fff'} /> : null}<Text style={[styles.buttonText, props.variant === 'secondary' && styles.buttonTextSecondary]}>{props.label}</Text></Pressable>;
}
function LinkButton(props: { label: string; onPress: () => void; disabled?: boolean }) { return <Pressable onPress={props.onPress} disabled={props.disabled} style={styles.linkButton}><Text style={[styles.linkText, props.disabled && styles.disabledText]}>{props.label}</Text></Pressable>; }
function Pill(props: { label: string; selected: boolean; onPress: () => void }) { return <Pressable onPress={props.onPress} style={[styles.pill, props.selected && styles.pillActive]}><Text style={[styles.pillText, props.selected && styles.pillTextActive]}>{props.label}</Text></Pressable>; }
function ChoiceRow(props: { values: string[]; selected: string; onSelect: (value: string) => void }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceScroll}>{props.values.map((value) => <Pill key={value} label={value} selected={props.selected === value} onPress={() => props.onSelect(value)} />)}</ScrollView>; }
function Card(props: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) { return <View style={styles.card}><View style={styles.cardHeader}><View style={styles.flex}><Text style={styles.sectionTitle}>{props.title}</Text>{props.subtitle ? <Text style={styles.muted}>{props.subtitle}</Text> : null}</View>{props.action}</View>{props.children}</View>; }
function Stat(props: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) { return <View style={styles.statCard}><View style={styles.statIcon}><Ionicons name={props.icon} size={18} color="#167a62" /></View><Text style={styles.statLabel}>{props.label}</Text><Text style={styles.statValue}>{props.value}</Text></View>; }
function Empty(props: { label: string }) { return <View style={styles.empty}><Text style={styles.muted}>{props.label}</Text></View>; }

function OrderCard(props: { order: Order; customer?: Profile; onStatus: (order: Order, status: OrderStatus) => void }) {
  const name = props.customer?.full_name || props.customer?.username || `Khách hàng #${props.order.userId}`;
  const status = orderLabels[props.order.status] || 'Mới';
  return <View style={styles.orderCard}><View style={styles.orderTop}><View style={styles.flex}><Text style={styles.orderId}>#DH-{props.order.id}</Text><Text style={styles.cardTitle}>{name}</Text><Text style={styles.muted}>{props.customer?.email || 'Chưa có email'}</Text></View><Text style={[styles.badge, status === 'Đã hủy' ? styles.badgeRed : status === 'Mới' ? styles.badgeAmber : null]}>{status}</Text></View><View style={styles.orderBottom}><Text style={styles.detailText}>{props.order.orderLines?.reduce((sum, line) => sum + line.quantity, 0) || 0} sản phẩm · {formatDate(props.order.createdAt)}</Text><Text style={styles.money}>{formatMoney(props.order.totalAmount)}</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusChoices}>{(['Mới', 'Đang xử lý', 'Đã giao', 'Đã hủy'] as const).map((value) => <Pill key={value} label={value} selected={value === status} onPress={() => props.onStatus(props.order, value)} />)}</ScrollView></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f5', gap: 12 },
  loginPage: { flex: 1, backgroundColor: '#f4f7f5', paddingHorizontal: 24, justifyContent: 'center' },
  brandIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#167a62', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  brandTitle: { color: '#167a62', fontSize: 28, fontWeight: '800', marginBottom: 26 },
  loginTitle: { color: '#163d33', fontWeight: '800', fontSize: 28, marginBottom: 8 },
  loginFoot: { color: '#879890', fontSize: 12, textAlign: 'center', marginTop: 26 },
  topbar: { height: 62, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e3ece7' },
  topTitle: { color: '#167a62', fontWeight: '900', fontSize: 21, letterSpacing: 0.4 },
  topSubtitle: { color: '#71847c', fontSize: 11, marginTop: 1 },
  iconButton: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef7f3' },
  tabBar: { height: 32, flexGrow: 0, flexShrink: 0, backgroundColor: '#fff' },
  tabs: { paddingHorizontal: 10, gap: 6, alignItems: 'center', backgroundColor: '#fff' },
  tab: { minHeight: 22, flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#f4f7f5' },
  tabActive: { backgroundColor: '#167a62' },
  tabText: { color: '#56716a', fontWeight: '600', fontSize: 11 },
  tabTextActive: { color: '#fff' },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 38, gap: 14 },
  greeting: { color: '#173d33', fontWeight: '800', fontSize: 25, marginTop: 4 },
  muted: { color: '#82938d', fontSize: 12, lineHeight: 18, marginTop: 3 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#e8eeeb', marginBottom: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  sectionTitle: { color: '#193e34', fontSize: 17, fontWeight: '800' },
  cardTitle: { color: '#203d35', fontSize: 14, fontWeight: '700' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '48%', flexGrow: 1, minHeight: 103, borderRadius: 16, padding: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e8eeeb' },
  statIcon: { width: 31, height: 31, borderRadius: 11, backgroundColor: '#eaf5f0', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statLabel: { color: '#73857e', fontSize: 11, fontWeight: '600' },
  statValue: { color: '#193e34', fontSize: 18, fontWeight: '800', marginTop: 3 },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { color: '#51665e', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { minHeight: 46, borderWidth: 1, borderColor: '#dfe9e4', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#fbfdfc', color: '#183d32', fontSize: 14 },
  inputDisabled: { backgroundColor: '#f1f5f3', color: '#84928d' },
  multiline: { minHeight: 82, textAlignVertical: 'top', paddingTop: 12 },
  button: { minHeight: 46, borderRadius: 12, backgroundColor: '#167a62', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14, marginVertical: 7 },
  buttonSecondary: { backgroundColor: '#eef7f3', borderWidth: 1, borderColor: '#dcece4' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  buttonTextSecondary: { color: '#167a62' },
  disabled: { opacity: 0.55 },
  linkButton: { paddingHorizontal: 6, paddingVertical: 7, alignSelf: 'flex-start' },
  linkText: { color: '#167a62', fontSize: 12, fontWeight: '700' },
  disabledText: { color: '#aab8b2' },
  pill: { borderWidth: 1, borderColor: '#e0e9e4', borderRadius: 30, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: '#fff' },
  pillActive: { backgroundColor: '#e7f4ed', borderColor: '#abd2bd' },
  pillText: { color: '#60766d', fontSize: 11, fontWeight: '600' },
  pillTextActive: { color: '#167a62' },
  choiceScroll: { gap: 7, paddingVertical: 6, alignItems: 'center' },
  orderCard: { backgroundColor: '#fbfdfc', borderWidth: 1, borderColor: '#e8eeeb', borderRadius: 14, padding: 12, marginTop: 9 },
  orderTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  orderId: { color: '#167a62', fontSize: 11, fontWeight: '800', marginBottom: 4 },
  orderBottom: { marginTop: 11, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#e3ece7', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  statusChoices: { gap: 6, marginTop: 7 },
  badge: { alignSelf: 'flex-start', overflow: 'hidden', backgroundColor: '#e7f4ed', color: '#317254', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 30, fontSize: 10, fontWeight: '700', marginTop: 4 },
  badgeRed: { backgroundColor: '#fcebea', color: '#b04e48' },
  badgeAmber: { backgroundColor: '#fff3d8', color: '#9b6c16' },
  money: { color: '#167a62', fontSize: 14, fontWeight: '800', marginTop: 5 },
  detailText: { color: '#667b72', fontSize: 12, lineHeight: 19, marginTop: 3 },
  empty: { paddingVertical: 20, alignItems: 'center' },
  customerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#e7eeea' },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: '#e7f4ed', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#167a62', fontWeight: '800', fontSize: 12 },
  itemRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 11, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#e7eeea' },
  productIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#eaf5f0', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  compactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#e7eeea', paddingVertical: 11, gap: 10 },
  hourRow: { height: 130, paddingVertical: 8, gap: 5, alignItems: 'flex-end' },
  hourColumn: { width: 23, height: 110, alignItems: 'center', justifyContent: 'flex-end' },
  hourNumber: { color: '#6f847b', fontSize: 9, marginBottom: 4 },
  hourTrack: { width: 12, height: 72, justifyContent: 'flex-end', backgroundColor: '#f0f5f2', borderRadius: 8, overflow: 'hidden' },
  hourBar: { width: '100%', backgroundColor: '#42a780', borderRadius: 8 },
  hourLabel: { color: '#83928c', fontSize: 8, height: 12, marginTop: 3 },
  exportRow: { flexDirection: 'row', gap: 10 },
  success: { color: '#317254', fontSize: 12, fontWeight: '700', marginTop: 4 },
  costHighlight: { borderWidth: 1, borderColor: '#dcece4', borderRadius: 12, padding: 10, backgroundColor: '#f5fbf7', marginBottom: 10 },
  footer: { color: '#9aa9a2', textAlign: 'center', fontSize: 10, marginTop: 6 },
  error: { color: '#a6423c', fontSize: 12, lineHeight: 18, marginVertical: 6 },
  errorBox: { backgroundColor: '#fff0ef', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#f5d0ce' },
  loader: { marginVertical: 8 },
  modalShade: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(20,40,32,0.42)' },
  modalCard: { maxHeight: '90%', backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, paddingBottom: 30 },
  detailModalShade: { flex: 1, backgroundColor: 'rgba(20,40,32,0.42)', justifyContent: 'center', padding: 22 },
  detailModal: { backgroundColor: '#fff', borderRadius: 18, padding: 18 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectList: { maxHeight: 135, borderWidth: 1, borderColor: '#e0e9e4', borderRadius: 11, marginBottom: 12 },
  selectOption: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e5ece8' },
  selectOptionActive: { backgroundColor: '#eaf5f0' },
});
