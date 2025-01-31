import React, { useState, useEffect } from 'react';
import { Search, Car, AlertCircle, Shield, Gauge, FileText, IndianRupee, MapPin, FileCheck, Building, User, Moon, Sun, GitBranch as BrandTelegram, Calendar, Cpu, Truck } from 'lucide-react';
import type { VehicleResponse } from './types';

function App() {
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleResponse['data']['detail'] | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://codex-ml.tech/api/rc.php?regno=${regNo}`);
      const data: VehicleResponse = await response.json();
      
      if (!data.data.success) {
        throw new Error(data.data.message || 'Failed to fetch vehicle details');
      }
      
      setVehicleData(data.data.detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicle details');
      setVehicleData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} pb-12`}>
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-600" />
          )}
        </button>

        <div className="text-center mb-12 animate-fade-in">
          {vehicleData?.makeLogo ? (
            <img src={vehicleData.makeLogo} alt="Brand Logo" className="w-16 h-16 mx-auto mb-6" />
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <Car className="w-8 h-8 text-white" />
            </div>
          )}
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3 ${darkMode ? 'dark:from-indigo-300 dark:to-purple-300' : ''}`}>
            Vehicle Information Portal
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Access comprehensive details about any registered vehicle in India
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-12 animate-slide-up">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="Enter Vehicle Registration Number"
                className={`w-full p-4 pl-5 pr-12 text-lg border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white/50 border-gray-200 backdrop-blur-sm'
                }`}
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-12 animate-slide-up">
            <div className={`border-l-4 border-red-500 rounded-lg p-5 flex items-start gap-4 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className={darkMode ? 'text-red-400' : 'text-red-700'}>{error}</p>
            </div>
          </div>
        )}

        {vehicleData && (
          <div className="animate-fade-in space-y-8">
            <div className={`backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
              {vehicleData.modelImageUrl && (
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={vehicleData.modelImageUrl}
                    alt={`${vehicleData.brand?.make_display || ''} ${vehicleData.model?.model_display || ''}`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {vehicleData.brand?.make_display} {vehicleData.model?.model_display}
                      </h2>
                      <p className="text-white/90 text-lg">
                        {vehicleData.registrationNumber} • {vehicleData.fuelType}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <InfoSection title="Basic Information" icon={<Car className="w-5 h-5 text-indigo-400" />}>
                    <InfoCard
                      title="Registration Details"
                      items={[
                        { label: "Registration Number", value: vehicleData.registrationNumber },
                        { label: "Registration Date", value: formatDate(vehicleData.registeredAt) },
                        { label: "Registration Year", value: vehicleData.regn_year },
                        { label: "Registered At", value: vehicleData.registeredPlace },
                        { label: "RTO Code", value: vehicleData.RTO?.rto_code || 'N/A' },
                        { label: "State", value: vehicleData.states?.state_name || 'N/A' },
                        { label: "Owner Name", value: vehicleData.rc_owner_name || vehicleData.rc_owner_name_masked },
                        { label: "Owner Serial", value: vehicleData.rc_owner_sr },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Vehicle Specifications" icon={<Gauge className="w-5 h-5 text-purple-400" />}>
                    <InfoCard
                      title="Technical Details"
                      items={[
                        { label: "Make & Model", value: `${vehicleData.brand?.make_display || 'N/A'} ${vehicleData.model?.model_display || ''}` },
                        { label: "Variant", value: vehicleData.ds_details?.[0]?.variant?.variant_display_name || 'N/A' },
                        { label: "RC Model", value: vehicleData.rc_model || 'N/A' },
                        { label: "Vehicle Class", value: vehicleData.vehicleClassDesc },
                        { label: "Vehicle Category", value: vehicleData.vehicleCategory },
                        { label: "Body Type", value: vehicleData.full_details?.bodyType || 'N/A' },
                        { label: "Color", value: vehicleData.color },
                        { label: "Fuel Type", value: vehicleData.fuelType },
                        { label: "Transmission", value: vehicleData.ds_details?.[0]?.variant?.transmission_type || vehicleData.full_details?.transmission || 'N/A' },
                        { label: "Transportation Category", value: vehicleData.ds_details?.[0]?.variant?.transportation_category || 'N/A' },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Engine Details" icon={<Cpu className="w-5 h-5 text-green-400" />}>
                    <InfoCard
                      title="Engine Information"
                      items={[
                        { label: "Engine Number", value: vehicleData.engineNo || vehicleData.engineNo },
                        { label: "Chassis Number", value: vehicleData.chassisNoFull || vehicleData.chassisNo },
                        { label: "Cubic Capacity", value: `${vehicleData.cubicCap} cc` },
                        { label: "No. of Cylinders", value: vehicleData.full_details?.noOfCylinder || 'N/A' },
                        { label: "Wheelbase", value: `${vehicleData.full_details?.wheelbase || 'N/A'} mm` },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Weight Information" icon={<Truck className="w-5 h-5 text-yellow-400" />}>
                    <InfoCard
                      title="Weight Details"
                      items={[
                        { label: "Unladen Weight", value: `${vehicleData.unladenWt} kg` },
                        { label: "Gross Weight", value: `${vehicleData.full_details?.grossWt || 'N/A'} kg` },
                        { label: "Seating Capacity", value: `${vehicleData.seatCap} seats` },
                        { label: "Standing Capacity", value: vehicleData.full_details?.standCap || 'N/A' },
                        { label: "Sleeper Capacity", value: vehicleData.full_details?.sleeperCap || 'N/A' },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Insurance & Compliance" icon={<Shield className="w-5 h-5 text-blue-400" />}>
                    <InfoCard
                      title="Insurance Details"
                      items={[
                        { label: "Insurance Company", value: vehicleData.insuranceCompany },
                        { label: "Policy Number", value: vehicleData.insurancePolicyNo },
                        { label: "Valid Till", value: formatDate(vehicleData.insuranceUpTo) },
                      ]}
                    />
                    <InfoCard
                      title="Compliance Status"
                      items={[
                        { label: "RC Status", value: vehicleData.rcStatus },
                        { label: "RC Status As On", value: formatDate(vehicleData.rcStatusAsOn) },
                        { label: "PUC Number", value: vehicleData.full_details?.pucNo || 'N/A' },
                        { label: "PUC Valid Till", value: formatDate(vehicleData.pucUpTo) },
                        { label: "Fitness Valid Till", value: formatDate(vehicleData.fitnessUpTo) },
                        { label: "Tax Valid Till", value: formatDate(vehicleData.taxUpTo) },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Finance & NOC" icon={<IndianRupee className="w-5 h-5 text-red-400" />}>
                    <InfoCard
                      title="Financial Information"
                      items={[
                        { label: "Hypothecation", value: vehicleData.hypothecation ? "Yes" : "No" },
                        { label: "Financier", value: vehicleData.financier || 'N/A' },
                        { label: "Blacklisted", value: vehicleData.full_details?.blacklisted || 'No' },
                        { label: "RTO NOC Issued", value: vehicleData.rtoNocIssued === 'true' ? 'Yes' : 'No' },
                        { label: "NOC Details", value: vehicleData.full_details?.nocDetails || 'N/A' },
                        { label: "Is Commercial", value: vehicleData.isCommercial ? "Yes" : "No" },
                        { label: "Commercial Franchise Region", value: vehicleData.isCommercialFrachiseRegion ? "Yes" : "No" },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Address Information" icon={<MapPin className="w-5 h-5 text-orange-400" />}>
                    <InfoCard
                      title="Address Details"
                      items={[
                        { label: "Present Address", value: vehicleData.full_details?.presentAddress || vehicleData.full_details?.presentAddressMasked || 'N/A' },
                        { label: "Permanent Address", value: vehicleData.presentAddressMasked || 'N/A' },
                        { label: "Pin Code", value: vehicleData.full_details?.pinCode || 'N/A' },
                        { label: "Mobile Number", value: vehicleData.full_details?.mobileNo || 'N/A' },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Permit Information" icon={<FileCheck className="w-5 h-5 text-teal-400" />}>
                    <InfoCard
                      title="Permit Details"
                      items={[
                        { label: "Permit Number", value: vehicleData.full_details?.permitNo || 'N/A' },
                        { label: "Permit Type", value: vehicleData.full_details?.permitType || 'N/A' },
                        { label: "Permit Issue Date", value: vehicleData.full_details?.permitIssueDt || 'N/A' },
                        { label: "Valid From", value: vehicleData.full_details?.permitValidFrom || 'N/A' },
                        { label: "Valid Up To", value: vehicleData.full_details?.permitValidUpTo || 'N/A' },
                      ]}
                    />
                  </InfoSection>

                  <InfoSection title="Additional Information" icon={<Calendar className="w-5 h-5 text-pink-400" />}>
                    <InfoCard
                      title="Other Details"
                      items={[
                        { label: "Source", value: vehicleData.full_details?.source || 'N/A' },
                        { label: "NCRB Status", value: vehicleData.full_details?.ncrbStatus || 'N/A' },
                        { label: "Blacklist Status", value: vehicleData.full_details?.blacklistStatus || 'N/A' },
                        { label: "Manufacturing Date", value: vehicleData.manufacturingMonthYr || 'N/A' },
                        { label: "Maker Name", value: vehicleData.full_details?.maker || 'N/A' },
                      ]}
                    />
                  </InfoSection>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={`mt-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <a
            href="https://t.me/MRXISBACK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-indigo-500 transition-colors duration-300"
          >
            <BrandTelegram className="w-5 h-5" />
            <span>Created by MRXISBACK</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  items: Array<{ label: string; value: string }>;
}

function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className={`rounded-xl p-4 shadow-sm border transition-shadow duration-300 hover:shadow-md
      dark:bg-gray-800 dark:border-gray-700
      bg-white border-gray-100`}
    >
      <h4 className="text-sm font-medium mb-3 dark:text-gray-400 text-gray-500">{title}</h4>
      <div className="space-y-2">
        {items.map(({ label, value }) => {
          // Skip masked engine numbers
          if (label === "Engine Number" && value?.includes("X")) {
            return null;
          }
          return (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm dark:text-gray-400 text-gray-600">{label}</span>
              <span className="font-medium dark:text-gray-200 text-gray-900">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default App;
