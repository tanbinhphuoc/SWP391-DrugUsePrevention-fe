// data/coursesData.js
export const courses = [
  {
    id: 1,
    title: "Hiểu biết về Ma túy và Tác hại",
    category: "basic",
    duration: "4 tuần",
    students: 1250,
    rating: 4.8,
    level: "Cơ bản",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    instructor: "TS. Nguyễn Văn A",
    price: "Miễn phí",
    description: "Khóa học cung cấp kiến thức cơ bản về các loại ma túy, tác hại và cách phòng tránh."
  },
  {
    id: 2,
    title: "Kỹ năng Từ chối Ma túy",
    category: "skills",
    duration: "3 tuần",
    students: 980,
    rating: 4.9,
    level: "Trung bình",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    instructor: "ThS. Trần Thị B",
    price: "500.000 VNĐ",
    description: "Học cách nói không với ma túy một cách tự tin và hiệu quả trong các tình huống khác nhau."
  },
  {
    id: 3,
    title: "Tâm lý học Nghiện và Phục hồi",
    category: "advanced",
    duration: "6 tuần",
    students: 567,
    rating: 4.7,
    level: "Nâng cao",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    instructor: "PGS. Lê Văn C",
    price: "1.200.000 VNĐ",
    description: "Khóa học chuyên sâu về tâm lý nghiện và các phương pháp hỗ trợ phục hồi."
  },
  {
    id: 4,
    title: "Giáo dục Phòng chống cho Gia đình",
    category: "family",
    duration: "5 tuần",
    students: 2100,
    rating: 4.9,
    level: "Cơ bản",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop",
    instructor: "TS. Phạm Thị D",
    price: "Miễn phí",
    description: "Hướng dẫn cha mẹ cách giáo dục con em về tác hại của ma túy."
  }
];

export const categories = [
  { id: 'all', name: 'Tất cả', count: courses.length },
  { id: 'basic', name: 'Cơ bản', count: courses.filter(c => c.category === 'basic').length },
  { id: 'skills', name: 'Kỹ năng', count: courses.filter(c => c.category === 'skills').length },
  { id: 'advanced', name: 'Nâng cao', count: courses.filter(c => c.category === 'advanced').length },
  { id: 'family', name: 'Gia đình', count: courses.filter(c => c.category === 'family').length }
];
