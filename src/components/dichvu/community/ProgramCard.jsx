import React from 'react';

const ProgramCard = ({ program, isUpcoming }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition-transform duration-300 group">
      <img
        src={program.image}
        alt={program.title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
      <p className="text-gray-600 mb-2">{program.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Thời gian: {program.date}
      </p>
      {isUpcoming ? (
        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-semibold rounded-full">
          Sắp diễn ra
        </span>
      ) : (
        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold rounded-full">
          Đang diễn ra
        </span>
      )}
    </div>
  );
};

export default ProgramCard;
