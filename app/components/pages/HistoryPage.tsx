import React, { useState, useRef } from 'react';
import { TestTypeBadge, ConfidenceScoreBadge } from '../ui/Badge';

// Tipe data untuk item riwayat
interface HistoryItem {
  id: string;
  date: string;
  time: string;
  testType: string;
  result: string;
  score?: number;
}

// Komponen Button Buka
const OpenButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
    >
      <span className="mr-1">Buka</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

// Komponen Button Hapus
const DeleteButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-xs"
    >
      Hapus
    </button>
  );
};

// Tipe data untuk props komponen
interface HistoryPageProps {
  initialData?: HistoryItem[];
}

export default function HistoryPage({ initialData = [] }: HistoryPageProps) {
  // State untuk data
  const [historyData] = useState<HistoryItem[]>(initialData.length > 0 ? initialData : [
    { id: '1', date: '22 Juni 2023', time: '10:30 WIB', testType: 'Gambar', result: 'Sehat', score: 79 },
    { id: '2', date: '22 Juni 2023', time: '13:15 WIB', testType: 'Suara', result: 'Sehat', score: 82 },
    { id: '3', date: '22 Juni 2023', time: '21:55 WIB', testType: 'Gambar', result: 'Parkinson', score: 65 },
  ]);
  
  // State untuk filter dan pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hitung total halaman
  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  
  // Dapatkan data untuk halaman saat ini
  const currentData = historyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handler untuk tombol aksi
  const handleOpenItem = (id: string) => {
    console.log(`Membuka item dengan id: ${id}`);
    // Implementasi navigasi ke halaman detail
  };

  const handleDeleteItem = (id: string) => {
    console.log(`Menghapus item dengan id: ${id}`);
    // Implementasi penghapusan item
  };

  return (
    <div className="pt-18 pb-16 bg-white">
      {/* Header dengan background gradient */}
      <div className="w-full bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-400 py-10">
        <div className="container mt-16 mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">Riwayat Deteksi</h1>
          <p className="text-white text-lg">
            Lihat dan kelola riwayat deteksi Parkinson yang telah Anda lakukan
          </p>
        </div>
      </div>
      
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Filter Section - Tanpa Icon */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter Dropdown - Tanpa Icon */}
            <div className="flex items-center">
              <label htmlFor="filter" className="mr-2 text-sm font-medium text-gray-800">Filter Berdasarkan:</label>
              <select 
                id="filter" 
                className="bg-white text-gray-800 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ width: '120px' }}
              >
                <option value="" className="text-gray-800 bg-white">Tanggal</option>
              </select>
            </div>
            
            {/* Date Range Picker - Tanpa Icon */}
            <div className="flex items-center">
              {/* From Date */}
              <div className="relative" style={{ width: '180px' }}>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>
              
              <span className="mx-2 text-gray-800">-</span>
              
              {/* To Date */}
              <div className="relative" style={{ width: '180px' }}>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Table Section - Improved Badges and Buttons */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">TANGGAL</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">JENIS TES</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">HASIL</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 border-b">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <div className="text-sm font-medium text-gray-900">{item.date}</div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TestTypeBadge type={item.testType} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ConfidenceScoreBadge score={item.score || 0} result={item.result} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm border-b border-gray-200">
                    <div className="flex justify-end items-center space-x-2">
                      <OpenButton onClick={() => handleOpenItem(item.id)} />
                      <DeleteButton onClick={() => handleDeleteItem(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 border-b border-gray-200">
                    Tidak ada data riwayat deteksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div></div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Sebelumnya</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Selanjutnya</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}