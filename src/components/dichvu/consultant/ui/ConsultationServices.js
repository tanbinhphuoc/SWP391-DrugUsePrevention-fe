import { MessageCircle, Video, Users } from 'lucide-react';

export const consultationServices = [
  {
    id: 1,
    title: "Tư vấn cá nhân",
    description: "Hỗ trợ tư vấn riêng tư với chuyên gia y tế",
    iconComponent: MessageCircle,
    price: "500,000 VNĐ",
    duration: "60 phút",
    features: ["Tư vấn riêng tư", "Kế hoạch cá nhân hóa", "Theo dõi tiến độ", "Hỗ trợ 24/7"]
  },
  {
    id: 2,
    title: "Tư vấn trực tuyến",
    description: "Gặp gỡ chuyên gia qua video call từ xa",
    iconComponent: Video,
    price: "300,000 VNĐ",
    duration: "45 phút",
    features: ["Video call HD", "Ghi lại buổi tư vấn", "Tài liệu hỗ trợ", "Linh hoạt thời gian"]
  },
  {
    id: 3,
    title: "Tư vấn nhóm",
    description: "Tham gia nhóm tư vấn với những người có cùng quan tâm",
    iconComponent: Users,
    price: "200,000 VNĐ",
    duration: "90 phút",
    features: ["Nhóm 6-8 người", "Chia sẻ kinh nghiệm", "Chi phí thấp", "Hỗ trợ lâu dài"]
  }
];
