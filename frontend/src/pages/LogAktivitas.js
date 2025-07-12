import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import SuperAdminLayout from '../components/SuperAdminLayout';

const aktivitasOptions = [
  { value: '', label: 'Semua Aktivitas' },
  { value: 'Disetujui', label: 'Disetujui' },
  { value: 'Ditolak', label: 'Ditolak' },
  { value: 'Dicetak', label: 'Dicetak' },
];

function exportToExcel(data) {
  // Simple export to CSV (Excel-compatible)
  const header = ['Nama Petugas','Nama Merk','NPWPD','Aktivitas','Waktu'];
  const rows = data.map(l => [
    l.petugas?.nama || '-',
    l.laporan?.nama_merk || '-',
    l.laporan?.npwpd || '-',
    l.aktivitas,
    new Date(l.waktu).toLocaleString('id-ID')
  ]);
  let csv = [header, ...rows].map(r=>r.map(x=>`"${x}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'log-aktivitas.csv';
  a.click();
  URL.revokeObjectURL(url);
}

const LogAktivitas = () => {
  const { token, user } = useAuth();
  const [log, setLog] = useState([]);
  const [search, setSearch] = useState('');
  const [aktivitasFilter, setAktivitasFilter] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const Layout = user?.role === 'superadmin' ? SuperAdminLayout : AdminLayout;

  useEffect(() => {
    if (user?.role !== 'superadmin') return;
    fetchLogs();
    // eslint-disable-next-line
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/superadmin/logs', { headers: { Authorization: `Bearer ${token}` } });
      setLog(res.data);
    } catch {
      setLog([]);
    }
    setLoading(false);
  };

  if (!user || user.role !== 'superadmin') {
    return <div style={{padding:40, textAlign:'center'}}>Akses hanya untuk Super Admin</div>;
  }

  let filtered = log.filter(l =>
    (!aktivitasFilter || l.aktivitas === aktivitasFilter) &&
    (!tanggal || new Date(l.waktu).toISOString().slice(0,10) === tanggal) &&
    (
      l.petugas?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      l.laporan?.nama_merk?.toLowerCase().includes(search.toLowerCase()) ||
      l.laporan?.npwpd?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const total = filtered.length;
  const perPage = 10;
  const maxPage = Math.ceil(total/perPage);
  filtered = filtered.slice((page-1)*perPage, page*perPage);

  if (loading) {
    return (
      <Layout title="Log Aktivitas">
        <div style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Log Aktivitas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Search and Filter Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            flex: 1,
            minWidth: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px'
            }} />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px 8px 36px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={aktivitasFilter}
            onChange={(e) => setAktivitasFilter(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {aktivitasOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px'
            }}
          />
          <button
            onClick={() => exportToExcel(filtered)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': {
                background: '#1d4ed8'
              }
            }}
          >
            <FaFileExcel /> Export Excel
          </button>
        </div>

        {/* Log List */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#fff'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Petugas</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nama Merk</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>NPWPD</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Aktivitas</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:last-child': { borderBottom: 'none' }
                }}>
                  <td style={{ padding: '12px 16px' }}>{l.petugas?.nama || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{l.laporan?.nama_merk || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{l.laporan?.npwpd || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: l.aktivitas === 'Disetujui' ? 'rgba(74, 222, 128, 0.2)' : 
                                l.aktivitas === 'Ditolak' ? 'rgba(248, 113, 113, 0.2)' :
                                'rgba(251, 191, 36, 0.2)',
                      color: l.aktivitas === 'Disetujui' ? '#4ade80' : 
                            l.aktivitas === 'Ditolak' ? '#f87171' :
                            '#fbbf24',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {l.aktivitas}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {new Date(l.waktu).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default LogAktivitas;