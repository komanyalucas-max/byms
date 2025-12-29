import { useState } from 'react';
import { MapPin, ArrowRight, Globe, ArrowLeft } from 'lucide-react';

interface LocationSelectionProps {
  onLocationSelected: (location: string) => void;
  onBack: () => void;
}

// Tanzanian regions
const tanzanianRegions = [
  'Dar es Salaam',
  'Mwanza',
  'Arusha',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Zanzibar',
  'Kilimanjaro',
  'Tabora',
  'Kigoma',
  'Mtwara',
  'Pwani (Coast)',
  'Shinyanga',
  'Kagera',
  'Mara',
  'Iringa',
  'Rukwa',
  'Lindi',
  'Singida',
  'Ruvuma',
  'Katavi',
  'Njombe',
  'Simiyu',
  'Geita',
  'Songwe',
];

// Neighboring countries
const neighboringCountries = [
  'Kenya',
  'Uganda',
  'Congo',
  'Somalia',
  'Ethiopia',
  'Rwanda',
  'Malawi',
];

// Shipping costs
const getShippingCostByLocation = (location: string): number => {
  // All Tanzanian regions have the same shipping cost
  if (tanzanianRegions.includes(location)) {
    return 5; // Local shipping within Tanzania
  }
  
  // Neighboring countries
  const neighboringCosts: Record<string, number> = {
    'Kenya': 15,
    'Uganda': 20,
    'Congo': 25,
    'Somalia': 25,
    'Ethiopia': 25,
    'Rwanda': 20,
    'Malawi': 20,
  };
  
  return neighboringCosts[location] || 50;
};

export function LocationSelection({ onLocationSelected, onBack }: LocationSelectionProps) {
  const [step, setStep] = useState<'choose-type' | 'choose-location'>('choose-type');
  const [locationType, setLocationType] = useState<'tanzania' | 'other' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLocationTypeSelect = (type: 'tanzania' | 'other') => {
    setLocationType(type);
    setStep('choose-location');
  };

  const handleBackToType = () => {
    setStep('choose-type');
    setLocationType(null);
    setSelectedLocation('');
    setSearchTerm('');
  };

  const handleContinue = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  // Step 1: Choose location type
  if (step === 'choose-type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 py-12">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Where Are You Located?
            </h1>
            <p className="text-slate-300">
              Select your location to calculate shipping costs
            </p>
          </div>

          {/* Location Type Selection */}
          <div className="grid gap-6 mb-8">
            {/* Tanzania Option */}
            <button
              onClick={() => handleLocationTypeSelect('tanzania')}
              className="group relative p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-emerald-300" />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Tanzania</h2>
                  <p className="text-slate-400">I'm located in Tanzania</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Local shipping: $5
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-2 transition-all" />
              </div>
            </button>

            {/* Other Countries Option */}
            <button
              onClick={() => handleLocationTypeSelect('other')}
              className="group relative p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border-2 border-slate-700/50 hover:border-blue-500/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Other Countries</h2>
                  <p className="text-slate-400">I'm from a neighboring country</p>
                  <div className="mt-3 text-sm text-slate-500">
                    Kenya, Uganda, Congo, Somalia, Ethiopia, Rwanda, Malawi
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-300 group-hover:translate-x-2 transition-all" />
              </div>
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full py-4 px-6 bg-slate-800/50 backdrop-blur-xl text-slate-300 rounded-2xl border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Choose specific location
  const locations = locationType === 'tanzania' ? tanzanianRegions : neighboringCountries;
  const filteredLocations = searchTerm
    ? locations.filter((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : locations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 py-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {locationType === 'tanzania' ? 'Select Your Region' : 'Select Your Country'}
          </h1>
          <p className="text-slate-300">
            {locationType === 'tanzania' 
              ? 'Choose your region in Tanzania' 
              : 'Choose your country from the list'}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
            <input
              type="text"
              placeholder={locationType === 'tanzania' ? 'Search for your region...' : 'Search for your country...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Locations List */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl mb-6">
          <div className="max-h-[500px] overflow-y-auto">
            <div className="divide-y divide-slate-700/30">
              {filteredLocations.map((location) => {
                const shippingCost = getShippingCostByLocation(location);
                return (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`w-full px-6 py-4 text-left transition-all ${
                      selectedLocation === location
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span
                          className={`block ${
                            selectedLocation === location
                              ? 'text-white font-medium'
                              : 'text-slate-300'
                          }`}
                        >
                          {location}
                        </span>
                        {selectedLocation === location && (
                          <span className="text-sm text-cyan-300 mt-1 block">
                            Shipping: ${shippingCost}
                          </span>
                        )}
                      </div>
                      {selectedLocation === location && (
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 ml-4">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBackToType}
            className="flex-1 py-4 px-6 bg-slate-800/50 backdrop-blur-xl text-slate-300 rounded-2xl border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedLocation}
            className="group relative flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Export function to get shipping cost by location
export function getShippingCost(location: string): number {
  return getShippingCostByLocation(location);
}