import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FarmData {
  soilType: string;
  landSize: string;
  location: string;
  waterAvailability: string;
  previousCrops: string;
  issues?: string;
}

function DataInput() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FarmData>({
    soilType: '',
    landSize: '',
    location: '',
    waterAvailability: '',
    previousCrops: '',
    issues: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('farmData', JSON.stringify(formData));
    navigate('/suggestions'); // Automatically navigate to suggestions
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Farm Data Input</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soil Type
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select soil type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="silt">Silt</option>
              <option value="peat">Peat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Size (in acres)
            </label>
            <input
              type="number"
              name="landSize"
              value={formData.landSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Availability
            </label>
            <select
              name="waterAvailability"
              value={formData.waterAvailability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select water availability</option>
              <option value="abundant">Abundant (Natural water sources)</option>
              <option value="moderate">Moderate (Irrigation system)</option>
              <option value="limited">Limited (Rainfall dependent)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Crops
            </label>
            <textarea
              name="previousCrops"
              value={formData.previousCrops}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="List the crops you've grown in the last season"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Issues (Optional)
            </label>
            <textarea
              name="issues"
              value={formData.issues}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Describe any current issues (pests, diseases, soil problems, etc.)"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="h-5 w-5" />
            <span>Save & View Suggestions</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default DataInput;