'use client';

import { useEffect, useMemo, useState } from 'react';
import { crmApi, type HourlyPresenceSample } from '@/lib/crm-api';

function vietnamToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

export default function OnlinePresenceHistoryPanel({ token }: { token: string }) {
  const [date, setDate] = useState(vietnamToday);
  const [samples, setSamples] = useState<HourlyPresenceSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    crmApi.getHourlyPresence(token, date).then((result) => {
      if (active) setSamples(result.samples);
    }).catch((requestError: Error) => {
      if (active) {
        setSamples([]);
        setError(requestError.message);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [date, token]);

  const hourlySamples = useMemo(() => {
    const samplesByHour = new Map(samples.map((sample) => [sample.hour, sample.activeVisitors]));
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activeVisitors: samplesByHour.has(hour) ? samplesByHour.get(hour)! : null,
    }));
  }, [samples]);
  const peakVisitors = samples.length ? Math.max(...samples.map((sample) => sample.activeVisitors)) : null;
  const maxVisitors = Math.max(1, ...samples.map((sample) => sample.activeVisitors));

  return (
    <section className="orders-section online-presence-history">
      <div className="section-heading">
        <div>
          <h2>Lịch sử người đang online</h2>
          <p>Mỗi giờ lưu mức online cao nhất, lấy mẫu mỗi 30 giây.</p>
        </div>
        <label className="presence-date">
          Chọn ngày
          <input aria-label="Chọn ngày xem lịch sử online" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>

      {error && <p className="view-event-error" role="alert">Không thể tải lịch sử online: {error}</p>}
      {loading ? <p className="presence-history-message">Đang tải dữ liệu...</p> : (
        <>
          <p className="presence-peak">
            Cao nhất trong ngày: <strong>{peakVisitors === null ? '—' : peakVisitors.toLocaleString('vi-VN')}</strong>
          </p>
          {peakVisitors === null && !error ? (
            <p className="presence-history-message">Chưa có dữ liệu cho ngày này. Hệ thống chỉ ghi nhận từ khi tính năng được triển khai.</p>
          ) : peakVisitors !== null && (
            <div className="presence-hour-chart-scroll">
              <div className="presence-hour-chart" aria-label={`Mức online cao nhất theo giờ ngày ${date}`}>
                {hourlySamples.map(({ hour, activeVisitors }) => {
                  const barHeight = activeVisitors === null ? 0 : Math.max(3, (activeVisitors / maxVisitors) * 100);
                  const label = activeVisitors === null
                    ? `${String(hour).padStart(2, '0')}:00 — chưa có dữ liệu`
                    : `${String(hour).padStart(2, '0')}:00 — ${activeVisitors} người online`;
                  return (
                    <div className="presence-hour" key={hour} title={label}>
                      <span className="presence-hour-value">{activeVisitors === null ? '—' : activeVisitors}</span>
                      <div className="presence-hour-track">
                        <div
                          className={`presence-hour-bar${activeVisitors === null ? ' missing' : ''}`}
                          style={{ height: `${barHeight}%` }}
                          role="img"
                          aria-label={label}
                        />
                      </div>
                      <span className="presence-hour-label">{hour % 3 === 0 ? `${String(hour).padStart(2, '0')}h` : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
