import React, { useState } from 'react';
import ProgramCard from './ProgramCard';

const ProgramsSection = ({ currentPrograms, upcomingPrograms, onJoin }) => {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Các Chương trình</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những chương trình đang diễn ra và sắp tới để cùng chúng tôi tạo nên sự khác biệt
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'current'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đang diễn ra ({currentPrograms.length})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sắp diễn ra ({upcomingPrograms.length})
              </button>
            </div>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'current' ? currentPrograms : upcomingPrograms).map((program) => (
              <ProgramCard 
                key={program.id} 
                program={program} 
                isUpcoming={activeTab === 'upcoming'} 
              />
            ))}
          </div>
        </div>
      </section>
  );
};

export default ProgramsSection;
