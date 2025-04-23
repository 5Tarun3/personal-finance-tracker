import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import ExcelJS from 'exceljs';

const ExcelUploadButton = () => {
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
      const categoryIdx = headers.findIndex(h => h?.toLowerCase() === 'category');
      const amountIdx = headers.findIndex(h => h?.toLowerCase() === 'amount');
      const dateIdx = headers.findIndex(h => h?.toLowerCase() === 'date');
      
      if (categoryIdx < 0 || amountIdx < 0 || dateIdx < 0) {
        throw new Error("Excel file must contain 'Category', 'Amount', and 'Date' columns");
      }
      
      // Process each row
      const expenses = [];
      let successCount = 0;
      let failedCount = 0;
      
      worksheet.eachRow((row, rowIndex) => {
        // Skip header row
        if (rowIndex === 1) return;
        
        const values = row.values;
        if (values.length <= 1) return; // Skip empty rows
        
        const expense = {
          category: values[categoryIdx],
          amount: parseFloat(values[amountIdx]),
          date: new Date(values[dateIdx]).toISOString()
        };
        
        if (expense.category && !isNaN(expense.amount) && expense.date) {
          expenses.push(expense);
        }
      });
      
      setUploadStatus(prev => ({ ...prev, total: expenses.length }));
      
      // Upload expenses to API
      for (const expense of expenses) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE}/api/expenses/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(expense)
          });
          
          if (response.ok) {
            successCount++;
            setUploadStatus(prev => ({ ...prev, success: successCount }));
          } else {
            failedCount++;
            setUploadStatus(prev => ({ ...prev, failed: failedCount }));
            console.error(`Failed to upload expense: ${expense.category}`, await response.text());
          }
        } catch (error) {
          failedCount++;
          setUploadStatus(prev => ({ ...prev, failed: failedCount }));
          console.error(`Error uploading expense: ${expense.category}`, error);
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
          isUploading ? 'bg-yellow-500' : 'bg-blue-500 hover:bg-blue-400'
        } text-white px-4 py-2 rounded flex items-center gap-2`}
        whileHover={{ scale: isUploading ? 1 : 1.05 }}
        disabled={isUploading}
      >
        <FaUpload /> {isUploading ? 'Uploading...' : 'Upload Expense Data'}
      </motion.button>
      
      {showStatus && (
        <div className={`mt-2 text-sm ${
          uploadStatus.failed > 0 ? 'text-red-500' : 'text-green-500'
        }`}>
          {isUploading ? (
            `Uploading expenses... ${uploadStatus.success + uploadStatus.failed}/${uploadStatus.total}`
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

export default ExcelUploadButton;