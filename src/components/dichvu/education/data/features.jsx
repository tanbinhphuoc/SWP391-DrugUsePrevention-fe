import { Brain, Target, Zap, Shield } from 'lucide-react';

export const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Phương pháp Khoa học",
    description: "Dựa trên nghiên cứu tâm lý học và giáo dục học",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Tùy chỉnh theo Độ tuổi",
    description: "Nội dung phù hợp với từng lứa tuổi và đối tượng",
    gradient: "from-green-500 to-blue-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Tương tác Cao",
    description: "Học qua trò chơi, video và bài tập thực hành",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "An toàn & Bảo mật",
    description: "Thông tin cá nhân được bảo vệ tuyệt đối",
    gradient: "from-red-500 to-orange-500"
  }
];
