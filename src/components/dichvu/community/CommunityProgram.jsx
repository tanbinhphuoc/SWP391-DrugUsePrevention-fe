import { Users, Target, Award, Heart } from 'lucide-react';

export const currentPrograms = [
  {
    id: 1,
    title: "Tuần lễ nhận thức về tác hại ma túy",
    description: "Chương trình giáo dục cộng đồng về tác hại của ma túy và cách phòng tránh",
    date: "15-22 Tháng 7, 2025",
    location: "Các trường học tại TP.HCM",
    participants: 500,
    status: "Đang diễn ra",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop",
    activities: ["Hội thảo giáo dục", "Triển lãm tương tác", "Tư vấn miễn phí", "Hoạt động văn nghệ"]
  },
  {
    id: 2,
    title: "Câu lạc bộ Sống khỏe mạnh",
    description: "Hoạt động thể thao và sinh hoạt tích cực cho thanh thiếu niên",
    date: "Mỗi thứ 7 hàng tuần",
    location: "Công viên Tao Đàn",
    participants: 120,
    status: "Đang diễn ra",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    activities: ["Thể thao ngoài trời", "Yoga thiền định", "Chia sẻ kinh nghiệm", "Hoạt động team building"]
  },
  {
    id: 3,
    title: "Đào tạo tình nguyện viên",
    description: "Chương trình đào tạo kỹ năng cho các tình nguyện viên tham gia phòng chống tệ nạn xã hội",
    date: "Tháng 8, 2025",
    location: "Trung tâm đào tạo PreventionSupport",
    participants: 80,
    status: "Sắp diễn ra",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=250&fit=crop",
    activities: ["Đào tạo kỹ năng giao tiếp", "Hướng dẫn tư vấn cơ bản", "Thực hành tình huống", "Cấp chứng chỉ"]
  }
];

export const upcomingPrograms = [
  {
    id: 4,
    title: "Hội thảo quốc tế về phòng chống ma túy",
    description: "Hội thảo với sự tham gia của các chuyên gia trong nước và quốc tế",
    date: "15-17 Tháng 9, 2025",
    location: "Trung tâm Hội nghị Quốc gia",
    participants: 1000,
    status: "Sắp diễn ra",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    activities: ["Báo cáo khoa học", "Thảo luận chuyên đề", "Triển lãm công nghệ", "Gặp gỡ chuyên gia"]
  },
  {
    id: 5,
    title: "Chương trình hỗ trợ gia đình",
    description: "Hỗ trợ tâm lý và tư vấn cho các gia đình có người thân gặp vấn đề",
    date: "Tháng 10, 2025",
    location: "Các quận trên toàn TP.HCM",
    participants: 300,
    status: "Đang chuẩn bị",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop",
    activities: ["Tư vấn gia đình", "Nhóm hỗ trợ", "Hoạt động kết nối", "Chăm sóc tâm lý"]
  }
];

export const achievements = [
  {
    icon: <Users className="w-8 h-8" />,
    number: "10,000+",
    label: "Người tham gia",
    description: "Đã tham gia các chương trình của chúng tôi"
  },
  {
    icon: <Target className="w-8 h-8" />,
    number: "50+",
    label: "Chương trình",
    description: "Đã tổ chức thành công"
  },
  {
    icon: <Award className="w-8 h-8" />,
    number: "95%",
    label: "Hiệu quả",
    description: "Người tham gia hài lòng với chương trình"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    number: "500+",
    label: "Tình nguyện viên",
    description: "Đang hoạt động tích cực"
  }
];

export const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Phụ huynh",
    content: "Chương trình đã giúp con tôi có những hiểu biết đúng đắn về tác hại của ma túy. Cảm ơn đội ngũ PreventionSupport!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616c8e4d2e6?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Trần Văn Hùng",
    role: "Tình nguyện viên",
    content: "Tham gia làm tình nguyện viên đã cho tôi cơ hội góp phần vào việc xây dựng cộng đồng tốt đẹp hơn.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Lê Thị Hương",
    role: "Giáo viên",
    content: "Các hoạt động giáo dục rất bổ ích, học sinh rất hứng thú tham gia và có những thay đổi tích cực.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  }
];
