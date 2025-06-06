import { Users, Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const ProgramTabsSection = ({
  currentPrograms,
  upcomingPrograms,
  activeTab,
  setActiveTab,
  handleJoinProgram
}) => {
  const programsToRender = activeTab === 'current' ? currentPrograms : upcomingPrograms;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Các Chương Trình Hoạt Động
          </h2>
          <p className="text-lg text-gray-600">
            Tham gia các hoạt động ý nghĩa và tạo ra sự thay đổi tích cực
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeTab === 'current'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Đang diễn ra
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Sắp tới
            </button>
          </div>
        </div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsToRender.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      program.status === 'Đang diễn ra'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {program.status}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {program.participants}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    {program.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    {program.location}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Hoạt động:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {program.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleJoinProgram(program.id)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                  Tham gia chương trình
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramTabsSection;
