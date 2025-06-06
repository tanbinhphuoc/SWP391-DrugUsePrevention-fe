import { Clock, Users, Star } from 'lucide-react';
const CoursesGrid = ({ courses }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {courses.map((course) => (
      <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-105">
        <div className="relative">
          <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
            {course.level}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course.students}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {course.rating}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">{course.price}</span>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CoursesGrid;
