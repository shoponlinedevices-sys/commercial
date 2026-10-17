'use client';

import { useEffect, useState } from 'react';
import { getViewTrackingConsent, setViewTrackingConsent } from '@/lib/view-tracking';

export default function TrackingConsent() {
  const [consent, setConsent] = useState<'granted' | 'declined' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(getViewTrackingConsent());
    setMounted(true);
  }, []);

  const choose = (value: 'granted' | 'declined') => {
    setViewTrackingConsent(value);
    setConsent(value);
    setPreferencesOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {consent !== null && !preferencesOpen && (
        <button
          type="button"
          onClick={() => setPreferencesOpen(true)}
          className="fixed bottom-4 left-4 z-40 rounded-full border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-lg"
          aria-label="Mở cài đặt quyền riêng tư"
        >
          Quyền riêng tư
        </button>
      )}
      {(consent === null || preferencesOpen) && (
        <section
          role="region"
          aria-label="Tùy chọn theo dõi lượt xem"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border bg-background p-5 text-foreground shadow-2xl sm:inset-x-6 sm:p-6"
        >
          <h2 className="text-base font-semibold">Quyền riêng tư và lượt xem</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Nếu bạn đồng ý, Commercial sẽ lưu mã khách truy cập ẩn danh trên thiết bị này và ghi nhận
            các trang danh mục, thương hiệu hoặc sản phẩm bạn xem để hỗ trợ báo cáo quan tâm khách hàng.
            Khi đăng nhập, mã tài khoản được lấy từ phiên xác thực. URL chỉ lưu đường dẫn, không lưu tham số
            truy vấn. Từ chối sẽ dừng việc thu thập lượt xem trong tương lai; bạn có thể đổi lựa chọn bất cứ lúc nào.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => choose('granted')} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Đồng ý
            </button>
            <button type="button" onClick={() => choose('declined')} className="rounded-md border px-4 py-2 text-sm font-medium">
              Từ chối
            </button>
            {preferencesOpen && consent !== null && (
              <button type="button" onClick={() => setPreferencesOpen(false)} className="ml-auto px-3 py-2 text-sm text-muted-foreground">
                Đóng
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
