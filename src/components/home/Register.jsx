import React, { useState, useCallback } from 'react';
import { User, Mail, Phone, Lock, LockKeyhole, Eye, EyeOff, RefreshCw, Calendar, MapPin, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Hàm kiểm tra độ mạnh mật khẩu
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push('Ít nhất 8 ký tự');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Chữ hoa');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Chữ thường');

    if (/\d/.test(password)) score++;
    else feedback.push('Số');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('Ký tự đặc biệt');

    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
    return { score, strength, feedback };
  };

  // Hàm validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm validate số điện thoại (Vietnam)
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Hàm validate tên đăng nhập
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Hàm validate ngày sinh
  const validateBirthDate = (birthDate) => {
    if (!birthDate) return false;
    
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 13 && age <= 100;
  };

  // Hàm validate form
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra tên đăng nhập
    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới';
    }

    // Kiểm tra họ và tên
    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Kiểm tra email
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ';
    }

    // Kiểm tra số điện thoại
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)';
    }

    // Kiểm tra ngày sinh
    if (!birthDate) {
      newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    } else if (!validateBirthDate(birthDate)) {
      newErrors.birthDate = 'Ngày sinh không hợp lệ (tuổi từ 13-100)';
    }

    // Kiểm tra địa chỉ
    if (!address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    }

    // Kiểm tra mật khẩu
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordStrength = checkPasswordStrength(password);
      if (passwordStrength.strength === 'weak') {
        newErrors.password = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn';
      }
    }

    // Kiểm tra xác nhận mật khẩu
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Kiểm tra điều khoản
    if (!acceptTerms) {
      newErrors.acceptTerms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm tạo mật khẩu mạnh
  const generateStrongPassword = useCallback(() => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*(),.?":{}|<>';
    
    let password = '';
    
    // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Thêm các ký tự ngẫu nhiên để đạt độ dài 12
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Trộn các ký tự
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const passwordStrength = password ? checkPasswordStrength(password) : null;

  // Event handlers cho các trường mới
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: '' }));
    }
  }, [errors.username]);

  const handleBirthDateChange = useCallback((e) => {
    setBirthDate(e.target.value);
    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  }, [errors.birthDate]);

  const handleAddressChange = useCallback((e) => {
    setAddress(e.target.value);
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  }, [errors.address]);

  // Event handlers hiện có
  const handleFullNameChange = useCallback((e) => {
    setFullName(e.target.value);
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  }, [errors.fullName]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }, [errors.email]);

  const handlePhoneChange = useCallback((e) => {
    setPhone(e.target.value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }, [errors.phone]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  }, [errors.password]);

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [errors.confirmPassword]);

  const handleAcceptTermsChange = useCallback((e) => {
    setAcceptTerms(e.target.checked);
    if (errors.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: '' }));
    }
  }, [errors.acceptTerms]);

  const handleNewsletterChange = useCallback((e) => {
    setNewsletter(e.target.checked);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generateStrongPassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [generateStrongPassword, errors.password, errors.confirmPassword]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      alert('Vui lòng kiểm tra lại và nhập đầy đủ thông tin!');
      return;
    }
    
    alert('Đăng ký thành công! 🎉');

    console.log('Register data:', {
      username,
      fullName,
      email,
      phone,
      birthDate,
      address,
      password,
      confirmPassword,
      acceptTerms,
      newsletter
    });
  }, [username, fullName, email, phone, birthDate, address, password, confirmPassword, acceptTerms, newsletter]);

  const BackToHomeButton = () => (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="fixed top-8 left-8 z-50 group flex items-center gap-3 px-6 py-3
                 bg-white/90 backdrop-blur-xl border border-white/30 rounded-full
                 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/20
                 transition-all duration-300 hover:-translate-y-1 hover:scale-105
                 focus:outline-none focus:ring-4 focus:ring-white/50
                 animate-slide-in-left"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500
                       rounded-full group-hover:rotate-[-5deg] transition-transform duration-300">
        <ArrowLeft className="w-4 h-4 text-white" />
      </div>
      <span className="text-gray-700 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
        Quay lại trang chủ
      </span>
      <Home className="w-5 h-5 text-gray-500 group-hover:text-cyan-500 group-hover:scale-110 transition-all duration-300" />
    </button>
  );

  const FloatingShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-20 h-20 bg-white/10 rounded-full top-1/5 left-1/10 animate-float"></div>
      <div className="absolute w-15 h-15 bg-white/10 rounded-full top-3/5 left-4/5 animate-float-delayed"></div>
      <div className="absolute w-25 h-25 bg-white/10 rounded-full top-4/5 left-1/5 animate-float-slow"></div>
    </div>
  );

  const HeroImage = () => (
    <div className="w-72 h-72 mb-8 relative animate-pulse-slow">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-full opacity-20"></div>
      <div className="absolute inset-1/4 bg-white/80 rotate-45 rounded-lg"></div>
      <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-cyan-400 rounded-full"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-400 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2"></div>
    </div>
  );

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="flex min-h-screen pt-20">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white/10 backdrop-blur-sm">
          <HeroImage />
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Chung tay vì cộng đồng</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Tham gia cùng chúng tôi để hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, đánh giá rủi ro và tư vấn chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center items-center p-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng ký</h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Tạo tài khoản mới để tham gia cộng đồng PreventionSupport.
              </p>

              <div className="max-h-96 overflow-y-auto pr-2">
                {/* Tên đăng nhập */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="Nhập tên đăng nhập (3-20 ký tự)"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.username 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-600 mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Họ và tên */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={handleFullNameChange}
                      placeholder="Nhập họ và tên đầy đủ"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.fullName 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Ngày sinh */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Ngày/tháng/năm sinh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.birthDate 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="text-xs text-red-600 mt-1">{errors.birthDate}</p>
                  )}
                </div>
                
                {/* Email */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Nhập địa chỉ email"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.email 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                
                {/* Số điện thoại */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Nhập số điện thoại (VD: 0901234567)"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.phone 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={address}
                      onChange={handleAddressChange}
                      placeholder="Nhập địa chỉ đầy đủ (số nhà, tên đường, quận/huyện, tỉnh/thành phố)"
                      rows={3}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 resize-none ${
                                 errors.address 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                  )}
                </div>
                
                {/* Mật khẩu */}
                <div className="mb-4 group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Tạo mật khẩu mạnh
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Tạo mật khẩu mạnh"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.password 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {password && passwordStrength && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength.score
                                ? passwordStrength.strength === 'weak'
                                  ? 'bg-red-500'
                                  : passwordStrength.strength === 'medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${
                          passwordStrength.strength === 'weak'
                            ? 'text-red-600'
                            : passwordStrength.strength === 'medium'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {passwordStrength.strength === 'weak' ? 'Yếu' : 
                           passwordStrength.strength === 'medium' ? 'Trung bình' : 'Mạnh'}
                        </span>
                        {passwordStrength.feedback.length > 0 && (
                          <span className="text-xs text-gray-500">
                            Cần: {passwordStrength.feedback.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Xác nhận mật khẩu */}
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.confirmPassword 
                                   ? 'border-red-500 focus:border-red-500' 
                                   : 'border-gray-200 focus:border-blue-500'
                               }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={handleAcceptTermsChange}
                    className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 ${
                      errors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
                      {' '}và{' '}
                      <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                      {' '}<span className="text-red-500">*</span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-xs text-red-600 mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={newsletter}
                    onChange={handleNewsletterChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600 leading-relaxed">
                    Nhận thông tin cập nhật và tin tức từ PreventionSupport
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold
                           hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
                >
                  Tạo tài khoản
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <p className="text-center text-gray-600 text-sm mt-4">
                Đã có tài khoản?{' '}
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(270deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 4s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          
          .flex-1:first-child {
            min-height: 40vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
                