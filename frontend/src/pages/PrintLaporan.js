import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = '/logo192.png'; // Ganti dengan logo instansi jika ada

const PrintLaporan = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [laporan, setLaporan] = useState(null);

  useEffect(() => {
    axios.get(`/api/laporan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLaporan(res.data))
      .catch(() => setLaporan(null));
  }, [id, token]);

  if (!laporan) return <div>Loading...</div>;

  // Siapkan array foto
  const fotoArr = Array.isArray(laporan.foto) ? laporan.foto : laporan.foto ? [laporan.foto] : [];

  return (
    <div className="print-container" style={{maxWidth:'800px',margin:'0 auto',background:'#fff',padding:'40px 60px',fontFamily:'Times New Roman, Times, serif',fontSize:18,boxShadow:'0 2px 12px #bbb'}}>
      <button onClick={() => window.print()} style={{float:'right',marginBottom:20}}>🖨️ Print</button>
      {/* Halaman 1 */}
      <div>
        <div style={{textAlign:'center',marginBottom:24}}>
          <img src={LOGO_URL} alt="logo" style={{height:70,marginBottom:10}} />
          <h2 style={{margin:0,fontFamily:'Times New Roman, Times, serif',fontWeight:700}}>BERITA ACARA PEMERIKSAAN</h2>
          <div style={{fontSize:16,marginTop:4}}>BAPENDA</div>
        </div>
        <hr style={{margin:'18px 0'}} />
        <table style={{width:'100%',fontSize:18,marginBottom:18}}>
          <tbody>
            <tr>
              <td style={{width:180}}><b>Tanggal</b></td>
              <td>: {new Date(laporan.tanggal).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><b>NPWPD</b></td>
              <td>: {laporan.npwpd}</td>
            </tr>
            <tr>
              <td><b>Nama Petugas</b></td>
              <td>: {laporan.user?.nama} ({laporan.user?.jabatan})</td>
            </tr>
            <tr>
              <td><b>Alamat</b></td>
              <td>: {laporan.alamat}</td>
            </tr>
            <tr>
              <td><b>Nama Merk</b></td>
              <td>: {laporan.nama_merk}</td>
            </tr>
          </tbody>
        </table>
        <div style={{margin:'18px 0'}}>
          <b>Hasil Pemeriksaan:</b>
          <div style={{border:'1px solid #bbb',borderRadius:6,padding:14,minHeight:80,marginTop:6}}>{laporan.hasil_pemeriksaan}</div>
        </div>
      </div>
      {/* Page Break */}
      {fotoArr.length > 0 && (
        <div style={{pageBreakBefore:'always',marginTop:40}}>
          <h3 style={{textAlign:'center',marginBottom:24}}>Foto Dokumentasi</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:18,justifyContent:'center'}}>
            {fotoArr.map((f, idx) => (
              <img key={idx} src={`http://localhost:5000/uploads/${f}`} alt={`foto${idx}`} style={{maxWidth:260, maxHeight:200, borderRadius:8, boxShadow:'0 1px 6px #bbb',marginBottom:12}} />
            ))}
          </div>
        </div>
      )}
      {/* Tanda tangan di halaman terakhir */}
      <div style={{marginTop:40,display:'flex',justifyContent:'flex-end'}}>
        <div style={{textAlign:'center',minWidth:220}}>
          <div>Petugas Pemeriksa</div>
          <br /><br /><br />
          <div style={{marginTop:40}}>( {laporan.user?.nama} )</div>
        </div>
      </div>
      <style>{`
        @media print {
          body { background: #fff !important; }
          button { display: none !important; }
          .sidebar, .topbar { display: none !important; }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html, body, #root, .print-container {
            width: 210mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
          }
          .print-container {
            transform: scale(0.93); /* adjust if needed */
            transform-origin: top left;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            background: #fff !important;
          }
          table, tr, td, div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintLaporan; 