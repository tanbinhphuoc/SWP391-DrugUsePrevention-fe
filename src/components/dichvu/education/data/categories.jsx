import { BookOpen, Heart, Users, Shield, Globe } from 'lucide-react';

export const categories = [
  { id: 'all', name: 'Tất cả', icon: <Globe className="w-5 h-5" /> },
  { id: 'students', name: 'Học sinh', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'parents', name: 'Phụ huynh', icon: <Heart className="w-5 h-5" /> },
  { id: 'teachers', name: 'Giáo viên', icon: <Users className="w-5 h-5" /> },
  { id: 'community', name: 'Cộng đồng', icon: <Shield className="w-5 h-5" /> }
];
