import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Tractor, Sprout, MessageSquare, Menu } from 'lucide-react';
import DataInput from './pages/DataInput';
import CropSuggestions from './pages/CropSuggestions';
import Chatbot from './pages/Chatbot';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Tractor className="h-8 w-8 text-green-600" />
                  <span className="text-xl font-bold text-gray-800">FarmAssist</span>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:flex md:items-center md:space-x-6">
                <NavLink to="/" icon={<Tractor className="h-5 w-5" />} text="Data Input" />
                <NavLink to="/suggestions" icon={<Sprout className="h-5 w-5" />} text="Crop Suggestions" />
                <NavLink to="/chatbot" icon={<MessageSquare className="h-5 w-5" />} text="AI Assistant" />
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink to="/" text="Data Input" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/suggestions" text="Crop Suggestions" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/chatbot" text="AI Assistant" onClick={() => setIsMenuOpen(false)} />
              </div>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<DataInput />} />
            <Route path="/suggestions" element={<CropSuggestions />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

function MobileNavLink({ to, text, onClick }: { to: string; text: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
    >
      {text}
    </Link>
  );
}

export default App;