import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, BRANDS } from '../data/initialData';
import { compressImageFile, uploadImageToCloud } from '../utils/storage';
import { 
  Shield, 
  Car, 
  Calendar, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  DollarSign, 
  Users, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Code2
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    fleet, 
    bookings, 
    siteContent, 
    formatPrice, 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    addCar, 
    updateCar, 
    deleteCar, 
    toggleCarStatus, 
    toggleCarBlockedDate, 
    updateBookingStatus, 
    deleteBooking, 
    updateSiteContent, 
    resetToDefaults, 
    exportBackupJSON, 
    importBackupJSON, 
    downloadInitialDataJS,
    cloudSyncStatus,
    syncFleetToCloud,
    syncContentToCloud,
    syncAllToCloud,
    navigateTo, 
    showToast,
    inquiries = [],
    deleteInquiry
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'fleet' | 'calendar' | 'bookings' | 'inquiries' | 'cms' | 'backup'
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef(null);

  // Car Edit / Add Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [carFormData, setCarFormData] = useState({
    name: '',
    model: '',
    brand: 'Toyota',
    category: 'SUV',
    year: 2024,
    dailyPrice: 150,
    kshPrice: 19000,
    weeklyDiscount: 12,
    securityDeposit: 600,
    images: ['https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80'],
    specs: {
      horsepower: '201 HP',
      acceleration: '9.5s 0-60 mph',
      topSpeed: '120 mph',
      engine: '2.8L Turbo Diesel',
      transmission: 'Automatic 4WD',
      seats: 7,
      luggage: '5 Bags',
      fuelType: 'Diesel'
    },
    features: [
      'Full-Time 4WD with Diff Lock',
      'Air Conditioning',
      'Spacious Seating'
    ],
    includedPerks: [
      'Comprehensive Insurance',
      '24/7 Roadside Rescue',
      'Clean & Sanitized'
    ],
    tagline: 'Reliable all-terrain luxury vehicle.',
    description: 'Versatile and dependable vehicle suitable for city errands, corporate travel, or upcountry safaris.',
    status: 'available',
    featured: false
  });

  // Calendar Blocker State
  const [calendarCarId, setCalendarCarId] = useState(fleet[0]?.id || 'premium-suv-prado');

  // Booking Detail Modal
  const [viewingBooking, setViewingBooking] = useState(null);

  // CMS Form State
  const [cmsData, setCmsData] = useState(siteContent);
  const [newFaq, setNewFaq] = useState({ category: 'Payments & M-Pesa', question: '', answer: '' });

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminLogin(pinInput)) {
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Car Modal Handlers
  const handleOpenAddCar = () => {
    setEditingCarId(null);
    setCarFormData({
      name: '',
      model: '',
      brand: 'Toyota',
      category: 'SUV',
      year: 2024,
      dailyPrice: 150,
      kshPrice: 19000,
      weeklyDiscount: 12,
      securityDeposit: 600,
      images: ['https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        horsepower: '201 HP',
        acceleration: '9.5s 0-60 mph',
        topSpeed: '120 mph',
        engine: '2.8L Turbo Diesel',
        transmission: 'Automatic 4WD',
        seats: 7,
        luggage: '5 Bags',
        fuelType: 'Diesel'
      },
      features: ['Full-Time 4WD', 'Air Conditioning', 'Bluetooth Audio'],
      includedPerks: ['Comprehensive Insurance', '24/7 Roadside Rescue', 'Clean & Sanitized'],
      tagline: 'Reliable all-terrain luxury vehicle.',
      description: 'Dependable and spacious vehicle suitable for business, family, or safari exploration.',
      status: 'available',
      featured: false
    });
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car) => {
    setEditingCarId(car.id);
    setCarFormData({
      ...car,
      specs: { ...car.specs },
      features: [...(car.features || [])],
      includedPerks: [...(car.includedPerks || [])],
      images: [...(car.images || [])]
    });
    setIsCarModalOpen(true);
  };

  const handleSaveCar = (e) => {
    e.preventDefault();
    if (!carFormData.name.trim()) {
      showToast('Vehicle name is required.', 'error');
      return;
    }

    if (editingCarId) {
      updateCar(editingCarId, carFormData);
    } else {
      addCar(carFormData);
    }
    setIsCarModalOpen(false);
  };

  // Device File Upload Handler (Auto-compressed & Cloud CDN Ready)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(async (file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select valid image files.', 'error');
        return;
      }

      try {
        showToast(`Processing & uploading "${file.name}"...`, 'info');
        const uploadResult = await uploadImageToCloud(file, file.name);

        setCarFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadResult.url]
        }));

        if (uploadResult.source === 'cloud') {
          showToast(`Photo "${file.name}" saved to global Blob CDN!`, 'success');
        } else {
          showToast(`Photo "${file.name}" optimized & saved locally!`, 'success');
        }
      } catch (err) {
        console.error('Image upload error:', err);
        showToast(`Failed to process "${file.name}".`, 'error');
      }
    });

    // Reset input value so same files can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = window.prompt('Enter or paste image URL:');
    if (url && url.trim()) {
      setCarFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setCarFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    const selected = carFormData.images[index];
    const filtered = carFormData.images.filter((_, i) => i !== index);
    setCarFormData(prev => ({
      ...prev,
      images: [selected, ...filtered]
    }));
    showToast('Primary cover photo updated.', 'info');
  };

  // CMS Save
  const handleSaveCms = (e) => {
    e.preventDefault();
    updateSiteContent(cmsData);
  };

  const handleAddFaqItem = (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    setCmsData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { ...newFaq }]
    }));
    setNewFaq({ category: 'Payments & M-Pesa', question: '', answer: '' });
    showToast('FAQ item added. Remember to click "Save Website Content Changes"!', 'info');
  };

  const handleDeleteFaqItem = (index) => {
    setCmsData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // If Not Authenticated, show Clean Light Pin Prompt
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 animate-fade-in text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">
              OTTORENTAL Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your security PIN code to manage fleet inventory, upload device photos, manage availability, and edit content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(false);
                }}
                placeholder="••••"
                className={`w-full py-3 px-4 rounded-xl border bg-slate-50 text-center font-mono text-2xl font-bold tracking-[0.5em] focus:outline-none ${
                  pinError ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 mt-2 font-semibold">
                  Access denied. Incorrect security PIN.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn-otto-primary py-3.5 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Authenticate & Enter Admin</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Vehicle for Calendar
  const selectedCalendarCar = fleet.find(c => c.id === calendarCarId) || fleet[0];

  // Pipeline metrics
  const availableCount = fleet.filter(c => c.status === 'available').length;
  const reservedCount = fleet.filter(c => c.status === 'reserved').length;
  const maintenanceCount = fleet.filter(c => c.status === 'maintenance').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.pricing?.grandTotal || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Admin Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Admin Session Active
              </span>

              {cloudSyncStatus.configured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Vercel KV Cloud Live (Multi-Device)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Local Device Storage
                </span>
              )}
              <span className="text-xs text-slate-500">OTTORENTAL Fleet & CMS</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
              Admin Control Center
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => syncAllToCloud()}
              disabled={cloudSyncStatus.syncing}
              className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Push entire vehicle fleet and website CMS updates to cloud storage"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${cloudSyncStatus.syncing ? 'animate-spin' : ''}`} />
              <span>{cloudSyncStatus.syncing ? 'Syncing...' : 'Sync All to Cloud'}</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>

            <button
              onClick={adminLogout}
              className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
              title="Lock Session & Logout"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: Layers },
            { id: 'fleet', label: `Fleet Manager (${fleet.length})`, icon: Car },
            { id: 'calendar', label: 'Availability Calendar', icon: Calendar },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: FileText },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageCircle },
            { id: 'cms', label: 'Website Content CMS', icon: Settings },
            { id: 'backup', label: 'Backup & Restore', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" /> Total Vehicles
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {fleet.length} <span className="text-xs font-normal text-slate-400">Cars</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="text-emerald-600 font-bold">{availableCount} Available</span> • {reservedCount} Booked
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fleet Availability
                </span>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {Math.round((availableCount / fleet.length) * 100)}%
                </div>
                <div className="text-[11px] text-slate-500">
                  {maintenanceCount} in scheduled servicing
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Total Bookings
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-amber-600 font-semibold">
                  {bookings.filter(b => b.status === 'Pending').length} Pending Triage
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Pipeline Revenue
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="text-[11px] text-slate-500">
                  Total logged booking value
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-extrabold text-lg text-slate-900">
                  Add Vehicle with Real Photos from Device
                </h3>
                <p className="text-xs text-slate-600">
                  Upload multiple photos directly from your phone or computer, set pricing in KSh/USD, and adjust features.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleOpenAddCar}
                  className="btn-otto-primary text-xs py-3 px-6 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="px-5 py-3 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Manage Calendar
                </button>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  Recent Booking Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All Manifests →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Ref ID</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Schedule</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.slice(0, 4).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">{b.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{b.customer.fullName}</td>
                        <td className="py-3 px-3">{b.carName}</td>
                        <td className="py-3 px-3 text-slate-500">{b.dates.pickupDate} ({b.dates.days}d)</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{formatPrice(b.pricing.grandTotal, b.pricing.grandTotalKsh)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            b.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FLEET MANAGER (CRUD with Device Photos) */}
        {activeTab === 'fleet' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">
                  Fleet Catalog Management
                </h2>
                <p className="text-xs text-slate-500">
                  Add new vehicles, upload photos from device, update daily rates in KSh/USD, and toggle availability.
                </p>
              </div>

              <button
                onClick={handleOpenAddCar}
                className="btn-otto-primary text-xs py-2.5 px-6 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Fleet Table */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-4">Vehicle</th>
                      <th className="py-4 px-4">Category & Model</th>
                      <th className="py-4 px-4">Daily Rate</th>
                      <th className="py-4 px-4">Deposit</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {fleet.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.images?.[0]}
                              alt={car.name}
                              className="w-16 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">{car.name}</span>
                              <span className="text-[11px] text-slate-400">{car.images?.length || 1} Photo(s) • {car.specs?.seats} Seats</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                            {car.category}
                          </span>
                          <span className="text-slate-500 block text-[11px] mt-0.5">{car.model || car.brand}</span>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                          {formatPrice(car.dailyPrice, car.kshPrice)}
                          <span className="text-[10px] text-slate-400 font-normal block">/ day</span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-600">
                          {formatPrice(car.securityDeposit)}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={car.status}
                            onChange={(e) => toggleCarStatus(car.id, e.target.value)}
                            className={`text-xs py-1 px-2.5 rounded-lg font-bold uppercase border focus:outline-none ${
                              car.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : car.status === 'reserved'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-rose-50 text-rose-700 border-rose-300'
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditCar(car)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${car.name}" from the fleet?`)) {
                                  deleteCar(car.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR BLOCKER */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">
                  Vehicle Availability Calendar Blocker
                </h2>
                <p className="text-xs text-slate-500">
                  Select any vehicle and click on dates to block or unblock them for servicing or private bookings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Vehicle:</span>
                <select
                  value={calendarCarId}
                  onChange={(e) => setCalendarCarId(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {fleet.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCalendarCar.images?.[0]}
                    alt={selectedCalendarCar.name}
                    className="w-16 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{selectedCalendarCar.name}</h3>
                    <span className="text-xs text-slate-500">Category: {selectedCalendarCar.category}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Total Blocked Dates:</span>
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    {(selectedCalendarCar.blockedDates || []).length} Days
                  </span>
                </div>
              </div>

              {/* September 2026 Calendar Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>September 2026 Schedule</span>
                  <div className="flex items-center gap-4 text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Blocked</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] py-1">{day}</div>
                  ))}

                  {[...Array(30)].map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const isBlocked = (selectedCalendarCar.blockedDates || []).includes(dateStr);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => toggleCarBlockedDate(selectedCalendarCar.id, dateStr)}
                        className={`p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[58px] ${
                          isBlocked
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-blue-400'
                        }`}
                      >
                        <span className="font-mono text-xs sm:text-sm">{dayNum}</span>
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold opacity-75">
                          {isBlocked ? 'Blocked' : 'Open'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blocked Dates List */}
              <div className="pt-4 border-t border-slate-100 text-xs">
                <span className="font-bold uppercase text-slate-700 block mb-2">
                  Currently Blocked Dates for {selectedCalendarCar.name}:
                </span>
                {(selectedCalendarCar.blockedDates && selectedCalendarCar.blockedDates.length > 0) ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCalendarCar.blockedDates.map(d => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-semibold"
                      >
                        <span>{d}</span>
                        <button
                          onClick={() => toggleCarBlockedDate(selectedCalendarCar.id, d)}
                          className="hover:text-rose-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">No dates currently blocked.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: BOOKING REQUESTS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">
                Customer Booking Requests & Manifests
              </h2>
              <p className="text-xs text-slate-500">
                Triage incoming customer reservations, update status, and communicate directly via WhatsApp or phone.
              </p>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-4">Ref Code</th>
                      <th className="py-4 px-4">Customer Details</th>
                      <th className="py-4 px-4">Reserved Vehicle</th>
                      <th className="py-4 px-4">Schedule</th>
                      <th className="py-4 px-4">Total</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-blue-600">{booking.id}</td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 text-sm block">{booking.customer.fullName}</span>
                          <span className="text-slate-500 block">{booking.customer.email}</span>
                          <span className="text-slate-600 font-mono text-[11px]">{booking.customer.phone}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">{booking.carName}</td>
                        <td className="py-4 px-4">
                          <span className="text-slate-900 block">{booking.dates.pickupDate} - {booking.dates.returnDate}</span>
                          <span className="text-[11px] text-slate-500">{booking.customer.pickupLocation}</span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                          {formatPrice(booking.pricing.grandTotal, booking.pricing.grandTotalKsh)}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className={`text-xs py-1 px-2.5 rounded-lg font-bold uppercase border focus:outline-none ${
                              booking.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : booking.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : booking.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingBooking(booking)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 transition-colors"
                              title="View Full Booking"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Archive reservation ${booking.id}?`)) {
                                  deleteBooking(booking.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BESPOKE INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">
                  Customer Bespoke Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Review direct concierge inquiries submitted via website forms, with one-click WhatsApp reply.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {inquiries.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Inquiries Logged Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When visitors submit bespoke inquiries via the Contact page or site forms, they will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Ref / Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Nature of Inquiry</th>
                        <th className="py-3 px-4">Message / Details</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            <div>{inq.id}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {inq.name}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-slate-700">{inq.phone}</div>
                            <div className="text-slate-400 text-[10px]">{inq.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                              {inq.serviceInterest || 'General Inquiry'}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                            {inq.message || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`https://api.whatsapp.com/send?phone=${(inq.phone || '').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello ${inq.name}, this is OttoRental following up on your bespoke enquiry regarding ${inq.serviceInterest || 'vehicle rental'}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                                title="Reply on WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                              {deleteInquiry && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Archive inquiry ${inq.id}?`)) {
                                      deleteInquiry(inq.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Archive Inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE CONTENT CMS */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveCms} className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">
                  Live Website Content Management (CMS)
                </h2>
                <p className="text-xs text-slate-500">
                  Update brand info, hero headlines, phone numbers, WhatsApp link, and FAQ items without writing code.
                </p>
              </div>

              <button
                type="submit"
                className="btn-otto-primary text-xs py-2.5 px-6 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save All Website Changes</span>
              </button>
            </div>

            {/* Brand Settings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Brand Identity & Security Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={cmsData.brand.name}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, name: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={cmsData.brand.tagline}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, tagline: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-blue-600 block mb-1">Admin Security PIN Code</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={cmsData.brand.securityPin || '8888'}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, securityPin: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-blue-300 rounded-xl font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Kenya Hotline Phone</label>
                  <input
                    type="text"
                    value={cmsData.brand.phone}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, phone: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">WhatsApp International Number</label>
                  <input
                    type="text"
                    value={cmsData.brand.whatsapp}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, whatsapp: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Concierge Email</label>
                  <input
                    type="email"
                    value={cmsData.brand.email}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, email: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Office / Showroom Address</label>
                  <input
                    type="text"
                    value={cmsData.brand.address}
                    onChange={(e) => setCmsData({ ...cmsData, brand: { ...cmsData.brand, address: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Hero Banner CMS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Hero Section Headlines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={cmsData.hero.title}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={cmsData.hero.subtitle}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subtitle: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Policies CMS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Frequently Asked Questions Manager
              </h3>

              <div className="space-y-3">
                {cmsData.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{faq.category}</span>
                      <h4 className="font-bold text-slate-900 mt-0.5">{faq.question}</h4>
                      <p className="text-slate-600 mt-1">{faq.answer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaqItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add FAQ Form */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-dashed border-blue-200 space-y-3 text-xs">
                <span className="font-bold text-slate-900 block">Add New FAQ Item</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Category (e.g. Payments, Insurance, Safari)"
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Question (e.g. Can I pay via M-Pesa?)"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900 sm:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFaqItem}
                  className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Append FAQ Item</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-otto-primary text-xs py-3 px-8 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save All Website Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 6: BACKUP & RESTORE / CLOUD SYNC */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h2 className="font-extrabold text-2xl text-slate-900">
                  Cloud Database & Multi-Device Sync
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Keep your entire fleet, custom pricing, and photos synchronized across all phones, tablets, and computers worldwide.
                </p>
              </div>
            </div>

            {/* Cloud Status Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                  Cloud Infrastructure Status
                </span>
                {cloudSyncStatus.lastSync && (
                  <span className="text-[11px] font-mono text-slate-500">
                    Last synced: {cloudSyncStatus.lastSync}
                  </span>
                )}
              </div>

              {/* Status Grid: Database (KV) and Media Storage (Blob) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Database (KV) */}
                <div className={`p-4 rounded-2xl border ${
                  cloudSyncStatus.configured 
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cloudSyncStatus.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span className="font-bold text-xs uppercase">
                      Vercel KV (Database)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    {cloudSyncStatus.configured 
                      ? '✅ Connected — Fleet, bookings, pricing & text content sync across devices.' 
                      : '⚠️ Offline — Running locally in browser IndexedDB.'}
                  </p>
                </div>

                {/* 2. Media (Blob) */}
                <div className={`p-4 rounded-2xl border ${
                  cloudSyncStatus.blobConfigured 
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cloudSyncStatus.blobConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span className="font-bold text-xs uppercase">
                      Vercel Blob (Media CDN)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    {cloudSyncStatus.blobConfigured 
                      ? '✅ Connected — Photos hosted on high-speed global CDN with unlimited capacity.' 
                      : '⚠️ Not Connected — Device photos are compressed and stored locally.'}
                  </p>
                </div>
              </div>

              {/* How to activate guide if either is missing */}
              {(!cloudSyncStatus.configured || !cloudSyncStatus.blobConfigured) && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-800">
                  <span className="font-bold block text-slate-900">
                    How to enable full Cloud Sync & Photo Hosting on Vercel:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600">
                    <li>Open your project at <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline font-bold text-blue-600">vercel.com</a></li>
                    <li>Click the <strong>Storage</strong> tab in the top navigation</li>
                    {!cloudSyncStatus.configured && (
                      <li>Click <strong>Connect Database</strong> → choose <strong>KV</strong> (for fleet data & bookings)</li>
                    )}
                    {!cloudSyncStatus.blobConfigured && (
                      <li>Click <strong>Connect Database</strong> (or Create Database) → choose <strong>Blob</strong> (for photos & media)</li>
                    )}
                    <li>Redeploy or push code to apply the environment variables automatically.</li>
                  </ol>
                </div>
              )}

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => syncAllToCloud()}
                  disabled={cloudSyncStatus.syncing}
                  className="btn-otto-primary text-xs py-2.5 px-5 shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${cloudSyncStatus.syncing ? 'animate-spin' : ''}`} />
                  <span>{cloudSyncStatus.syncing ? 'Syncing to Cloud...' : 'Sync Fleet, Photos & CMS to Cloud Now'}</span>
                </button>
              </div>
            </div>

            {/* Offline and Portability Tools */}
            <div className="pt-2 text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Codebase & File Backups
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={downloadInitialDataJS}
                  className="py-3 px-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  title="Download initialData.js to permanently commit changes directly into Git"
                >
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Save to Codebase</span>
                </button>

                <button
                  onClick={exportBackupJSON}
                  className="py-3 px-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Export Backup JSON</span>
                </button>

                <label className="py-3 px-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Import Backup JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            importBackupJSON(event.target.result.toString());
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Storage Protection Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-1 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Persistent Dual-Layer Storage (IndexedDB + LocalStorage) Active</span>
              </div>
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                Your pricing adjustments, vehicle availability, and uploaded photos are always preserved in offline browser IndexedDB with smart image compression so work is never lost.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  if (window.confirm('Reset all cars, bookings, and site content back to initial demo defaults?')) {
                    resetToDefaults();
                  }
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database to Initial Demo Seed</span>
              </button>
            </div>
          </div>
        )}

        {/* ADD / EDIT CAR MODAL (WITH REAL DEVICE PHOTO UPLOAD) */}
        {isCarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 my-auto max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Fleet Studio</span>
                  <h3 className="font-extrabold text-2xl text-slate-900 mt-0.5">
                    {editingCarId ? `Edit ${carFormData.name}` : 'Add New Vehicle to Fleet'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCarModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-6">
                
                {/* 1. Device Photos Upload Zone */}
                <div className="space-y-3 p-5 rounded-2xl bg-blue-50/50 border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        Vehicle Photos ({carFormData.images?.length || 0})
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Add real photos directly from your phone, laptop, or camera storage.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="device-photo-upload"
                      />
                      <label
                        htmlFor="device-photo-upload"
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload from Device</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        title="Add image via URL"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Photo Thumbnail Gallery */}
                  {carFormData.images && carFormData.images.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {carFormData.images.map((imgUrl, idx) => (
                          <div 
                            key={idx} 
                            className={`relative rounded-xl overflow-hidden bg-white border p-2 flex flex-col justify-between space-y-2 shadow-xs transition-all ${
                              idx === 0 ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200'
                            }`}
                          >
                            <div className="relative aspect-[16/11] w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                              <img
                                src={imgUrl}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                              {idx === 0 ? (
                                <span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold uppercase shadow-sm">
                                  ★ Cover Photo
                                </span>
                              ) : (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons for Each Photo */}
                            <div className="flex items-center justify-between gap-1 pt-1">
                              {idx !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold text-center transition-colors"
                                >
                                  Make Cover
                                </button>
                              ) : (
                                <span className="flex-1 text-[10px] font-bold text-emerald-700 py-1 text-center">
                                  Active Cover
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 italic">
                        💡 <strong>Tip:</strong> The Cover Photo (Photo #1) is what clients see on car cards & search results. When clients click the vehicle, they can view all other photos in the gallery.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                      No photos added yet. Click "Upload from Device" above to select images from your phone or PC.
                    </div>
                  )}
                </div>

                {/* 2. Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Vehicle Class Name *</label>
                    <input
                      type="text"
                      required
                      value={carFormData.name}
                      onChange={(e) => setCarFormData({ ...carFormData, name: e.target.value })}
                      placeholder="e.g. Standard Mid-Size SUV or Toyota Prado"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Model Subtitle</label>
                    <input
                      type="text"
                      value={carFormData.model || ''}
                      onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
                      placeholder="e.g. Mazda CX-5 or similar"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Make / Brand</label>
                    <input
                      type="text"
                      value={carFormData.brand}
                      onChange={(e) => setCarFormData({ ...carFormData, brand: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Category</label>
                    <select
                      value={carFormData.category}
                      onChange={(e) => setCarFormData({ ...carFormData, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Model Year</label>
                    <input
                      type="number"
                      value={carFormData.year}
                      onChange={(e) => setCarFormData({ ...carFormData, year: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-blue-600 block mb-1">Daily Price in KSh *</label>
                    <input
                      type="number"
                      value={carFormData.kshPrice || Math.round(carFormData.dailyPrice * 128.5)}
                      onChange={(e) => {
                        const ksh = Number(e.target.value);
                        setCarFormData({ 
                          ...carFormData, 
                          kshPrice: ksh,
                          dailyPrice: Math.round(ksh / 128.5)
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-blue-300 rounded-xl font-bold text-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">USD Base Price ($)</label>
                    <input
                      type="number"
                      value={carFormData.dailyPrice}
                      onChange={(e) => setCarFormData({ ...carFormData, dailyPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Security Deposit Hold ($)</label>
                    <input
                      type="number"
                      value={carFormData.securityDeposit}
                      onChange={(e) => setCarFormData({ ...carFormData, securityDeposit: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                {/* 3. Specs Matrix */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold uppercase text-slate-800 block">Performance & Seating Specs</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Seating Capacity</label>
                      <input
                        type="number"
                        value={carFormData.specs?.seats || 5}
                        onChange={(e) => setCarFormData({ ...carFormData, specs: { ...carFormData.specs, seats: Number(e.target.value) } })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Luggage Capacity</label>
                      <input
                        type="text"
                        value={carFormData.specs?.luggage || ''}
                        onChange={(e) => setCarFormData({ ...carFormData, specs: { ...carFormData.specs, luggage: e.target.value } })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Engine & Powertrain</label>
                      <input
                        type="text"
                        value={carFormData.specs?.engine || ''}
                        onChange={(e) => setCarFormData({ ...carFormData, specs: { ...carFormData.specs, engine: e.target.value } })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Transmission</label>
                      <input
                        type="text"
                        value={carFormData.specs?.transmission || ''}
                        onChange={(e) => setCarFormData({ ...carFormData, specs: { ...carFormData.specs, transmission: e.target.value } })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Description */}
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block">Vehicle Description</label>
                  <textarea
                    rows={2}
                    value={carFormData.description}
                    onChange={(e) => setCarFormData({ ...carFormData, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCarModalOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-otto-primary text-xs py-3 px-8 uppercase font-extrabold shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCarId ? 'Update Vehicle' : 'Save to Fleet'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* VIEW FULL BOOKING MANIFEST MODAL */}
        {viewingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600">Booking Manifest</span>
                  <h3 className="font-extrabold text-2xl text-slate-900 mt-0.5">
                    {viewingBooking.id}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Client Name</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingBooking.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Reserved Vehicle</span>
                  <span className="font-bold text-blue-600 text-sm">{viewingBooking.carName}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Email</span>
                  <span className="text-slate-700">{viewingBooking.customer.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Phone / WhatsApp</span>
                  <span className="text-slate-900 font-mono font-bold">{viewingBooking.customer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Pickup Location</span>
                  <span className="text-slate-700">{viewingBooking.customer.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold block">Schedule</span>
                  <span className="text-slate-700">{viewingBooking.dates.pickupDate} to {viewingBooking.dates.returnDate} ({viewingBooking.dates.days} Days)</span>
                </div>
                {viewingBooking.customer.mpesaPhone && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="font-bold block text-[10px] uppercase">M-Pesa Express Billing Number:</span>
                    <span className="font-mono font-bold text-sm">{viewingBooking.customer.mpesaPhone}</span>
                  </div>
                )}
                {viewingBooking.customer.specialRequests && (
                  <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-bold uppercase text-[10px] text-slate-400 block">Client Notes / Destination:</span>
                    <p className="mt-1 italic">"{viewingBooking.customer.specialRequests}"</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between text-sm">
                <span className="font-bold text-slate-700">Total Rental Value:</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  {formatPrice(viewingBooking.pricing.grandTotal, viewingBooking.pricing.grandTotalKsh)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${viewingBooking.customer.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello ${viewingBooking.customer.fullName}, this is OttoRental regarding your vehicle reservation ${viewingBooking.id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-otto-primary text-xs py-2.5 px-5 uppercase flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
