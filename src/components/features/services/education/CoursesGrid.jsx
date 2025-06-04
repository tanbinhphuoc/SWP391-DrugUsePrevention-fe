import CourseCard from './CourseCard';

const CoursesGrid = ({ courses }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {courses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
);

export default CoursesGrid;
