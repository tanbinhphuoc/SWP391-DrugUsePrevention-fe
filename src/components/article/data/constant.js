import { Globe, Users, Lock } from 'lucide-react';

export const categories = [
  { id: 'all', name: 'Tất cả', icon: '📋', color: 'bg-gray-100' },
  { id: 'education', name: 'Giáo dục phòng chống', icon: '🎓', color: 'bg-blue-100' },
  { id: 'knowledge', name: 'Kiến thức về ma túy', icon: '🧠', color: 'bg-purple-100' },
  { id: 'stories', name: 'Câu chuyện thật', icon: '💬', color: 'bg-green-100' },
  { id: 'health', name: 'Sức khỏe tâm thần', icon: '🧑‍⚕️', color: 'bg-red-100' },
  { id: 'family', name: 'Gia đình và xã hội', icon: '👨‍👩‍👧', color: 'bg-yellow-100' },
  { id: 'events', name: 'Sự kiện cộng đồng', icon: '🗓️', color: 'bg-indigo-100' }
];

export const privacyOptions = [
  { id: 'public', name: 'Công khai', icon: Globe, desc: 'Mọi người đều có thể xem' },
  { id: 'friends', name: 'Bạn bè', icon: Users, desc: 'Chỉ bạn bè có thể xem' },
  { id: 'private', name: 'Riêng tư', icon: Lock, desc: 'Chỉ mình bạn có thể xem' }
];

export const commonEmojis = [
  '😊', '😍', '🤗', '👍', '❤️', '😢', '😱', '😡', '🤔',
  '👏', '🙏', '💪', '🔥', '✨', '🎉', '📚', '💡', '🌟'
];
