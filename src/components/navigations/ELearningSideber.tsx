"use client";

import * as Avatar from "@radix-ui/react-avatar";
import {
  Home,
  Users,
  MessageSquare,
  Send,
  UserCheck,
  ChevronDown,
  ExternalLink,
  History,
  Lock,
  X,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  Building2,
  UserCog,
  ClipboardList,
  PlusCircle,
  Inbox,
  FileQuestion,
  DollarSign,
  FileText,
  Megaphone,
  Bell,
  Mail,
  BookOpen,
  Award,
  GraduationCap,
  FolderTree,
  Star,
  Layout,
  Shield,
  Video,
  MonitorPlay,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useEffect, useState } from "react";
import homeLogo from '../../../public/The_Logo/linuxeon_logo.png';
import homeLogoDark from '../../../public/The_Logo/linuxeon_logo.png';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { CgTemplate } from "react-icons/cg";
import { useTheme } from "next-themes";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useGetEnterpriseByIdQuery } from "@/redux/api/authentication/authApi";
import { getUserInfo } from "@/utils/helper/userFromToken";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";

interface EnterpriseSidebarProps {
  isOpen?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  isOpen = true,
  onToggleSidebar,
  isMobile = false,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) {
        router.push("/");
      } else {
        setUser(userInfo);
      }
    };
    fetchUser();
  }, [router]);

  const handleProfileRedirect = () => {
    router.push(`/admin/update-profile/${user?.id}`);
  }

  // Fetch enterprise data using the enterprise ID
  const { data: enterpriseData, isLoading: isEnterpriseLoading } = useGetEnterpriseByIdQuery(
    user?.id || "",
    {
      skip: !user?.id,
    }
  );

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync internal state with prop
  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Get menu items based on user role
  const getMenuByRole = () => {
    // Brother Enterprise menu items
// Enterprise Menu Items (for Brother Enterprise / Training Center)
const enterpriseMenuItems = [
  {
    key: "dashboard",
    icon: <Home size={20} />,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    key: "courses",
    icon: <GraduationCap size={20} />,
    label: "Course Management",
    subItems: [
      {
        key: "all-courses",
        icon: <BookOpen size={16} />,
        label: "All Courses",
        href: "/admin/courses",
      },
      {
        key: "add-course",
        icon: <PlusCircle size={16} />,
        label: "Add New Course",
        href: "/admin/courses/add",
      },
      {
        key: "course-categories",
        icon: <FolderTree size={16} />,
        label: "Categories",
        href: "/admin/courses/categories",
      },
      {
        key: "course-enrollments",
        icon: <UserCheck size={16} />,
        label: "Enrollments",
        href: "/admin/courses/enrollments",
      },
    ],
  },
  {
    key: "classes",
    icon: <Video size={20} />,
    label: "Class Management",
    subItems: [
      {
        key: "live-classes",
        icon: <MonitorPlay size={16} />,
        label: "Live Classes",
        href: "/admin/classes/live",
      },
      {
        key: "recorded-classes",
        icon: <Video size={16} />,
        label: "Recorded Classes",
        href: "/admin/classes/recorded",
      },
      {
        key: "class-schedule",
        icon: <Calendar size={16} />,
        label: "Class Schedule",
        href: "/admin/classes/schedule",
      },
      {
        key: "attendance",
        icon: <UserCheck size={16} />,
        label: "Attendance",
        href: "/admin/classes/attendance",
      },
    ],
  },
  {
    key: "students",
    icon: <Users size={20} />,
    label: "Student Management",
    subItems: [
      {
        key: "all-students",
        icon: <Users size={16} />,
        label: "All Students",
        href: "/admin/students",
      },
      {
        key: "student-enrollments",
        icon: <UserCheck size={16} />,
        label: "Enrollments",
        href: "/admin/students/enrollments",
      },
      {
        key: "student-progress",
        icon: <TrendingUp size={16} />,
        label: "Progress Tracking",
        href: "/admin/students/progress",
      },
      {
        key: "student-payments",
        icon: <CreditCard size={16} />,
        label: "Payments",
        href: "/admin/students/payments",
      },
    ],
  },
  {
    key: "certificates",
    icon: <Award size={20} />,
    label: "Certificate Management",
    subItems: [
      {
        key: "issue-certificate",
        icon: <FileText size={16} />,
        label: "Issue Certificate",
        href: "/admin/certificates/issue",
      },
      {
        key: "all-certificates",
        icon: <Award size={16} />,
        label: "All Certificates",
        href: "/admin/certificates/all-certificate",
      },
      {
        key: "certificate-templates",
        icon: <Layout size={16} />,
        label: "Templates",
        href: "/admin/certificates/templates",
      },
      {
        key: "verify-certificate",
        icon: <Shield size={16} />,
        label: "Verify Certificate",
        href: "/admin/certificates/verify",
      },
    ],
  },
  {
    key: "assignments",
    icon: <ClipboardList size={20} />,
    label: "Assignments & Exams",
    subItems: [
      {
        key: "all-assignments",
        icon: <ClipboardList size={16} />,
        label: "All Assignments",
        href: "/admin/assignments",
      },
      {
        key: "create-assignment",
        icon: <PlusCircle size={16} />,
        label: "Create Assignment",
        href: "/admin/assignments/create",
      },
      {
        key: "submissions",
        icon: <Inbox size={16} />,
        label: "Submissions",
        href: "/admin/assignments/submissions",
      },
      {
        key: "exams",
        icon: <FileQuestion size={16} />,
        label: "Online Exams",
        href: "/admin/exams",
      },
      {
        key: "results",
        icon: <BarChart3 size={16} />,
        label: "Results",
        href: "/admin/exams/results",
      },
    ],
  },
  {
    key: "payments",
    icon: <CreditCard size={20} />,
    label: "Payment Management",
    subItems: [
      {
        key: "fee-collection",
        icon: <DollarSign size={16} />,
        label: "Fee Collection",
        href: "/admin/payments/fee-collection",
      },
      {
        key: "payment-history",
        icon: <History size={16} />,
        label: "Payment History",
        href: "/admin/payments/history",
      },
      {
        key: "invoices",
        icon: <FileText size={16} />,
        label: "Invoices",
        href: "/admin/payments/invoices",
      },
      {
        key: "payment-methods",
        icon: <CreditCard size={16} />,
        label: "Payment Methods",
        href: "/admin/payments/methods",
      },
    ],
  },
  {
    key: "communication",
    icon: <MessageSquare size={20} />,
    label: "Communication",
    subItems: [
      {
        key: "announcements",
        icon: <Megaphone size={16} />,
        label: "Announcements",
        href: "/admin/communication/announcements",
      },
      {
        key: "send-notification",
        icon: <Bell size={16} />,
        label: "Send Notification",
        href: "/admin/communication/notifications",
      },
      {
        key: "email-blast",
        icon: <Mail size={16} />,
        label: "Email Blast",
        href: "/admin/communication/email",
      },
      {
        key: "sms-blast",
        icon: <Send size={16} />,
        label: "SMS Blast",
        href: "/admin/communication/sms",
      },
    ],
  },
  {
    key: "reports",
    icon: <BarChart3 size={20} />,
    label: "Reports & Analytics",
    subItems: [
      {
        key: "student-report",
        icon: <Users size={16} />,
        label: "Student Report",
        href: "/admin/reports/students",
      },
      {
        key: "financial-report",
        icon: <DollarSign size={16} />,
        label: "Financial Report",
        href: "/admin/reports/financial",
      },
      {
        key: "course-report",
        icon: <BookOpen size={16} />,
        label: "Course Report",
        href: "/admin/reports/courses",
      },
      {
        key: "certificate-report",
        icon: <Award size={16} />,
        label: "Certificate Report",
        href: "/admin/reports/certificates",
      },
    ],
  },
  {
    key: "settings",
    icon: <Settings size={20} />,
    label: "Settings",
    subItems: [
      {
        key: "profile",
        icon: <UserCog size={16} />,
        label: "Profile Settings",
        href: "/admin/settings/profile",
      },
      {
        key: "institute",
        icon: <Building2 size={16} />,
        label: "Institute Info",
        href: "/admin/settings/institute",
      },
      {
        key: "change-password",
        icon: <Lock size={16} />,
        label: "Change Password",
        href: "/admin/settings/change-password",
      },
    ],
  },
];

// Admin Menu Items (for Super Admin / Platform Owner)
const adminMenuItems = [
  {
    key: "dashboard",
    icon: <Home size={20} />,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    key: "institutes",
    icon: <Building2 size={20} />,
    label: "Institute Management",
    subItems: [
      {
        key: "all-institutes",
        icon: <Building2 size={16} />,
        label: "All Institutes",
        href: "/admin/institutes",
      },
      {
        key: "pending-institutes",
        icon: <UserCog size={16} />,
        label: "Pending Approvals",
        href: "/admin/institutes/pending",
      },
      {
        key: "institute-subscription",
        icon: <CreditCard size={16} />,
        label: "Subscriptions",
        href: "/admin/institutes/subscriptions",
      },
    ],
  },
  {
    key: "courses",
    icon: <GraduationCap size={20} />,
    label: "Course Management",
    subItems: [
      {
        key: "all-courses",
        icon: <BookOpen size={16} />,
        label: "All Courses",
        href: "/admin/courses",
      },
      {
        key: "course-categories",
        icon: <FolderTree size={16} />,
        label: "Categories",
        href: "/admin/courses/categories",
      },
      {
        key: "featured-courses",
        icon: <Star size={16} />,
        label: "Featured Courses",
        href: "/admin/courses/featured",
      },
    ],
  },
  {
    key: "users",
    icon: <Users size={20} />,
    label: "User Management",
    subItems: [
      {
        key: "all-users",
        icon: <Users size={16} />,
        label: "All Users",
        href: "/admin/users",
      },
      {
        key: "students",
        icon: <UserCheck size={16} />,
        label: "Students",
        href: "/admin/users/students",
      },
      {
        key: "instructors",
        icon: <UserCog size={16} />,
        label: "Instructors",
        href: "/admin/users/instructors",
      },
      {
        key: "admins",
        icon: <Shield size={16} />,
        label: "Admins",
        href: "/admin/users/admins",
      },
    ],
  },
  {
    key: "certificates",
    icon: <Award size={20} />,
    label: "Certificate Management",
    subItems: [
      {
        key: "all-certificates",
        icon: <Award size={16} />,
        label: "All Certificates",
        href: "/admin/certificates",
      },
      {
        key: "certificate-templates",
        icon: <Layout size={16} />,
        label: "Global Templates",
        href: "/admin/certificates/templates",
      },
      {
        key: "verify-certificate",
        icon: <Shield size={16} />,
        label: "Verify Certificate",
        href: "/admin/certificates/verify",
      },
    ],
  },
  {
    key: "payments",
    icon: <CreditCard size={20} />,
    label: "Payment Management",
    subItems: [
      {
        key: "transactions",
        icon: <History size={16} />,
        label: "All Transactions",
        href: "/admin/payments/transactions",
      },
      {
        key: "subscriptions",
        icon: <CreditCard size={16} />,
        label: "Subscriptions",
        href: "/admin/payments/subscriptions",
      },
      {
        key: "payouts",
        icon: <DollarSign size={16} />,
        label: "Institute Payouts",
        href: "/admin/payments/payouts",
      },
    ],
  },
  {
    key: "reports",
    icon: <BarChart3 size={20} />,
    label: "Reports",
    subItems: [
      {
        key: "platform-report",
        icon: <BarChart3 size={16} />,
        label: "Platform Report",
        href: "/admin/reports/platform",
      },
      {
        key: "institute-report",
        icon: <Building2 size={16} />,
        label: "Institute Report",
        href: "/admin/reports/institutes",
      },
      {
        key: "revenue-report",
        icon: <DollarSign size={16} />,
        label: "Revenue Report",
        href: "/admin/reports/revenue",
      },
    ],
  },
  {
    key: "settings",
    icon: <Settings size={20} />,
    label: "System Settings",
    subItems: [
      {
        key: "platform-settings",
        icon: <Settings size={16} />,
        label: "Platform Settings",
        href: "/admin/settings/platform",
      },
      {
        key: "email-templates",
        icon: <Mail size={16} />,
        label: "Email Templates",
        href: "/admin/settings/email-templates",
      },
      {
        key: "sms-settings",
        icon: <Send size={16} />,
        label: "SMS Settings",
        href: "/admin/settings/sms",
      },
      {
        key: "payment-gateways",
        icon: <CreditCard size={16} />,
        label: "Payment Gateways",
        href: "/admin/settings/payment-gateways",
      },
    ],
  },
];

    if (user && user?.role === "brother-enterprise") {
      return enterpriseMenuItems;
    } else if (user && (user?.role === "admin" || user?.role === "super_admin")) {
      return adminMenuItems;
    } else {
      return [];
    }
  };

  // Get display name based on user role
  const getDisplayName = () => {
    if (isEnterpriseLoading) return "Loading...";
    
    if (user?.role === "brother-enterprise") {
      return enterpriseData?.data?.companyName || user?.companyName || "Brother Enterprise";
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.fullName || "Admin";
    }
    return "User";
  };

  // Get display email based on user role
  const getDisplayEmail = () => {
    if (isEnterpriseLoading) return "Loading...";
    
    if (user?.role === "brother-enterprise") {
      return enterpriseData?.data?.email || user?.email || "info@brother-enterprise.com";
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.email || "admin@example.com";
    }
    return "user@example.com";
  };

  // Get profile image based on user role
  const getProfileImage = () => {
    if (user?.role === "brother-enterprise") {
      return enterpriseData?.data?.ownerPhoto || "";
    }
    return "";
  };

  // Get profile initial based on user role
  const getProfileInitial = () => {
    if (user?.role === "brother-enterprise") {
      const companyName = enterpriseData?.data?.companyName || user?.companyName || "B";
      return companyName.charAt(0);
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.fullName?.charAt(0) || "A";
    }
    return "U";
  };

  // Improved isActive function
  const isActive = (href: string) => {
    if (!pathname || !href) return false;

    // For dashboard, exact match
    if (href === "/enterprise/dashboard" || href === "/admin/dashboard") {
      return pathname === href;
    }

    // For other routes, check if current path starts with href
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href;

    return normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + '/');
  };

  const handleLogout = () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    shareWithCookies("remove", `${appConfiguration.appCode}refreshToken`);
    router.push("/");
    router.refresh();
  };

  // Auto-open submenu based on current route
  useEffect(() => {
    if (!pathname) return;

    // Check each menu item for subitems that match current path
    for (const item of getMenuByRole()) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (isActive(subItem.href)) {
            setActiveSubmenu(item.key);
            return;
          }
        }
      }
    }

    // If no subitem matches, close all submenus
    setActiveSubmenu(null);
  }, [pathname]);

  // Helper function to check if any subitem is active
  const isActiveSubmenu = (item): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem: { href: string }) => isActive(subItem.href));
  };

  // Mobile close handler
  const handleMobileClose = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const displayIsOpen = isMobile ? isOpen : internalIsOpen;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: displayIsOpen ? (isMobile ? "100%" : 260) : 70,
        x: isMobile ? (isOpen ? 0 : -100) : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden shadow-xl ${isMobile ? "max-w-xl" : "sticky top-0"
        }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <Link href={user?.role === "brother-enterprise" ? "/enterprise/dashboard" : "/admin/dashboard"} onClick={handleMobileClose}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
            transition={{ duration: 0.2 }}
            className={`${!displayIsOpen && "hidden"}`}
          >
            {mounted && (
              <Image
                src={currentTheme === "dark" ? homeLogoDark : homeLogo}
                alt="Logo"
                width={800}
                height={800}
                className="w-28 lg:w-full h-auto object-contain"
                priority
              />
            )}
          </motion.div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => onToggleSidebar && onToggleSidebar()}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Close menu"
            >
              <X size={22} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {getMenuByRole().map((item) => (
            <li key={item.key} className="px-1">
              {!item.subItems ? (
                <Link
                  href={item.href}
                  onClick={handleMobileClose}
                  className={cn(
                    "flex cursor-pointer items-center px-3 py-3 gap-3 rounded-lg transition-all group",
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive(item.href) &&
                    "bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  )}
                >
                  <span
                    className={cn(
                      "text-[20px] transition-colors flex-shrink-0",
                      isActive(item.href)
                        ? "text-white dark:text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                    )}
                  >
                    {item.icon}
                  </span>
                  {displayIsOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      setActiveSubmenu(
                        activeSubmenu === item.key ? null : item.key
                      )
                    }
                    className={cn(
                      "flex items-center cursor-pointer px-3 py-3 gap-3 w-full rounded-lg transition-all group",
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      (activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[20px] transition-colors flex-shrink-0",
                        (activeSubmenu === item.key || isActiveSubmenu(item))
                          ? "text-gray-900 dark:text-gray-200"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                      )}
                    >
                      {item.icon}
                    </span>
                    {displayIsOpen && (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium flex-1 text-left truncate"
                        >
                          {item.label}
                        </motion.span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform text-gray-500 dark:text-gray-400 flex-shrink-0",
                            activeSubmenu === item.key ? "rotate-180" : ""
                          )}
                        />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {(activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      item.subItems &&
                      displayIsOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subItems.map((subItem) => (
                            <motion.li
                              key={subItem.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Link
                                href={subItem.href}
                                onClick={handleMobileClose}
                                className={cn(
                                  "flex items-center px-3 py-2.5 gap-2 text-sm rounded-lg transition-all group",
                                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                  isActive(subItem.href) &&
                                  "bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-[16px] transition-colors flex-shrink-0",
                                    isActive(subItem.href)
                                      ? "text-white dark:text-white"
                                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                  )}
                                >
                                  {subItem.icon}
                                </span>
                                <span className="font-medium truncate">
                                  {subItem.label}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar.Root onClick={handleProfileRedirect} className="w-10 hover:cursor-pointer h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 flex-shrink-0">
            <Avatar.Image
              src={getProfileImage()}
              alt={getDisplayName()}
              className="object-cover w-full h-full"
            />
            <Avatar.Fallback
              delayMs={600}
              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center w-full h-full"
            >
              {getProfileInitial()}
            </Avatar.Fallback>
          </Avatar.Root>

          {displayIsOpen && (
            <motion.div onClick={handleProfileRedirect}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
              transition={{ duration: 0.2 }}
              className="text-sm flex-1 min-w-0 hover:cursor-pointer"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getDisplayEmail()}
              </p>
            </motion.div>
          )}

          {displayIsOpen && (
            <div className="flex items-center gap-1">
              {/* Theme Switcher - Icon only */}
              <ThemeSwitcher />
              
              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-1.5 rounded-md hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                    <MdLogout
                      size={18}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-[95vw] md:max-w-md mx-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                      Logging out will end your current session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 order-2 sm:order-1">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 order-1 sm:order-2"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default EnterpriseSidebar;