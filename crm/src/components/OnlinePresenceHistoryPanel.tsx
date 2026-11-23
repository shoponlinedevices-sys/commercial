'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { crmApi, type HourlyPresenceSample } from '@/lib/crm-api';

function vietnamToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

function datesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${from}T00:00:00.000Z`);
  const last = new Date(`${to}T00:00:00.000Z`);
  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export default function OnlinePresenceHistoryPanel({ token }: { token: string }) {
  const [today] = useState(vietnamToday);
  const [date, setDate] = useState(today);
  const [exportFromDate, setExportFromDate] = useState(`${today.slice(0, 7)}-01`);
  const [exportToDate, setExportToDate] = useState(today);
  const [samples, setSamples] = useState<HourlyPresenceSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportMessage, setExportMessage] = useState('');

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
  const validExportRange = exportFromDate <= exportToDate;

  const exportExcel = async () => {
    if (!validExportRange) return;
    setExporting(true);
    setExportError('');
    setExportMessage('');

    try {
      const { samples: rangeSamples } = await crmApi.getHourlyPresenceRange(token, exportFromDate, exportToDate);
      if (rangeSamples.length === 0) {
        throw new Error('Khoảng ngày đã chọn chưa có dữ liệu online để xuất.');
      }

      const sampleMap = new Map(rangeSamples.map((sample) => [`${sample.date}:${sample.hour}`, sample.activeVisitors]));
      const days = datesInRange(exportFromDate, exportToDate);
      const hourlyRows = days.flatMap((day) => Array.from({ length: 24 }, (_, hour) => ({
        date: day,
        hour: `${String(hour).padStart(2, '0')}:00 - ${String((hour + 1) % 24).padStart(2, '0')}:00`,
        activeVisitors: sampleMap.get(`${day}:${hour}`) ?? null,
      })));

      const { default: ExcelJS } = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      const dailySheet = workbook.addWorksheet('Theo ngay');
      dailySheet.columns = [
        { header: 'Ngày', key: 'date', width: 16 },
        { header: 'Mức online cao nhất trong ngày', key: 'peakVisitors', width: 32 },
        { header: 'Giờ đạt mức cao nhất', key: 'peakHours', width: 26 },
        { header: 'Số giờ có dữ liệu', key: 'recordedHours', width: 20 },
      ];
      dailySheet.addRows(days.map((day) => {
        const daySamples = rangeSamples.filter((sample) => sample.date === day);
        const peak = daySamples.length ? Math.max(...daySamples.map((sample) => sample.activeVisitors)) : null;
        const peakHours = peak === null
          ? ''
          : daySamples
            .filter((sample) => sample.activeVisitors === peak)
            .map((sample) => `${String(sample.hour).padStart(2, '0')}:00`)
            .join(', ');
        return {
          date: day,
          peakVisitors: peak,
          peakHours,
          recordedHours: daySamples.length,
        };
      }));

      const hourlySheet = workbook.addWorksheet('Theo gio');
      hourlySheet.columns = [
        { header: 'Ngày', key: 'date', width: 16 },
        { header: 'Khung giờ', key: 'hour', width: 22 },
        { header: 'Mức online cao nhất', key: 'activeVisitors', width: 24 },
      ];
      hourlySheet.addRows(hourlyRows);

      for (const sheet of [dailySheet, hourlySheet]) {
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E715E' } };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
        sheet.autoFilter = {
          from: 'A1',
          to: `${String.fromCharCode(64 + sheet.columnCount)}1`,
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `bao-cao-online-${exportFromDate}-${exportToDate}.xlsx`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setExportMessage('Đã tải báo cáo Excel.');
    } catch (requestError) {
      setExportError((requestError as Error).message);
    } finally {
      setExporting(false);
    }
  };

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

      <div className="presence-export">
        <label>
          Từ ngày
          <input type="date" max={today} value={exportFromDate} onChange={(event) => setExportFromDate(event.target.value)} />
        </label>
        <label>
          Đến ngày
          <input type="date" min={exportFromDate} max={today} value={exportToDate} onChange={(event) => setExportToDate(event.target.value)} />
        </label>
        <button className="primary-button" type="button" onClick={exportExcel} disabled={exporting || !validExportRange}>
          <Download size={16} />
          {exporting ? 'Đang tạo Excel...' : 'Xuất Excel'}
        </button>
      </div>
      {!validExportRange && <p className="view-event-error" role="alert">Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.</p>}
      {exportError && <p className="view-event-error" role="alert">Không thể xuất báo cáo: {exportError}</p>}
      {exportMessage && <p className="presence-export-message" role="status">{exportMessage}</p>}
      <p className="presence-export-note">File gồm thống kê tổng hợp theo ngày và chi tiết từng giờ. Ô trống là giờ chưa có dữ liệu.</p>

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
