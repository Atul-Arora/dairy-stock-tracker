import { entriesToCsv } from '../lib/csv';
import { StockEntry } from '../lib/stock';

export default function ExportPanel({ entries }: { entries: StockEntry[] }) {
  function downloadCsv() {
    const blob = new Blob([entriesToCsv(entries)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dairy-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Export</h2>
      <p>Download CSV for Excel, Sheets, Python, or AI model training.</p>
      <button onClick={downloadCsv} disabled={entries.length === 0}>Download CSV</button>
    </section>
  );
}
