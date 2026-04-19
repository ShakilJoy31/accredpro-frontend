"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  X,
  Save,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Loader,
  CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { useGetSupplierByIdQuery } from "@/redux/api/supplier/supplier";
import {
  ISupplierCalculation,
  useCreateCalculationMutation,
  useUpdateCalculationMutation,
  useDeleteCalculationByIdMutation,
  useGetSupplierCalculationsQuery
} from "@/redux/api/supplier/supplierCalculationApi";
import BackButton from "../reusable-components/BackButton";

interface SupplierCalculationProps {
  supplierId: string;
}

interface FormData {
  calculationDate: string;
  biboron: string;
  poriman: string;
  dor: string;
  taka: string;
  joma: string;
  baki: string;
  discount: string;
  sign: string;
}

const SupplierCalculation: React.FC<SupplierCalculationProps> = ({ supplierId }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; entry: ISupplierCalculation | null }>({
    isOpen: false,
    entry: null,
  });

  // State for inline editing
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FormData>>({});

  // State for new entry row
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEntryData, setNewEntryData] = useState<FormData>({
    calculationDate: new Date().toISOString().split('T')[0],
    biboron: "",
    poriman: "",
    dor: "",
    taka: "",
    joma: "",
    baki: "",
    discount: "",
    sign: "",
  });

  // Get supplier info
  const { data: supplierData } = useGetSupplierByIdQuery(supplierId);

  // Get calculations
  const {
    data: calculationsData,
    isLoading,
    isError,
    refetch
  } = useGetSupplierCalculationsQuery({
    supplierId,
    startDate,
    endDate,
    page: currentPage,
    limit: itemsPerPage,
    sortBy: "calculationDate",
    sortOrder: "DESC",
  });

  const [createCalculation] = useCreateCalculationMutation();
  const [updateCalculation] = useUpdateCalculationMutation();
  const [deleteCalculation] = useDeleteCalculationByIdMutation();

  const calculations = calculationsData?.data || [];
  const summary = calculationsData?.summary || {
    totalTaka: "0",
    totalJoma: "0",
    totalBaki: "0",
    totalPoriman: "0",
    totalDiscount: "0",
  };
  const pagination = calculationsData?.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 20,
  };

  // Helper to calculate taka from poriman and dor
  const calculateTaka = (poriman: string, dor: string) => {
    const porimanNum = parseFloat(poriman);
    const dorNum = parseFloat(dor);
    if (isNaN(porimanNum) || isNaN(dorNum)) return "";
    return (porimanNum * dorNum).toString();
  };

  // Helper to calculate baki from taka and joma
  const calculateBaki = (taka: string, joma: string) => {
    const takaNum = parseFloat(taka);
    const jomaNum = parseFloat(joma);
    if (isNaN(takaNum)) return "";
    if (isNaN(jomaNum)) return takaNum.toString();
    return (takaNum - jomaNum).toString();
  };

  // Handle inline edit field changes
  const handleEditFieldChange = (field: string, value: string) => {
    const updatedData = { ...editFormData, [field]: value };

    // Auto-calculate taka if poriman or dor changes
    if (field === 'poriman' || field === 'dor') {
      const poriman = field === 'poriman' ? value : (editFormData.poriman || "0");
      const dor = field === 'dor' ? value : (editFormData.dor || "0");
      const calculatedTaka = calculateTaka(poriman, dor);
      if (calculatedTaka !== "") {
        updatedData.taka = calculatedTaka;
        // Auto-calculate baki if joma exists
        const joma = editFormData.joma || "0";
        const calculatedBaki = calculateBaki(calculatedTaka, joma);
        if (calculatedBaki !== "") {
          updatedData.baki = calculatedBaki;
        }
      }
    }

    // Auto-calculate baki if taka or joma changes
    if (field === 'taka' || field === 'joma') {
      const taka = field === 'taka' ? value : (editFormData.taka || "0");
      const joma = field === 'joma' ? value : (editFormData.joma || "0");
      const calculatedBaki = calculateBaki(taka, joma);
      if (calculatedBaki !== "") {
        updatedData.baki = calculatedBaki;
      }
    }

    setEditFormData(updatedData);
  };

  // Handle save edited entry
  const handleSaveEdit = async () => {
    if (!editFormData.calculationDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      const saveData = {
        calculationDate: editFormData.calculationDate,
        biboron: editFormData.biboron || "",
        poriman: parseFloat(editFormData.poriman as string) || 0,
        dor: parseFloat(editFormData.dor as string) || 0,
        taka: parseFloat(editFormData.taka as string) || 0,
        joma: parseFloat(editFormData.joma as string) || 0,
        baki: parseFloat(editFormData.baki as string) || 0,
        discount: parseFloat(editFormData.discount as string) || 0,
        sign: editFormData.sign || "",
      };

      await updateCalculation({
        supplierId,
        id: editingRowId!,
        data: saveData
      }).unwrap();
      toast.success("Calculation updated successfully!");
      setEditingRowId(null);
      setEditFormData({});
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save calculation");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditFormData({});
  };

  // Handle new entry field changes
  const handleNewEntryChange = (field: string, value: string) => {
    const updatedData = { ...newEntryData, [field]: value };

    // Auto-calculate taka if poriman or dor changes
    if (field === 'poriman' || field === 'dor') {
      const poriman = field === 'poriman' ? value : newEntryData.poriman;
      const dor = field === 'dor' ? value : newEntryData.dor;
      const calculatedTaka = calculateTaka(poriman, dor);
      if (calculatedTaka !== "") {
        updatedData.taka = calculatedTaka;
        // Auto-calculate baki if joma exists
        const joma = newEntryData.joma || "0";
        const calculatedBaki = calculateBaki(calculatedTaka, joma);
        if (calculatedBaki !== "") {
          updatedData.baki = calculatedBaki;
        }
      }
    }

    // Auto-calculate baki if taka or joma changes
    if (field === 'taka' || field === 'joma') {
      const taka = field === 'taka' ? value : newEntryData.taka;
      const joma = field === 'joma' ? value : newEntryData.joma;
      const calculatedBaki = calculateBaki(taka, joma);
      if (calculatedBaki !== "") {
        updatedData.baki = calculatedBaki;
      }
    }

    setNewEntryData(updatedData);
  };

  // Handle save new entry
  const handleSaveNewEntry = async () => {
    if (!newEntryData.calculationDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      const saveData = {
        calculationDate: newEntryData.calculationDate,
        biboron: newEntryData.biboron || "",
        poriman: parseFloat(newEntryData.poriman) || 0,
        dor: parseFloat(newEntryData.dor) || 0,
        taka: parseFloat(newEntryData.taka) || 0,
        joma: parseFloat(newEntryData.joma) || 0,
        baki: parseFloat(newEntryData.baki) || 0,
        discount: parseFloat(newEntryData.discount) || 0,
        sign: newEntryData.sign || "",
      };

      await createCalculation({
        supplierId,
        data: saveData
      }).unwrap();
      toast.success("Calculation added successfully!");
      setIsAddingNew(false);
      setNewEntryData({
        calculationDate: new Date().toISOString().split('T')[0],
        biboron: "",
        poriman: "",
        dor: "",
        taka: "",
        joma: "",
        baki: "",
        discount: "",
        sign: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save calculation");
    }
  };

  // Handle cancel new entry
  const handleCancelNewEntry = () => {
    setIsAddingNew(false);
    setNewEntryData({
      calculationDate: new Date().toISOString().split('T')[0],
      biboron: "",
      poriman: "",
      dor: "",
      taka: "",
      joma: "",
      baki: "",
      discount: "",
      sign: "",
    });
  };

  // Handle edit button click
  const handleEditClick = (calc: ISupplierCalculation) => {
    setEditingRowId(calc.id);
    setEditFormData({
      calculationDate: calc.calculationDate,
      biboron: calc.biboron || "",
      poriman: calc.poriman.toString(),
      dor: calc.dor.toString(),
      taka: calc.taka.toString(),
      joma: calc.joma.toString(),
      baki: calc.baki.toString(),
      discount: calc.discount?.toString() || "0",
      sign: calc.sign || "",
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.entry) return;

    try {
      await deleteCalculation({
        supplierId,
        id: deleteModal.entry.id
      }).unwrap();
      toast.success("Calculation deleted successfully!");
      setDeleteModal({ isOpen: false, entry: null });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete calculation");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 3) => {
    return num;
  };

  if (isError) {
    return (
      <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          Failed to load calculations
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl transition-colors duration-300 ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } border`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-x-2 md:gap-x-4">
              <BackButton />
              <h1 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {supplierData?.data?.supplierName} - {supplierData?.data?.companyName}
              </h1>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 cursor-pointer sm:flex-none px-3 md:px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Filter size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-sm">Filters</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingNew(true)}
                className={`flex-1 cursor-pointer sm:flex-none px-3 md:px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-sm">Add New</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className={`p-3 md:p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Amount</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(parseFloat(summary.totalTaka))}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Deposit</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 text-green-500`}>
              {formatCurrency(parseFloat(summary.totalJoma))}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Balance</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 ${parseFloat(summary.totalBaki) > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {formatCurrency(parseFloat(summary.totalBaki))}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Quantity</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {parseFloat(summary.totalPoriman).toFixed(3)} <span className="text-xs">units</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl transition-colors duration-300 overflow-hidden ${theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
              } border`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } border`}
                />
              </div>
              <div>
                <label className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } border`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl md:rounded-2xl shadow-xl ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } border`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <tr className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Date</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Description</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Qty</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Rate</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Amount</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Discount</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Deposit</th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">Balance</th>
                
                <th className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 md:px-6 py-8 md:py-12 text-center">
                    <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Loading calculations...
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {/* New Entry Row */}
                  {isAddingNew && (
                    <tr className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-blue-500/10' : 'border-gray-200 bg-blue-50'}`}>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="date"
                          value={newEntryData.calculationDate}
                          onChange={(e) => handleNewEntryChange('calculationDate', e.target.value)}
                          className={`w-full px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.biboron}
                          onChange={(e) => handleNewEntryChange('biboron', e.target.value)}
                          placeholder="Desc"
                          className={`w-full px-1 min-w-28 md:min-w-auto md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.poriman}
                          onChange={(e) => handleNewEntryChange('poriman', e.target.value)}
                          placeholder="0"
                          step="0.001"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.dor}
                          onChange={(e) => handleNewEntryChange('dor', e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.taka}
                          onChange={(e) => handleNewEntryChange('taka', e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                       <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.discount}
                          onChange={(e) => handleNewEntryChange('discount', e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.joma}
                          onChange={(e) => handleNewEntryChange('joma', e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.baki}
                          onChange={(e) => handleNewEntryChange('baki', e.target.value)}
                          placeholder="0"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } border`}
                        />
                      </td>
                     
                      <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSaveNewEntry}
                            className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                              ? 'hover:bg-green-500/20 text-green-400'
                              : 'hover:bg-green-100 text-green-600'
                              }`}
                            title="Save"
                          >
                            <CheckCircle size={14} className="md:w-4 md:h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCancelNewEntry}
                            className={`p-1 rounded-lg cursor-pointer transition-colors duration-300 ${theme === 'dark'
                              ? 'hover:bg-red-500/20 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                              }`}
                            title="Cancel"
                          >
                            <X size={14} className="md:w-4 md:h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Existing Calculations */}
                  {calculations.map((calc: ISupplierCalculation) => (
                    <tr
                      key={calc.id}
                      className={`border-t transition-colors duration-300 ${editingRowId === calc.id
                        ? theme === 'dark'
                          ? 'border-blue-500/30 bg-blue-500/10'
                          : 'border-blue-300 bg-blue-50'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-800/50'
                          : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {editingRowId === calc.id ? (
                        <>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="date"
                              value={editFormData.calculationDate || ""}
                              onChange={(e) => handleEditFieldChange('calculationDate', e.target.value)}
                              className={`w-full min-w-28 md:min-w-auto px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.biboron || ""}
                              onChange={(e) => handleEditFieldChange('biboron', e.target.value)}
                              className={`w-full min-w-28 md:min-w-auto px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.poriman || ""}
                              onChange={(e) => handleEditFieldChange('poriman', e.target.value)}
                              step="0.001"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.dor || ""}
                              onChange={(e) => handleEditFieldChange('dor', e.target.value)}
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.taka || ""}
                              onChange={(e) => handleEditFieldChange('taka', e.target.value)}
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                            <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.discount || ""}
                              onChange={(e) => handleEditFieldChange('discount', e.target.value)}
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.joma || ""}
                              onChange={(e) => handleEditFieldChange('joma', e.target.value)}
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.baki || ""}
                              onChange={(e) => handleEditFieldChange('baki', e.target.value)}
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } border`}
                            />
                          </td>
                        
                          <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSaveEdit}
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                  ? 'hover:bg-green-500/20 text-green-400'
                                  : 'hover:bg-green-100 text-green-600'
                                  }`}
                                title="Save"
                              >
                                <CheckCircle size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleCancelEdit}
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                  ? 'hover:bg-red-500/20 text-red-400'
                                  : 'hover:bg-red-100 text-red-600'
                                  }`}
                                title="Cancel"
                              >
                                <X size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap">
                            {new Date(calc.calculationDate).toLocaleDateString('en-BD', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm max-w-[100px] md:max-w-xs truncate">
                            {calc.biboron || '-'}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm whitespace-nowrap">
                            {formatNumber(calc.poriman)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm whitespace-nowrap">
                            {formatNumber(calc.dor, 2)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-medium whitespace-nowrap">
                            {formatNumber(calc.taka, 2)}
                          </td>
                           <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-purple-500 whitespace-nowrap">
                            {formatNumber(calc.discount || 0, 2)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-green-500 whitespace-nowrap">
                            {formatNumber(calc.joma, 2)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold whitespace-nowrap">
                            <span className={calc.baki > 0 ? 'text-orange-500' : 'text-green-500'}>
                              {formatNumber(calc.baki, 2)}
                            </span>
                          </td>
                         
                          <td className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditClick(calc)}
                                className={`p-1 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                  ? 'hover:bg-blue-500/20 text-blue-400'
                                  : 'hover:bg-blue-100 text-blue-600'
                                  }`}
                                title="Edit"
                              >
                                <Edit size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeleteModal({ isOpen: true, entry: calc })}
                                className={`p-1 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                  ? 'hover:bg-red-500/20 text-red-400'
                                  : 'hover:bg-red-100 text-red-600'
                                  }`}
                                title="Delete"
                              >
                                <Trash2 size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {/* Totals Row */}
                  {!isLoading && calculations.length > 0 && (
                    <tr className={`border-t-2 font-bold ${theme === 'dark' ? 'border-gray-600 bg-gray-800/80' : 'border-gray-300 bg-gray-100'}`}>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold">Totals</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"></td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold">
                        {formatNumber(parseFloat(summary.totalPoriman), 3)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm"></td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold">
                        {formatNumber(parseFloat(summary.totalTaka), 2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-sm"></td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-green-500">
                        {formatNumber(parseFloat(summary.totalJoma), 2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold">
                        <span className={parseFloat(summary.totalBaki) > 0 ? 'text-orange-500' : 'text-green-500'}>
                          {formatNumber(parseFloat(summary.totalBaki), 2)}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-sm"></td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-sm"></td>
                    </tr>
                  )}

                  {!isLoading && calculations.length === 0 && !isAddingNew && (
                    <tr>
                      <td colSpan={9} className="px-4 md:px-6 py-8 md:py-12 text-center">
                        <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          No calculations found
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsAddingNew(true)}
                          className={`mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 text-sm rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                          <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                          Add First Entry
                        </motion.button>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={`p-3 md:p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className={`text-xs md:text-sm order-2 sm:order-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
              </div>
              <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                    } disabled:cursor-not-allowed`}
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </motion.button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 md:w-10 md:h-10 text-sm rounded-lg transition-all duration-300 ${currentPage === pageNum
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                    } disabled:cursor-not-allowed`}
                >
                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && deleteModal.entry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                } border`}
            >
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full mb-4 md:mb-6 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                  <div className={`relative z-10 flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <Trash2 className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                  </div>
                </div>

                <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Delete Calculation?
                </h3>

                <p className={`text-sm md:text-base mb-6 md:mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  This will permanently delete this calculation entry. This action cannot be undone.
                </p>

                <div className="flex gap-3 md:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteModal({ isOpen: false, entry: null })}
                    className={`flex-1 hover:cursor-pointer py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                      }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="flex-1 hover:cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplierCalculation;