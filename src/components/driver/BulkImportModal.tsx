"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    FileUp,
    Download,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import * as XLSX from 'xlsx';
import { Driver } from "@/utils/interface/driverInterface";

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (drivers: Driver[]) => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
    isOpen,
    onClose,
    onImport
}) => {
    const { theme } = useTheme();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [errors, setErrors] = useState<string[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
            toast.error("Please upload Excel or CSV file only");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        setSelectedFile(file);
        parseFile(file);
    };

    const parseFile = async (file: File) => {
        setIsUploading(true);
        setErrors([]);
        setPreviewData([]);

        try {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    if (!data) throw new Error("Failed to read file");

                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Get all sheet data as array with headers
                    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (sheetData.length <= 1) {
                        setErrors(["No data found in the file"]);
                        return;
                    }

                    // Extract headers from first row and clean them
                    const headers = (sheetData[0] as string[]).map(h =>
                        h?.toString().trim().toLowerCase() || ''
                    );

                    // Field mapping for driver data
                    const headerToFieldMap: Record<string, string> = {};
                    
                    const fieldNames = [
                        'driverName',
                        'phoneNo',
                        'drivingLicenseNo',
                        'vehicleType',
                        'vehicleRegNo',
                        'city',
                        'state',
                        'presentAddress',
                        'email',
                        'employmentType',
                        'salaryType'
                    ];

                    headers.forEach((header, index) => {
                        if (index < fieldNames.length) {
                            headerToFieldMap[header] = fieldNames[index];
                        }
                    });

                    // Process each data row
                    const processedData: any[] = [];
                    const validationErrors: string[] = [];

                    for (let i = 1; i < sheetData.length; i++) {
                        const row = sheetData[i] as any[];
                        if (!row || row.length === 0) continue;

                        // Skip empty rows
                        const hasData = row.some(cell => cell?.toString().trim() !== '');
                        if (!hasData) continue;

                        const driver: any = {
                            employmentType: 'permanent',
                            salaryType: 'fixed',
                            status: 'active',
                            rating: 3,
                            country: 'Bangladesh',
                            vehicleType: 'truck'
                        };

                        // Map data based on headers
                        headers.forEach((header, index) => {
                            const value = row[index]?.toString().trim() || '';
                            if (!value) return;

                            const fieldName = headerToFieldMap[header];
                            if (fieldName) {
                                driver[fieldName] = value;
                            }
                        });

                        // Validate required fields
                        if (!driver.driverName) {
                            validationErrors.push(`Row ${i}: Driver name is missing`);
                            continue;
                        }
                        if (!driver.phoneNo) {
                            validationErrors.push(`Row ${i}: Phone number is missing`);
                            continue;
                        }
                        if (!driver.drivingLicenseNo) {
                            validationErrors.push(`Row ${i}: Driving license number is missing`);
                            continue;
                        }
                        if (!driver.vehicleRegNo) {
                            validationErrors.push(`Row ${i}: Vehicle registration number is missing`);
                            continue;
                        }
                        if (!driver.presentAddress) {
                            validationErrors.push(`Row ${i}: Present address is missing`);
                            continue;
                        }
                        if (!driver.city) {
                            validationErrors.push(`Row ${i}: City is missing`);
                            continue;
                        }
                        if (!driver.state) {
                            validationErrors.push(`Row ${i}: State is missing`);
                            continue;
                        }

                        // Validate phone format
                        const phoneRegex = /^(?:\+88|01)?\d{11}$/;
                        if (!phoneRegex.test(driver.phoneNo.replace(/\D/g, ''))) {
                            validationErrors.push(`Row ${i}: Invalid phone number format`);
                            continue;
                        }

                        // Validate email format (if provided)
                        if (driver.email) {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(driver.email)) {
                                validationErrors.push(`Row ${i}: Invalid email format`);
                                continue;
                            }
                        }

                        processedData.push(driver);
                    }

                    setPreviewData(processedData);
                    if (validationErrors.length > 0) {
                        setErrors(validationErrors);
                    }

                    if (processedData.length === 0) {
                        setErrors(prev => [...prev, "No valid data found in the file"]);
                    }

                } catch (error) {
                    console.error("Error parsing file:", error);
                    setErrors(["Failed to parse file. Please check the format."]);
                } finally {
                    setIsUploading(false);
                }
            };

            reader.onerror = () => {
                setErrors(["Failed to read file"]);
                setIsUploading(false);
            };

            reader.readAsArrayBuffer(file);

        } catch (error) {
            console.error("Error:", error);
            setErrors(["Failed to process file"]);
            setIsUploading(false);
        }
    };

    const downloadSampleFile = () => {
        const sampleData = [
            ['driverName', 'phoneNo', 'drivingLicenseNo', 'vehicleType', 'vehicleRegNo', 'city', 'state', 'presentAddress', 'email', 'employmentType', 'salaryType'],
            ['Md. Karim', '01712345678', 'DL-123456', 'truck', 'DHAKA-METRO-12-3456', 'Dhaka', 'Dhaka', '123 Motijheel, Dhaka', 'karim@example.com', 'permanent', 'fixed'],
            ['Abdul Rahim', '01898765432', 'DL-789012', 'pickup', 'DHAKA-METRO-78-9012', 'Chittagong', 'Chittagong', '456 Agrabad, Chittagong', 'rahim@example.com', 'contractual', 'per_trip'],
            ['Hasan Ahmed', '01911223344', 'DL-345678', 'lorry', 'DHAKA-METRO-34-5678', 'Savar', 'Dhaka', '789 Savar, Dhaka', 'hasan@example.com', 'permanent', 'percentage'],
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
        XLSX.writeFile(workbook, "sample_drivers.xlsx");

        toast.success("Sample file downloaded!");
    };

    const handleImport = () => {
        if (previewData.length === 0) {
            toast.error("No valid data to import");
            return;
        }

        onImport(previewData);
    };

    const resetFile = () => {
        setSelectedFile(null);
        setPreviewData([]);
        setErrors([]);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } border`}
                >
                    {/* Header */}
                    <div className={`flex-shrink-0 p-6 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                    <FileUp className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Bulk Import Drivers
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Upload Excel or CSV file to add multiple drivers at once
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className={`p-2 hover:bg-red-600 hover:text-red-200 border hover:border-red-600 hover:cursor-pointer rounded-full transition-colors duration-300 ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Instructions */}
                            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <h3 className={`font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                    <AlertCircle size={16} />
                                    Instructions
                                </h3>
                                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Download the sample file to see the required format</li>
                                    <li>• Required columns: driverName, phoneNo, drivingLicenseNo, vehicleRegNo, presentAddress, city, state</li>
                                    <li>• Phone numbers must be Bangladeshi format (e.g., 01712345678)</li>
                                    <li>• Vehicle registration must be unique</li>
                                    <li>• Maximum file size: 5MB</li>
                                    <li>• Supported formats: .xlsx, .xls, .csv</li>
                                </ul>
                            </div>

                            {/* File Upload */}
                            <div className={`rounded-lg p-6 border-2 border-dashed ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                                <div className="text-center">
                                    <FileUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedFile ? selectedFile.name : "Drop your file here or click to browse"}
                                    </p>
                                    <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Excel or CSV files only
                                    </p>

                                    {!selectedFile ? (
                                        <div className="flex justify-center gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                                className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                            >
                                                <FileUp size={16} />
                                                Choose File
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={downloadSampleFile}
                                                className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                                    }`}
                                            >
                                                <Download size={16} />
                                                Sample File
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {selectedFile.name}
                                                </p>
                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>

                                            <div className="flex justify-center gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={resetFile}
                                                    className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                                        }`}
                                                >
                                                    Choose Different File
                                                </motion.button>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Loading State */}
                            {isUploading && (
                                <div className="text-center py-4">
                                    <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Parsing file...
                                    </p>
                                </div>
                            )}

                            {/* Preview Data */}
                            {previewData.length > 0 && (
                                <div>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <CheckCircle size={16} className="text-green-500" />
                                        Preview ({previewData.length} valid drivers)
                                    </h3>
                                    <div className="max-h-60 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Driver Name</th>
                                                    <th className="px-3 py-2 text-left">Phone</th>
                                                    <th className="px-3 py-2 text-left">License</th>
                                                    <th className="px-3 py-2 text-left">Vehicle</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.slice(0, 5).map((driver, index) => (
                                                    <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                                        <td className="px-3 py-2">{driver.driverName}</td>
                                                        <td className="px-3 py-2">{driver.phoneNo}</td>
                                                        <td className="px-3 py-2">{driver.drivingLicenseNo}</td>
                                                        <td className="px-3 py-2">{driver.vehicleRegNo}</td>
                                                    </tr>
                                                ))}
                                                {previewData.length > 5 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                                                            ... and {previewData.length - 5} more
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Errors */}
                            {errors.length > 0 && (
                                <div>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <XCircle size={16} className="text-red-500" />
                                        Errors ({errors.length})
                                    </h3>
                                    <div className="max-h-40 overflow-y-auto">
                                        {errors.map((error, index) => (
                                            <div
                                                key={index}
                                                className={`text-sm py-1 px-2 mb-1 rounded ${theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}
                                            >
                                                {error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex-shrink-0 p-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-end gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleImport}
                                disabled={previewData.length === 0 || isUploading}
                                className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${previewData.length === 0 || isUploading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : theme === 'dark'
                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                <FileUp size={18} />
                                Import {previewData.length} Drivers
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BulkImportModal;