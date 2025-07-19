import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';

const LOGO_URL = '/logo192.png'; // Ganti dengan logo instansi jika ada

const PrintLaporan = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios.get(`/api/laporan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLaporan(res.data))
      .catch(() => setLaporan(null));
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post(`/api/laporan/${id}/send-pdf`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({
        type: 'success',
        text: 'PDF berhasil dikirim ke WhatsApp pengguna'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.msg || 'Gagal mengirim PDF ke WhatsApp'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!laporan) return <div>Loading...</div>;

  // Siapkan array foto
  const fotoArr = Array.isArray(laporan.foto) ? laporan.foto : laporan.foto ? [laporan.foto] : [];

  // Fungsi untuk memisahkan NPWPD ke dalam kotak-kotak
  const renderNPWPDBoxes = (npwpd) => {
    const digits = npwpd ? npwpd.toString().split('') : [];
    const boxes = [];
    
    for (let i = 0; i < 10; i++) {
      boxes.push(
        <div key={i} style={{
          width: '25px',
          height: '30px',
          border: '1px solid #000',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '30px',
          marginRight: '2px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {digits[i] || ''}
        </div>
      );
    }
    return boxes;
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#000'
    }}>
      {/* Header Controls */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button
          onClick={handlePrint}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaPrint size={16} /> Cetak
        </button>
        <button
          onClick={handleSendWhatsApp}
          disabled={loading}
          style={{
            background: '#25d366',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: loading ? 0.7 : 1
          }}
        >
          <FaWhatsapp size={16} /> Kirim WhatsApp
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      {/* Template Berita Acara */}
      <div style={{ 
        border: '2px solid #000',
        padding: '40px',
        backgroundColor: '#fff',
        minHeight: '1000px'
      }}>
        {/* Header Instansi */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            margin: '0',
            fontSize: '18px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            PEMERINTAH KOTA BANDUNG
          </h1>
          <h2 style={{ 
            margin: '5px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            BADAN PENGELOLAAN PENDAPATAN DAERAH
          </h2>
          <p style={{ 
            margin: '5px 0',
            fontSize: '12px'
          }}>
            Jl. Wastukencana No. 2 Telp. (022) 422 2323 - Bandung
          </p>
        </div>

        {/* Judul Berita Acara */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textDecoration: 'underline'
          }}>
            BERITA ACARA
          </h3>
        </div>

        {/* Paragraf Pembuka */}
        <div style={{ marginBottom: '25px', textAlign: 'justify', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Yang bertanda tangan di bawah ini:
          </p>
          
          <div style={{ display: 'flex', gap: '40px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Nama</strong> : _________________________________
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>NIP</strong> : _________________________________
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Jabatan</strong> : _________________________________
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Nama</strong> : _________________________________
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>NIP</strong> : _________________________________
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                <strong>Jabatan</strong> : _________________________________
              </p>
            </div>
          </div>

          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Selanjutnya disebut sebagai <strong>PETUGAS</strong>, telah melakukan pemeriksaan pada:
          </p>
        </div>

        {/* Data Objek Pemeriksaan */}
        <div style={{ marginBottom: '25px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ width: '35%', padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>Nama Merk Dagang</strong>
                </td>
                <td style={{ width: '5%', padding: '5px 0' }}>:</td>
                <td style={{ width: '60%', padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {laporan.nama_merk}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>Alamat Merk Dagang</strong>
                </td>
                <td style={{ padding: '5px 0' }}>:</td>
                <td style={{ padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {laporan.alamat}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', verticalAlign: 'top' }}>
                  <strong>NPWPD</strong>
                </td>
                <td style={{ padding: '5px 0' }}>:</td>
                <td style={{ padding: '5px 0', borderBottom: '1px solid #000' }}>
                  {renderNPWPDBoxes(laporan.npwpd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hasil Pemeriksaan */}
        <div style={{ marginBottom: '25px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold' }}>
            HASIL PEMERIKSAAN:
          </p>
          <div style={{
            border: '1px solid #000',
            padding: '15px',
            minHeight: '120px',
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            {laporan.hasil_pemeriksaan}
          </div>
        </div>

        {/* Foto Dokumentasi */}
        {fotoArr.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold' }}>
              DOKUMENTASI FOTO:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {fotoArr.map((foto, index) => (
                <div key={index} style={{
                  border: '1px solid #ccc',
                  padding: '5px',
                  textAlign: 'center'
                }}>
                  <img
                    src={`http://localhost:5000/uploads/${foto}`}
                    alt={`Foto ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      marginBottom: '5px'
                    }}
                  />
                  <p style={{ margin: '0', fontSize: '10px' }}>Foto {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Penutup */}
        <div style={{ marginBottom: '25px', textAlign: 'justify', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '12px' }}>
            Berita acara ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '40px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Penanggung Jawab,
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Nama</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Jabatan</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>NIP</strong> : _________________________________
            </p>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Petugas Pendata 1,
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Nama</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Jabatan</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>NIP</strong> : _________________________________
            </p>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 50px 0', fontSize: '12px' }}>
              Petugas Pendata 2,
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Nama</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>Jabatan</strong> : _________________________________
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
              <strong>NIP</strong> : _________________________________
            </p>
          </div>
        </div>

        {/* Tanggal */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ margin: '0', fontSize: '12px' }}>
            Bandung, _____ _______________ 20__
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          button { 
            display: none !important; 
          }
          div { 
            background: white !important; 
            box-shadow: none !important; 
          }
          * { 
            color: black !important; 
          }
          .print-container {
            border: 2px solid #000 !important;
            padding: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintLaporan; 