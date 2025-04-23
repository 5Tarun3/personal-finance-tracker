import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import ExcelJS from 'exceljs';

const ExcelUploadIncomeButton = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ total: 0, success: 0, failed: 0 });
  const [showStatus, setShowStatus] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setShowStatus(true);
      setUploadStatus({ total: 0, success: 0, failed: 0 });
      
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      // Get the first worksheet
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error("No worksheet found");
      
      // Get column indexes (handle potentially different column orders)
      const headers = worksheet.getRow(1).values;
      const sourceIdx = headers.findIndex(h => h?.toLowerCase() === 'source');
      const amountIdx = headers.findIndex(h => h?.toLowerCase() === 'amount');
      const dateIdx = headers.findIndex(h => h?.toLowerCase() === 'date');
      
      if (sourceIdx < 0 || amountIdx < 0 || dateIdx < 0) {
        throw new Error("Excel file must contain 'Source', 'Amount', and 'Date' columns");
      }
      
      // Process each row
      const incomes = [];
      let successCount = 0;
      let failedCount = 0;
      
      worksheet.eachRow((row, rowIndex) => {
        // Skip header row
        if (rowIndex === 1) return;
        
        const values = row.values;
        if (values.length <= 1) return; // Skip empty rows
        
        const income = {
          source: values[sourceIdx],
          amount: parseFloat(values[amountIdx]),
          date: new Date(values[dateIdx]).toISOString()
        };
        
        if (income.source && !isNaN(income.amount) && income.date) {
          incomes.push(income);
        }
      });
      
      setUploadStatus(prev => ({ ...prev, total: incomes.length }));
      
      // Upload incomes to API
      for (const income of incomes) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE}/api/incomes/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(income)
          });
          
          if (response.ok) {
            successCount++;
            setUploadStatus(prev => ({ ...prev, success: successCount }));
          } else {
            failedCount++;
            setUploadStatus(prev => ({ ...prev, failed: failedCount }));
            console.error(`Failed to upload income: ${income.source}`, await response.text());
          }
        } catch (error) {
          failedCount++;
          setUploadStatus(prev => ({ ...prev, failed: failedCount }));
          console.error(`Error uploading income: ${income.source}`, error);
        }
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      alert(`Error processing Excel file: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Status message will be hidden after 5 seconds if all uploads complete
      if (uploadStatus.success + uploadStatus.failed === uploadStatus.total) {
        setTimeout(() => setShowStatus(false), 5000);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <motion.button
        onClick={handleClick}
        className={`${
          isUploading ? 'bg-yellow-500' : 'bg-green-500 hover:bg-green-400'
        } text-white px-4 py-2 rounded flex items-center gap-2`}
        whileHover={{ scale: isUploading ? 1 : 1.05 }}
        disabled={isUploading}
      >
        <FaUpload /> {isUploading ? 'Uploading...' : 'Upload Income Data'}
      </motion.button>
      
      {showStatus && (
        <div className={`mt-2 text-sm ${
          uploadStatus.failed > 0 ? 'text-red-500' : 'text-green-500'
        }`}>
          {isUploading ? (
            `Uploading incomes... ${uploadStatus.success + uploadStatus.failed}/${uploadStatus.total}`
          ) : (
            uploadStatus.total > 0 ? 
            `Upload complete: ${uploadStatus.success} succeeded, ${uploadStatus.failed} failed` :
            ''
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelUploadIncomeButton;
