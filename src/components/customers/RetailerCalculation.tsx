"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  X,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Loader,
  CheckCircle,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import BackButton from "../reusable-components/BackButton";
import {
  IRetailerCalculation,
  useCreateRetailerCalculationMutation,
  useDeleteRetailerCalculationByIdMutation,
  useGetRetailerCalculationsQuery,
  useUpdateRetailerCalculationMutation,
} from "@/redux/api/customer/retailerCalculationApi";
import { useGetRetailerByIdQuery } from "@/redux/api/customer/retailerApi";

interface RetailerCalculationProps {
  retailerId: string;
}

interface FormData {
  calculationDate: string;
  biboron: string;
  quantity: string;
  rate: string;
  joma: string;
  khoroc: string;
  obosisto: string;
  discount: string;
}

const RetailerCalculation: React.FC<RetailerCalculationProps> = ({
  retailerId,
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    entry: IRetailerCalculation | null;
  }>({
    isOpen: false,
    entry: null,
  });

  // State for inline editing
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FormData>>({});

  // State for new entry row
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEntryData, setNewEntryData] = useState<FormData>({
    calculationDate: new Date().toISOString().split("T")[0],
    biboron: "",
    quantity: "",
    rate: "",
    joma: "",
    khoroc: "",
    obosisto: "",
    discount: "",
  });

  // Get retailer info
  const { data: retailerData } = useGetRetailerByIdQuery(retailerId);
  console.log(retailerData)

  // Get calculations
  const {
    data: calculationsData,
    isLoading,
    isError,
    refetch,
  } = useGetRetailerCalculationsQuery({
    retailerId,
    startDate,
    endDate,
    page: currentPage,
    limit: itemsPerPage,
    sortBy: "calculationDate",
    sortOrder: "DESC",
  });

  const [createCalculation] = useCreateRetailerCalculationMutation();
  const [updateCalculation] = useUpdateRetailerCalculationMutation();
  const [deleteCalculation] = useDeleteRetailerCalculationByIdMutation();

  const calculations = calculationsData?.data || [];
  const summary = calculationsData?.summary || {
    totalJoma: "0",
    totalKhoroc: "0",
    totalObosisto: "0",
    totalDiscount: "0",
    totalQuantity: "0",
    totalRate: "0",
  };
  const pagination = calculationsData?.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 20,
  };

  // Get credit limit and monthly target from retailer data
  const creditLimit = parseFloat(String(retailerData?.data?.creditLimit || 0));
  const monthlyTargetQuantity = parseFloat(
    String(retailerData?.data?.monthlyTarget || 0)
  );

  // Helper to format number with 2 decimal places
  const formatNumber = (num: number): string => {
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  // Helper to parse number safely
  const safeParse = (value: string): number => {
    if (!value || value === "") return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate joma from quantity and rate (quantity * rate)
  const calculateJomaFromQuantityRate = (quantity: number, rate: number): number => {
    return quantity * rate;
  };

  // Get all calculations sorted chronologically to calculate running balance
  const getChronologicalCalculations = () => {
    return [...calculations].sort(
      (a, b) =>
        new Date(a.calculationDate).getTime() - new Date(b.calculationDate).getTime()
    );
  };

  // Get cumulative balance (sum of all joma - khoroc)
  const getCumulativeBalance = (): number => {
    const chronological = getChronologicalCalculations();
    let balance = 0;
    for (const calc of chronological) {
      balance = balance + calc.joma - calc.khoroc;
    }
    return balance;
  };

  // Get total quantity from summary
  const totalQuantity = safeParse(summary.totalQuantity);

  // Get calculations with individual balance (joma - khoroc for each row)
  const getCalculationsWithIndividualBalance = () => {
    const chronological = getChronologicalCalculations();
    // Return in reverse order for display (newest first)
    return [...chronological].reverse().map((calc) => ({
      ...calc,
      individualBalance: calc.joma - calc.khoroc
    }));
  };

  const calculationsWithBalance = getCalculationsWithIndividualBalance();
  const cumulativeBalance = getCumulativeBalance();

  // Get current balance (totalJoma - totalKhoroc)
  const currentBalance = safeParse(summary.totalJoma) - safeParse(summary.totalKhoroc);

  // Check if credit limit is exceeded (for negative balance, check absolute value)
  const isCreditLimitExceeded = creditLimit > 0 &&
    currentBalance < 0 &&
    Math.abs(currentBalance) >= creditLimit;

  // Check if new transaction would exceed credit limit
  const wouldExceedCreditLimit = (newJoma: number, newKhoroc: number): boolean => {
    if (creditLimit <= 0) return false;
    const newBalance = cumulativeBalance + newJoma - newKhoroc;
    // Check if the new balance (if negative) would exceed credit limit
    if (newBalance < 0 && Math.abs(newBalance) > creditLimit) {
      return true;
    }
    return false;
  };
  const [khorocPlaceHolder, setKhorocPlaceHolder] = useState(0);
  // Handle new entry field changes with auto-calculation
  const handleNewEntryChange = (field: string, value: string) => {
    const updatedData = { ...newEntryData, [field]: value };

    // Auto-calculate joma when quantity or rate changes
    if (field === "quantity" || field === "rate") {
      const quantity = safeParse(
        field === "quantity" ? value : newEntryData.quantity
      );
      const rate = safeParse(field === "rate" ? value : newEntryData.rate);
      const calculatedJoma = calculateJomaFromQuantityRate(quantity, rate);
      setKhorocPlaceHolder(calculatedJoma);
      // updatedData.joma = formatNumber(calculatedJoma);

      // Auto-calculate obosisto (joma - khoroc for this entry only)
      const khoroc = safeParse(updatedData.khoroc);
      const calculatedObosisto = calculatedJoma - khoroc;
      updatedData.obosisto = formatNumber(calculatedObosisto);
    }

    // Auto-calculate obosisto when joma or khoroc changes
    if (field === "joma" || field === "khoroc") {
      const joma = safeParse(field === "joma" ? value : newEntryData.joma);
      const khoroc = safeParse(field === "khoroc" ? value : newEntryData.khoroc);
      const calculatedObosisto = joma - khoroc;
      updatedData.obosisto = formatNumber(calculatedObosisto);
    }

    setNewEntryData(updatedData);
  };

  // Handle save new entry
  const handleSaveNewEntry = async () => {
    if (!newEntryData.calculationDate) {
      toast.error("Please select a date");
      return;
    }

    const quantity = safeParse(newEntryData.quantity);
    const rate = safeParse(newEntryData.rate);
    const joma = safeParse(newEntryData.joma);
    const khoroc = safeParse(newEntryData.khoroc);
    const discount = safeParse(newEntryData.discount);


    // Calculate new cumulative balance after this transaction
    const newBalance = cumulativeBalance + joma - khoroc;
    // Check credit limit - prevent entry if credit limit would be exceeded
    if (Math.max(0, creditLimit + currentBalance + Number(newEntryData.joma)) < Number(newEntryData.khoroc)) {
      console.log(creditLimit + currentBalance);
      toast.error(
        `This transaction would exceed the credit limit of ${formatCurrency(
          creditLimit
        )}! Available balance: ${formatCurrency(
          Math.max(0, creditLimit + currentBalance)
        )}`,
        {
          duration: 5000,
          icon: "⚠️",
        }
      );
      return;
    }

    try {
      const saveData = {
        calculationDate: newEntryData.calculationDate,
        biboron: newEntryData.biboron || "",
        quantity: quantity,
        rate: rate,
        joma: joma,
        khoroc: khoroc,
        obosisto: newBalance,
        discount: discount,
      };

      await createCalculation({
        retailerId,
        data: saveData,
      }).unwrap();
      toast.success("Calculation added successfully!");
      setIsAddingNew(false);
      setNewEntryData({
        calculationDate: new Date().toISOString().split("T")[0],
        biboron: "",
        quantity: "",
        rate: "",
        joma: "",
        khoroc: "",
        obosisto: "",
        discount: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save calculation");
    }
  };

  // Handle edit field changes - with proper auto-calculation
  const handleEditFieldChange = (field: string, value: string) => {
    const updatedData = { ...editFormData, [field]: value };

    // When quantity or rate changes, recalculate joma
    if (field === "quantity" || field === "rate") {
      const quantity = safeParse(
        field === "quantity" ? value : (editFormData.quantity as string) || "0"
      );
      const rate = safeParse(
        field === "rate" ? value : (editFormData.rate as string) || "0"
      );
    }

    setEditFormData(updatedData);
  };

  // Handle save edited entry - recalculate cumulative balance for this and all subsequent entries
  const handleSaveEdit = async () => {
    if (!editingRowId) return;
    if (!editFormData.calculationDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      // Get all calculations to recalculate running balances
      const allCalculations = getChronologicalCalculations();
      const currentCalcIndex = allCalculations.findIndex(c => c.id === editingRowId);
      const currentCalc = allCalculations[currentCalcIndex];

      if (!currentCalc) {
        toast.error("Calculation not found");
        return;
      }

      // Prepare updated values
      const updatedQuantity = safeParse(editFormData.quantity as string);
      const updatedRate = safeParse(editFormData.rate as string);
      const updatedJoma = safeParse(editFormData.joma as string);
      const updatedKhoroc = safeParse(editFormData.khoroc as string);
      const updatedDiscount = safeParse(editFormData.discount as string);

      // Recalculate cumulative balance for this entry and all subsequent entries
      let runningBalance = 0;
      const updatedEntries = [];

      for (let i = 0; i < allCalculations.length; i++) {
        const calc = allCalculations[i];
        if (i === currentCalcIndex) {
          // This is the edited entry - use new values
          runningBalance = runningBalance + updatedJoma - updatedKhoroc;
          updatedEntries.push({
            id: calc.id,
            obosisto: runningBalance
          });
        } else if (i > currentCalcIndex) {
          // Subsequent entries - recalculate with original joma/khoroc
          runningBalance = runningBalance + calc.joma - calc.khoroc;
          updatedEntries.push({
            id: calc.id,
            obosisto: runningBalance
          });
        } else {
          // Previous entries - keep original obosisto
          runningBalance = calc.obosisto;
        }
      }

      // First update the current calculation
      await updateCalculation({
        retailerId,
        id: editingRowId,
        data: {
          calculationDate: editFormData.calculationDate,
          biboron: editFormData.biboron || "",
          quantity: updatedQuantity,
          rate: updatedRate,
          joma: updatedJoma,
          khoroc: updatedKhoroc,
          obosisto: updatedEntries.find(e => e.id === editingRowId)?.obosisto || runningBalance,
          discount: updatedDiscount,
        },
      }).unwrap();

      // Then update subsequent calculations' obosisto values
      for (const entry of updatedEntries) {
        if (entry.id !== editingRowId) {
          await updateCalculation({
            retailerId,
            id: entry.id,
            data: {
              ...allCalculations.find(c => c.id === entry.id)!,
              obosisto: entry.obosisto,
            },
          }).unwrap();
        }
      }

      toast.success("Calculation updated successfully!");
      setEditingRowId(null);
      setEditFormData({});
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update calculation");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditFormData({});
  };

  // Handle cancel new entry
  const handleCancelNewEntry = () => {
    setIsAddingNew(false);
    setNewEntryData({
      calculationDate: new Date().toISOString().split("T")[0],
      biboron: "",
      quantity: "",
      rate: "",
      joma: "",
      khoroc: "",
      obosisto: "",
      discount: "",
    });
  };

  // Handle edit button click - pre-fill all data from the calculation
  const handleEditClick = (calc: IRetailerCalculation) => {
    setEditingRowId(calc.id);
    setEditFormData({
      calculationDate: calc.calculationDate,
      biboron: calc.biboron || "",
      quantity: calc.quantity !== undefined && calc.quantity !== null && calc.quantity !== 0
        ? calc.quantity.toString()
        : "",
      rate: calc.rate !== undefined && calc.rate !== null && calc.rate !== 0
        ? calc.rate.toString()
        : "",
      joma: calc.joma !== 0 ? calc.joma.toString() : "",
      khoroc: calc.khoroc !== 0 ? calc.khoroc.toString() : "",
      obosisto: calc.obosisto !== 0 ? calc.obosisto.toString() : "",
      discount: calc.discount !== undefined && calc.discount !== null && calc.discount !== 0
        ? calc.discount.toString()
        : "",
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.entry) return;

    try {
      // Get all calculations to recalculate balances after deletion
      const allCalculations = getChronologicalCalculations();
      const deleteIndex = allCalculations.findIndex(c => c.id === deleteModal.entry!.id);

      // First delete the entry
      await deleteCalculation({
        retailerId,
        id: deleteModal.entry.id,
      }).unwrap();

      // Recalculate cumulative balances for entries after the deleted one
      let runningBalance = 0;
      for (let i = 0; i < allCalculations.length; i++) {
        const calc = allCalculations[i];
        if (i < deleteIndex) {
          runningBalance = calc.obosisto;
        } else if (i > deleteIndex) {
          // Recalculate this entry's obosisto
          const newObosisto = runningBalance + calc.joma - calc.khoroc;
          await updateCalculation({
            retailerId,
            id: calc.id,
            data: {
              ...calc,
              obosisto: newObosisto,
            },
          }).unwrap();
          runningBalance = newObosisto;
        }
      }

      toast.success("Calculation deleted successfully!");
      setDeleteModal({ isOpen: false, entry: null });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete calculation");
    }
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "৳0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate remaining target
  const remainingTarget = monthlyTargetQuantity > 0
    ? Math.max(0, monthlyTargetQuantity - totalQuantity).toFixed(2)
    : 0;
  const targetAchieved = monthlyTargetQuantity > 0 && totalQuantity >= monthlyTargetQuantity;

  if (isError) {
    return (
      <div
        className={`text-center py-12 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
      >
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
          Failed to load calculations
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === "dark"
            ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
            : "bg-purple-500 text-white hover:bg-purple-600"
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
        className={`rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl transition-colors duration-300 ${theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } border`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-x-2 md:gap-x-4">
                <BackButton />
                <h1
                  className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                >
                  {retailerData?.data?.shopName} -{" "}
                  {retailerData?.data?.tradeLicenseNo} |{" "}
                  {retailerData?.data?.binNo}
                </h1>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 cursor-pointer sm:flex-none px-3 md:px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Filter size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-sm">Filters</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingNew(true)}
                className={`flex-1 cursor-pointer sm:flex-none px-3 md:px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                  : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
              >
                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-sm">Add New</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Credit Limit Warning Notification */}
        <AnimatePresence>
          {creditLimit > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`mt-4 rounded-xl overflow-hidden border ${isCreditLimitExceeded
                ? theme === "dark"
                  ? "border-red-500/50 bg-gradient-to-r from-red-950/80 to-orange-950/80"
                  : "border-red-400 bg-gradient-to-r from-red-50 to-orange-50"
                : theme === "dark"
                  ? "border-blue-500/30 bg-gradient-to-r from-blue-950/50 to-cyan-950/50"
                  : "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50"
                }`}
            >
              <div className="relative px-4 py-3 md:px-6 md:py-4">
                {isCreditLimitExceeded && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={
                        isCreditLimitExceeded
                          ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 10, -10, 0],
                          }
                          : { scale: 1 }
                      }
                      transition={
                        isCreditLimitExceeded
                          ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
                          : {}
                      }
                    >
                      {isCreditLimitExceeded ? (
                        <ShieldAlert
                          className={`w-6 h-6 md:w-7 md:h-7 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        />
                      ) : (
                        <TrendingUp
                          className={`w-6 h-6 md:w-7 md:h-7 ${theme === "dark" ? "text-blue-400" : "text-blue-500"
                            }`}
                        />
                      )}
                    </motion.div>

                    <div>
                      <p
                        className={`text-sm md:text-base font-semibold ${isCreditLimitExceeded
                          ? theme === "dark"
                            ? "text-red-300"
                            : "text-red-700"
                          : theme === "dark"
                            ? "text-blue-300"
                            : "text-blue-700"
                          }`}
                      >
                        Credit Limit: {formatCurrency(creditLimit)}
                      </p>
                      <p
                        className={`text-xs md:text-sm ${isCreditLimitExceeded
                          ? theme === "dark"
                            ? "text-red-400/80"
                            : "text-red-600/80"
                          : theme === "dark"
                            ? "text-blue-400/80"
                            : "text-blue-600/80"
                          }`}
                      >
                        Current Balance: {currentBalance < 0 ? "BDT " : "BDT "}{currentBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base ${isCreditLimitExceeded
                      ? theme === "dark"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-red-100 text-red-700 border border-red-300"
                      : theme === "dark"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-blue-100 text-blue-700 border border-blue-300"
                      }`}
                  >
                    {isCreditLimitExceeded ? (
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center gap-1"
                      >
                        ⚠️ LIMIT EXCEEDED
                      </motion.span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Available Credit:{" "}
                        {currentBalance < 0
                          ? formatCurrency(Math.max(0, creditLimit - Math.abs(currentBalance)))
                          : formatCurrency(creditLimit)}
                      </span>
                    )}
                  </motion.div>
                </div>

                <div className="relative mt-3 h-1.5 md:h-2 rounded-full overflow-hidden bg-gray-300/30 dark:bg-gray-700/50">
                  {currentBalance < 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (Math.abs(currentBalance) / creditLimit) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-full rounded-full ${isCreditLimitExceeded
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : Math.abs(currentBalance) / creditLimit > 0.8
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                        }`}
                    />
                  )}
                </div>

                {isCreditLimitExceeded && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-xs md:text-sm mt-2 flex items-center gap-1 ${theme === "dark" ? "text-red-400/90" : "text-red-600/90"
                      }`}
                  >
                    <AlertCircle size={14} />
                    The outstanding balance exceeds the approved credit limit. Cannot add new entries until balance is reduced.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-4 md:mt-6">
          <div
            className={`p-3 md:p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
          >
            <p
              className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Total Debit (Joma)
            </p>
            <p className="text-lg md:text-2xl font-bold mt-1 text-green-500">
              {formatCurrency(safeParse(summary.totalJoma))}
            </p>
          </div>

          <div
            className={`p-3 md:p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
          >
            <p
              className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Total Credit (Khoroc)
            </p>
            <p className="text-lg md:text-2xl font-bold mt-1 text-red-500">
              {formatCurrency(safeParse(summary.totalKhoroc))}
            </p>
          </div>

          <div
            className={`p-3 md:p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
          >
            <p
              className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Balance (Obosisto)
            </p>
            <p
              className={`text-lg md:text-2xl font-bold mt-1 ${isCreditLimitExceeded
                ? "text-red-500"
                : currentBalance > 0
                  ? "text-green-500"
                  : currentBalance < 0
                    ? "text-red-500"
                    : theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                }`}
            >
              {formatNumber(currentBalance)}
            </p>
          </div>

          <div
            className={`p-3 md:p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
          >
            <p
              className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Total Quantity
            </p>
            <p className="text-lg md:text-2xl font-bold mt-1 text-blue-500">
              {totalQuantity.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-3 md:p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
          >
            <p
              className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Monthly Target (Quantity)
            </p>
            <p className="text-lg md:text-2xl font-bold mt-1 text-amber-500">
              {monthlyTargetQuantity > 0 ? (
                targetAchieved ? (
                  <span className="text-green-500">✓ Target Achieved</span>
                ) : (
                  `Remaining: ${remainingTarget}`
                )
              ) : (
                "No Target Set"
              )}
            </p>
          </div>


        </div>
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl transition-colors duration-300 overflow-hidden ${theme === "dark"
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
              : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
              } border`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                    } border`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                    } border`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 md:gap-3 mt-3 md:mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-sm rounded-lg transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Clear
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentPage(1);
                  refetch();
                }}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-sm rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === "dark"
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                  : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
              >
                <Search size={14} className="md:w-[18px] md:h-[18px]" />
                Apply
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl md:rounded-2xl overflow-hidden shadow-xl ${theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } border`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead
              className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
            >
              <tr className={theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}>
                <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">
                  Date
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">
                  Description
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-blue-600">
                  Quantity
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-purple-600">
                  Rate
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-green-600">
                  Debit (Joma)
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-red-600">
                  Credit (Khoroc)
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold">
                  Balance
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-amber-600">
                  Discount
                </th>
                <th className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 md:px-6 py-8 md:py-12 text-center"
                  >
                    <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin mx-auto mb-2 text-purple-500" />
                    <p
                      className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Loading calculations...
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {/* New Entry Row - Disabled if credit limit exceeded */}
                  {isAddingNew && (
                    <tr
                      className={`border-t ${theme === "dark"
                        ? "border-gray-700 bg-purple-500/10"
                        : "border-gray-200 bg-purple-50"
                        }`}
                    >
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="date"
                          value={newEntryData.calculationDate}
                          onChange={(e) =>
                            handleNewEntryChange("calculationDate", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          className={`w-full px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.biboron}
                          onChange={(e) =>
                            handleNewEntryChange("biboron", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          placeholder="Description"
                          className={`w-full px-1 min-w-28 md:min-w-auto md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="string"
                          value={newEntryData.quantity}
                          onChange={(e) =>
                            handleNewEntryChange("quantity", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          placeholder="0.00"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="string"
                          value={newEntryData.rate}
                          onChange={(e) =>
                            handleNewEntryChange("rate", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          placeholder="0.00"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          value={newEntryData.joma}
                          onChange={(e) =>
                            handleNewEntryChange("joma", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          placeholder="0.00"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="string"
                          value={newEntryData.khoroc}
                          onChange={(e) => handleNewEntryChange("khoroc", e.target.value)}
                          disabled={isCreditLimitExceeded}
                          placeholder={khorocPlaceHolder.toString()}
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="text"
                          readOnly
                          value={newEntryData.joma || newEntryData.khoroc ? newEntryData.obosisto : ''}
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded bg-gray-100 font-medium ${theme === "dark"
                            ? "bg-gray-600 text-white"
                            : "bg-gray-100 text-gray-900"
                            }`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4">
                        <input
                          type="string"
                          value={newEntryData.discount}
                          onChange={(e) =>
                            handleNewEntryChange("discount", e.target.value)
                          }
                          disabled={isCreditLimitExceeded}
                          placeholder="0.00"
                          step="0.01"
                          className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                            } border`}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSaveNewEntry}
                            disabled={isCreditLimitExceeded}
                            className={`p-1 rounded-lg transition-colors duration-300 ${isCreditLimitExceeded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${theme === "dark"
                              ? "hover:bg-purple-500/20 text-purple-400"
                              : "hover:bg-purple-100 text-purple-600"
                              }`}
                            title={isCreditLimitExceeded ? "Cannot add - credit limit exceeded" : "Save"}
                          >
                            <CheckCircle size={14} className="md:w-4 md:h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCancelNewEntry}
                            className={`p-1 rounded-lg cursor-pointer transition-colors duration-300 ${theme === "dark"
                              ? "hover:bg-red-500/20 text-red-400"
                              : "hover:bg-red-100 text-red-600"
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
                  {calculationsWithBalance.map((calc) => (
                    <tr
                      key={calc.id}
                      className={`border-t transition-colors duration-300 ${editingRowId === calc.id
                        ? theme === "dark"
                          ? "border-purple-500/30 bg-purple-500/10"
                          : "border-purple-300 bg-purple-50"
                        : theme === "dark"
                          ? "border-gray-700 hover:bg-gray-800/50"
                          : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      {editingRowId === calc.id ? (
                        <>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="date"
                              value={editFormData.calculationDate || ""}
                              onChange={(e) =>
                                handleEditFieldChange(
                                  "calculationDate",
                                  e.target.value
                                )
                              }
                              className={`w-full min-w-28 md:min-w-auto px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.biboron || ""}
                              onChange={(e) =>
                                handleEditFieldChange("biboron", e.target.value)
                              }
                              className={`w-full min-w-28 md:min-w-auto px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.quantity || ""}
                              onChange={(e) =>
                                handleEditFieldChange("quantity", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.rate || ""}
                              onChange={(e) =>
                                handleEditFieldChange("rate", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.joma || ""}
                              onChange={(e) =>
                                handleEditFieldChange("joma", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.khoroc || ""}
                              onChange={(e) =>
                                handleEditFieldChange("khoroc", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={Number(editFormData.joma) - Number(editFormData.khoroc) || ""}
                              onChange={(e) =>
                                handleEditFieldChange("obosisto", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4">
                            <input
                              type="text"
                              value={editFormData.discount || ""}
                              onChange={(e) =>
                                handleEditFieldChange("discount", e.target.value)
                              }
                              step="0.01"
                              className={`w-full min-w-28 md:min-w-auto text-right px-1 md:px-2 py-1 text-xs md:text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                } border`}
                            />
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSaveEdit}
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === "dark"
                                  ? "hover:bg-purple-500/20 text-purple-400"
                                  : "hover:bg-purple-100 text-purple-600"
                                  }`}
                                title="Save"
                              >
                                <CheckCircle size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleCancelEdit}
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === "dark"
                                  ? "hover:bg-red-500/20 text-red-400"
                                  : "hover:bg-red-100 text-red-600"
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
                            {new Date(calc.calculationDate).toLocaleDateString(
                              "en-BD",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm max-w-[100px] md:max-w-xs truncate">
                            {calc.biboron || "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-blue-600 font-medium whitespace-nowrap">
                            {calc.quantity && calc.quantity !== 0
                              ? Number(calc.quantity).toFixed(2)
                              : "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-purple-600 font-medium whitespace-nowrap">
                            {calc.rate && calc.rate !== 0
                              ? Number(calc.rate).toFixed(2)
                              : "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-green-600 font-medium whitespace-nowrap">
                            {calc.joma !== 0 ? Number(calc.joma).toFixed(2) : "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-red-600 font-medium whitespace-nowrap">
                            {calc.khoroc !== 0
                              ? Number(calc.khoroc).toFixed(2)
                              : "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold whitespace-nowrap">
                            <span
                              className={
                                calc.individualBalance > 0
                                  ? "text-green-600"
                                  : calc.individualBalance < 0
                                    ? "text-red-600"
                                    : "text-gray-500"
                              }
                            >
                              {calc.individualBalance.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm text-amber-600 font-medium whitespace-nowrap">
                            {calc.discount && calc.discount !== 0
                              ? Number(calc.discount).toFixed(2)
                              : "-"}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditClick(calc)}
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === "dark"
                                  ? "hover:bg-purple-500/20 text-purple-400"
                                  : "hover:bg-purple-100 text-purple-600"
                                  }`}
                                title="Edit"
                              >
                                <Edit size={14} className="md:w-4 md:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  setDeleteModal({ isOpen: true, entry: calc })
                                }
                                className={`p-1 cursor-pointer rounded-lg transition-colors duration-300 ${theme === "dark"
                                  ? "hover:bg-red-500/20 text-red-400"
                                  : "hover:bg-red-100 text-red-600"
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
                    <tr
                      className={`border-t-2 font-bold ${theme === "dark"
                        ? "border-gray-600 bg-gray-800/80"
                        : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold">
                        Totals
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">
                        {" "}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-blue-600">
                        {totalQuantity.toLocaleString()}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-purple-600">
                        {safeParse(
                          (summary as { totalRate?: string }).totalRate || "0"
                        ).toFixed(2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-green-600">
                        {safeParse(summary.totalJoma).toFixed(2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-red-600">
                        {safeParse(summary.totalKhoroc).toFixed(2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold">
                        <span
                          className={
                            isCreditLimitExceeded
                              ? "text-red-500"
                              : currentBalance > 0
                                ? "text-green-600"
                                : currentBalance < 0
                                  ? "text-red-600"
                                  : "text-gray-500"
                          }
                        >
                          {formatNumber(currentBalance)}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-amber-600">
                        {safeParse(
                          (summary as { totalDiscount?: string }).totalDiscount || "0"
                        ).toFixed(2)}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3">   </td>
                    </tr>
                  )}

                  {!isLoading && calculations.length === 0 && !isAddingNew && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 md:px-6 py-8 md:py-12 text-center"
                      >
                        <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <p
                          className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          No calculations found
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsAddingNew(true)}
                          className={`mt-3 cursor-pointer md:mt-4 px-3 md:px-4 py-1.5 md:py-2 text-sm rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === "dark"
                            ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                            : "bg-purple-500 text-white hover:bg-purple-600"
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
          <div
            className={`p-3 md:p-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div
                className={`text-xs md:text-sm order-2 sm:order-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} entries
              </div>
              <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30"
                    } disabled:cursor-not-allowed`}
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </motion.button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
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
                            ? theme === "dark"
                              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                              : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                            : theme === "dark"
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    }
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30"
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
              className={`rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl ${theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                } border`}
            >
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full mb-4 md:mb-6 relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                  <div
                    className={`relative z-10 flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                  >
                    <Trash2 className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                  </div>
                </div>

                <h3
                  className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                >
                  Delete Calculation?
                </h3>

                <p
                  className={`text-sm md:text-base mb-6 md:mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  This will permanently delete this calculation entry. This
                  action cannot be undone.
                </p>

                <div className="flex gap-3 md:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setDeleteModal({ isOpen: false, entry: null })
                    }
                    className={`flex-1 hover:cursor-pointer py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 border ${theme === "dark"
                      ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
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

export default RetailerCalculation;