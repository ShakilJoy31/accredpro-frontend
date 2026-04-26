'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Shield, Building2, Users, FileCheck, Clock, RefreshCw,
    Award, TrendingUp, CheckCircle, ArrowRight, Sparkles,
    Globe, Zap, Star, Briefcase, BookOpen, Settings,
    ChevronRight, Target, Heart, Brain, Cpu, Server, Search,
    FileText, CreditCard, Video, Link as LinkIcon, BarChart,
    Headphones, Database, QrCode, Lock, Eye, FileSignature,
    Calendar, Mail, Phone, MapPin, Facebook, Twitter, Linkedin,
    Instagram, Youtube, Send, MessageCircle, Bell, Download,
    Upload, FolderOpen, UserCheck, ClipboardList, AlertCircle,
    Share
} from 'lucide-react';
import Link from 'next/link';

// Animated Section Title Component
const SectionTitle = ({ title, subtitle, description }: any) => {
    return (
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
            >
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    {subtitle}
                </span>
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-4"
            >
                {title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
                {description}
            </motion.p>
        </div>
    );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, gradient }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`} />
            <div className="p-8">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

// Service Card for Accreditation Services
const AccreditationServiceCard = ({ icon: Icon, title, description, features, index }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200">
                <div className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-bl-full" />
                    <div className="p-8">
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-md">
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                            {title}
                        </h3>
                        <p className="text-gray-600 mb-6 h-16 leading-relaxed">{description}</p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                            {features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Link */}
                        <button className="text-green-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all group/link">
                            Learn More
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Process Timeline Component
const ProcessTimeline = () => {
    const steps = [
        {
            title: "Application & Documentation Review",
            description: "Submit your application along with required documentation, policies, and quality management system evidence.",
            longDescription: "Our digital portal makes submission seamless. Upload all required documents including quality manual, procedures, policies, and evidence of implementation. Our system guides you through each requirement. The accreditation body performs initial completeness check within 5 business days.",
            icon: FileCheck,
            metrics: "Average completion: 2-3 weeks",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            title: "Documentation Review",
            description: "Expert assessors review your documentation for compliance with relevant accreditation standards.",
            longDescription: "Our team of specialized assessors conducts thorough reviews against ISO/IEC 17011, 17024, and relevant scheme requirements. You receive detailed feedback and improvement recommendations. Any gaps identified are formally documented as non-conformities or observations.",
            icon: Shield,
            metrics: "Review time: 4-6 weeks",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            title: "On-Site Assessment",
            description: "Comprehensive on-site evaluation of operations, competence, and implementation of systems.",
            longDescription: "Experienced lead assessors visit your facilities to verify implementation, interview personnel, observe operations, and validate your management system effectiveness. Assessment includes review of certified person records, examination processes, and impartiality mechanisms.",
            icon: Users,
            metrics: "Assessment: 3-5 days",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            title: "Decision & Accreditation",
            description: "Accreditation committee reviews findings and grants accreditation status with ongoing surveillance.",
            longDescription: "Our independent accreditation committee reviews assessment findings and makes the final decision. Once granted, you receive your accreditation certificate and can promote your status. Initial accreditation is typically granted for a 4-year cycle with annual surveillance.",
            icon: Award,
            metrics: "Decision: 2-3 weeks",
            gradient: "from-orange-500 to-red-500"
        }
    ];

    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-transparent to-blue-50/50 rounded-3xl" />

            {/* Timeline Container */}
            <div className="relative max-w-6xl mx-auto px-4 py-12">


                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`relative flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                            } items-center gap-8 lg:gap-20 mb-16 last:mb-0 group`}
                        onMouseEnter={() => setActiveStep(index)}
                    >
                        {/* Timeline Node with Pulse Effect */}
                        <div className="relative z-20">
                            {/* Outer Ring Animation */}
                            <motion.div
                                animate={{
                                    scale: activeStep === index ? [1, 1.2, 1] : 1,
                                    opacity: activeStep === index ? [0.5, 0.2, 0.5] : 0.3,
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: activeStep === index ? Infinity : 0,
                                    repeatType: "reverse",
                                }}
                                className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.gradient} opacity-30 blur-md`}
                            />

                            {/* Main Node */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl cursor-pointer group-hover:shadow-2xl transition-all duration-300`}
                            >
                                <step.icon className="w-10 h-10 text-white" />
                            </motion.div>

                            {/* Step Number Badge */}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-gray-700 border-2 border-gray-100">
                                {index + 1}
                            </div>
                        </div>

                        {/* Content Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} group/card`}
                        >
                            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover/card:border-transparent">
                                {/* Animated Gradient Border */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ padding: '2px' }}>
                                    <div className="absolute inset-[2px] bg-white rounded-2xl" />
                                </div>

                                {/* Content */}
                                <div className="relative p-8">
                                    {/* Status Indicator */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} animate-pulse`} />
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Step {index + 1} of {steps.length}
                                            </span>
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: activeStep === index ? 1 : 0 }}
                                            className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                                        >
                                            Active
                                        </motion.div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-2xl font-bold text-gray-900 mb-4 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r ${step.gradient} transition-all duration-300`}>
                                        {step.title}
                                    </h3>

                                    {/* Short Description */}
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {step.description}
                                    </p>

                                    {/* Long Description - Animated */}
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: activeStep === index ? 'auto' : 0,
                                            opacity: activeStep === index ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {step.longDescription}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Metrics & Stats */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: activeStep === index ? 1 : 0, y: activeStep === index ? 0 : 10 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="mt-4 flex items-center gap-4 text-xs text-gray-500"
                                    >
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{step.metrics}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span>ISO Compliant</span>
                                        </div>
                                    </motion.div>

                                    {/* Progress Indicator */}
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(((index + 1) / steps.length) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${((index + 1) / steps.length) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.2 }}
                                                className={`h-full rounded-full bg-gradient-to-r ${step.gradient}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Stats Counter Component
const StatsCounter = ({ value, label, icon: Icon }: any) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const duration = 2000;
            const increment = value / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [inView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
        >
            <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mb-4">
                <Icon className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{count}+</div>
            <div className="text-gray-600 font-medium">{label}</div>
        </motion.div>
    );
};


// NEW: Accredited Bodies Directory Preview
const AccreditedBodiesDirectory = () => {
    const bodies = [
        { name: 'FIT INFOTECH Training & Certification Ltd.', country: 'Bangladesh', scope: 'ISO 9001, ISO 27001, PMP', status: 'Active' },
        { name: 'Global Certification Services', country: 'Singapore', scope: 'ISO 14001, ISO 45001', status: 'Active' },
        { name: 'MidEast Accreditation Centre', country: 'UAE', scope: 'ISO 22000, ISO 50001', status: 'Active' },
        { name: 'EuroCert International', country: 'Germany', scope: 'ISO 13485, ISO 20000', status: 'Active' },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <SectionTitle
                    subtitle="Global Network"
                    title="Accredited Bodies Directory"
                    description="Search our comprehensive directory of accredited certification bodies operating worldwide, verified against international standards."
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Search Bar */}
                    <div className="mb-8 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by body name, country, or certification scope..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <button className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                            Filter
                        </button>
                    </div>

                    {/* Directory List */}
                    <div className="space-y-4">
                        {bodies.map((body, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{body.name}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {body.country}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileCheck className="w-3 h-3" />
                                                {body.scope}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            {body.status}
                                        </span>
                                        <button className="text-green-600 text-sm font-medium hover:text-green-700">
                                            View Profile →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button className="text-green-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                            View All Accredited Bodies
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// NEW: Standards & Compliance Section
const StandardsCompliance = () => {
    const standards = [
        { name: 'ISO/IEC 17011:2017', description: 'Conformity assessment — Requirements for accreditation bodies accrediting conformity assessment bodies' },
        { name: 'ISO/IEC 17024:2012', description: 'Conformity assessment — General requirements for bodies operating certification of persons' },
        { name: 'ISO/IEC 17021:2015', description: 'Conformity assessment — Requirements for bodies providing audit and certification of management systems' },
        { name: 'ISO/IEC 17065:2012', description: 'Conformity assessment — Requirements for bodies certifying products, processes and services' },
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionTitle
                    subtitle="Regulatory Framework"
                    title="Accreditation Standards"
                    description="Our accreditation programs are built upon internationally recognized standards, ensuring consistency, reliability, and global acceptance."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {standards.map((standard, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">{standard.name}</h3>
                                    <p className="text-sm text-gray-600">{standard.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">Our accreditation programs are recognized by international forums including IAF and ILAC.</p>
                    <div className="flex justify-center gap-6">
                        {['IAF MLA', 'ILAC MRA', 'APAC', 'EA'].map((recognition, idx) => (
                            <span key={idx} className="px-4 py-1 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm">
                                {recognition}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// NEW: FAQ Section
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "What is the typical timeline for initial accreditation?",
            a: "The initial accreditation process typically takes 4-6 months from application submission to decision, depending on the complexity of the certification scheme and your organization's readiness."
        },
        {
            q: "How long does accreditation remain valid?",
            a: "Initial accreditation is typically granted for a 4-year cycle, subject to annual surveillance audits to ensure continued compliance."
        },
        {
            q: "Can I verify a certificate for free?",
            a: "Yes, the public certificate verification portal is completely free and available 24/7. Anyone can verify any certificate by entering the unique certificate ID or scanning the QR code."
        },
        {
            q: "What standards does AccredPro use for accreditation?",
            a: "We accredit certification bodies against ISO/IEC 17011, ISO/IEC 17024, ISO/IEC 17021, and ISO/IEC 17065, depending on the scope of certification activities."
        },
        {
            q: "How are non-conformities handled during assessment?",
            a: "Non-conformities are logged in real-time during the assessment. Your organization submits corrective action plans and evidence through our portal for review and closure."
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <SectionTitle
                    subtitle="Common Questions"
                    title="Frequently Asked Questions"
                    description="Find answers to common questions about accreditation, verification, and our processes."
                />

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-b border-gray-200 last:border-0"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full py-5 flex justify-between items-center text-left"
                            >
                                <span className="font-semibold text-gray-900">{faq.q}</span>
                                <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === idx ? 'rotate-90' : ''}`} />
                            </button>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <p className="pb-5 text-gray-600">{faq.a}</p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// Main Component
export default function ServicesPage() {
    const accreditationServices = [
        {
            icon: Shield,
            title: "Initial Accreditation",
            description: "Comprehensive assessment for certification bodies seeking initial accreditation status.",
            features: ["Documentation review", "On-site assessment", "Competency evaluation", "90-day decision timeline"]
        },
        {
            icon: RefreshCw,
            title: "Surveillance Audits",
            description: "Regular monitoring to ensure continued compliance with accreditation standards.",
            features: ["Annual surveillance visits", "Performance monitoring", "Continuous improvement", "Compliance tracking"]
        },
        {
            icon: Clock,
            title: "Renewal Assessment",
            description: "Full reassessment process for accreditation renewal every 3-5 years.",
            features: ["System review", "Updated documentation", "Stakeholder feedback", "Scope evaluation"]
        },
        {
            icon: TrendingUp,
            title: "Scope Extension",
            description: "Add new certification schemes or standards to existing accreditation.",
            features: ["Gap analysis", "Resource assessment", "Competence verification", "Seamless integration"]
        },
        {
            icon: Users,
            title: "CB Training Programs",
            description: "Training and development for certification body personnel.",
            features: ["Assessor training", "Scheme understanding", "Audit techniques", "CPD programs"]
        },
        {
            icon: Briefcase,
            title: "Consultancy Services",
            description: "Expert guidance on implementing accreditation management systems.",
            features: ["Gap assessments", "System implementation", "Documentation support", "Mock audits"]
        }
    ];

    const features = [
        {
            icon: Globe,
            title: "Global Recognition",
            description: "Internationally recognized accreditation that opens doors worldwide.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: Brain,
            title: "Expert Assessors",
            description: "Industry experts with deep knowledge and practical experience.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Zap,
            title: "Fast Processing",
            description: "Streamlined digital processes for quick turnaround times.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: Shield,
            title: "ISO Compliance",
            description: "Full alignment with ISO/IEC 17011, 17024, and 17065 standards.",
            gradient: "from-orange-500 to-red-500"
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section - Modern & Clean */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-44 pb-24">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:40px_40px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white shadow-sm rounded-full px-4 py-1.5 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Accreditation Services</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
                        >
                            Elevate Your Certification
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                To Global Standards
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                        >
                            Comprehensive accreditation solutions aligned with international standards.
                            Join the leading accreditation body trusted by certification bodies worldwide.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex gap-4 justify-center flex-wrap"
                        >
                            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Apply for Accreditation
                            </button>
                            <button className="border-2 border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition-all duration-300">
                                Download Standards
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatsCounter value={150} label="Accredited Bodies" icon={Building2} />
                        <StatsCounter value={5000} label="Active Certificates" icon={Award} />
                        <StatsCounter value={50} label="Expert Assessors" icon={Users} />
                        <StatsCounter value={30} label="Countries Served" icon={Globe} />
                    </div>
                </div>
            </section>

            {/* Accreditation Services Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SectionTitle
                        subtitle="Our Services"
                        title="Accreditation Solutions"
                        description="Comprehensive accreditation services tailored to meet the unique needs of certification bodies across various industries and standards."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {accreditationServices.map((service, index) => (
                            <AccreditationServiceCard key={index} {...service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Accredited Bodies Directory */}
            <AccreditedBodiesDirectory />

            {/* Accreditation Process Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionTitle
                        subtitle="How It Works"
                        title="Accreditation Process"
                        description="A transparent and structured pathway to achieving and maintaining accreditation status."
                    />
                    <div className="mt-16">
                        <ProcessTimeline />
                    </div>
                </div>
            </section>

            {/* NEW: Standards & Compliance Section */}
            <StandardsCompliance />

            {/* Why Choose Us Section */}
            <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                                <Star className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Why Choose Us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                The AccredPro Advantage
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Join the leading accreditation body trusted by certification bodies worldwide.
                                Benefit from our expertise, global recognition, and commitment to excellence.
                            </p>
                            <div className="space-y-4 mb-8">
                                {[
                                    "Internationally recognized accreditation",
                                    "Expert assessors with industry experience",
                                    "Streamlined digital processes",
                                    "Transparent fee structure",
                                    "Continuous support and guidance"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Request Consultation
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NEW: FAQ Section */}
            <FAQ />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-900 to-blue-900 relative overflow-hidden">
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white/5 rounded-full"
                            style={{
                                width: Math.random() * 100 + 20,
                                height: Math.random() * 100 + 20,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 50 - 25],
                                scale: [1, Math.random() * 1.5],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join the community of trusted certification bodies and demonstrate your commitment to excellence.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button className="bg-white text-green-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Apply Now
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                                Contact Team
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-6">
                            *No commitment required. Free consultation available.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}