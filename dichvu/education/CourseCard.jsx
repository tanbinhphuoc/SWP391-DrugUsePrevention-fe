import { User, Star, Clock, Users, ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:transform hover:-translate-y-2">
    <div className="relative overflow-hidden">
      <img 
        src={course.image} 
        alt={course.title}
        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
        {course.level}
      </div>
      <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-bold">
        {course.price}
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {course.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {course.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">{course.instructor}</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm font-medium">{course.rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {course.duration}
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {course.students} học viên
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center group">
        Đăng ký ngay
        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

export default CourseCard;
