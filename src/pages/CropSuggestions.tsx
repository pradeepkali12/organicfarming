import React, { useEffect, useState } from 'react';
import { Tractor, Droplets, Sun, ThermometerSun, Loader2, Leaf, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getCropSuggestions } from '../lib/gemini';

interface CropSuggestion {
  name: string;
  confidence: number;
  waterNeeds: 'Low' | 'Medium' | 'High';
  sunlight: 'Full Sun' | 'Partial Shade' | 'Full Shade';
  temperature: string;
  description: string;
  organicGuide: {
    preparation: string[];
    planting: string[];
    maintenance: string[];
    harvesting: string[];
  };
}

interface OrganicGuide {
  isOpen: boolean;
  cropName: string;
  section?: 'preparation' | 'planting' | 'maintenance' | 'harvesting';
}

function CropSuggestions() {
  const [farmData, setFarmData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<OrganicGuide>({
    isOpen: false,
    cropName: ''
  });

  useEffect(() => {
    const storedData = localStorage.getItem('farmData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setFarmData(data);
      fetchSuggestions(data);
    }
  }, []);

  const fetchSuggestions = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCropSuggestions(data);
      setSuggestions(result);
    } catch (err) {
      setError('Failed to get crop suggestions. Please try again later.');
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCropClick = (cropName: string) => {
    setSelectedCrop(prev => ({
      isOpen: prev.cropName !== cropName || !prev.isOpen,
      cropName: cropName
    }));
  };

  if (!farmData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">Please input your farm data first</h2>
        <p className="text-gray-600 mt-2">Visit the Data Input page to get personalized crop suggestions</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">AI-Powered Crop Suggestions</h1>
        
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Farm Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Soil Type: <span className="font-medium">{farmData.soilType}</span></p>
              <p className="text-gray-600">Land Size: <span className="font-medium">{farmData.landSize} acres</span></p>
            </div>
            <div>
              <p className="text-gray-600">Location: <span className="font-medium">{farmData.location}</span></p>
              <p className="text-gray-600">Water: <span className="font-medium">{farmData.waterAvailability}</span></p>
            </div>
          </div>
          {farmData.issues && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-700">Reported Issues:</span>
              </div>
              <p className="mt-1 text-yellow-600">{farmData.issues}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            <span className="ml-2 text-gray-600">Analyzing your farm data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchSuggestions(farmData)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestions.map((crop, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Tractor className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {crop.confidence}% Match
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{crop.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span>Water: {crop.waterNeeds}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>Sun: {crop.sunlight}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThermometerSun className="h-5 w-5 text-red-500" />
                    <span>Temp: {crop.temperature}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCropClick(crop.name)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 transition-colors"
                >
                  <Leaf className="h-5 w-5" />
                  <span>
                    {selectedCrop.isOpen && selectedCrop.cropName === crop.name
                      ? 'Hide Organic Farming Guide'
                      : 'View Organic Farming Guide'
                    }
                  </span>
                  {selectedCrop.isOpen && selectedCrop.cropName === crop.name
                    ? <ChevronUp className="h-4 w-4 ml-2" />
                    : <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </button>

                {selectedCrop.isOpen && selectedCrop.cropName === crop.name && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4">Organic Farming Guide for {crop.name}</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">1. Soil Preparation</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          {crop.organicGuide.preparation.map((step, i) => (
                            <li key={i} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h5 className="font-medium text-green-800 mb-2">2. Planting Process</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          {crop.organicGuide.planting.map((step, i) => (
                            <li key={i} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h5 className="font-medium text-green-800 mb-2">3. Maintenance & Care</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          {crop.organicGuide.maintenance.map((step, i) => (
                            <li key={i} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h5 className="font-medium text-green-800 mb-2">4. Harvesting Guide</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          {crop.organicGuide.harvesting.map((step, i) => (
                            <li key={i} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </div>

                      {farmData.issues && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h5 className="font-medium text-yellow-800 mb-2">Organic Solutions for Your Issues</h5>
                          <div className="space-y-2 text-gray-700">
                            <p>Based on your reported issues, here are organic solutions:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Use companion planting with pest-repelling herbs</li>
                              <li>Apply organic compost tea for plant health</li>
                              <li>Introduce beneficial insects for pest control</li>
                              <li>Use neem oil or other natural pesticides</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CropSuggestions;