import React, { useState } from 'react';
import { User, Mail, Phone, Lock, LockKeyhole, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Login data
    loginEmail: '',
    loginPassword: '',
    rememberMe: false,
    // Register data
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
  });

  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert('Đăng nhập thành công! 🎉');
    console.log('Login data:', {
      email: formData.loginEmail,
      password: formData.loginPassword,
      rememberMe: formData.rememberMe
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (!formData.acceptTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }
    
    alert('Đăng ký thành công! 🎉');
    console.log('Register data:', formData);
  };

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

  const InputField = ({ icon: Icon, label, type = "text", name, placeholder, required = false }) => (
    <div className="mb-6 group">
      <label className="block text-gray-700 font-medium text-sm mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm
                   focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10
                   transition-all duration-300 group-hover:-translate-y-1"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );

  const SocialButton = ({ icon, text, color }) => (
    <button className={`w-full p-3 border-2 border-gray-200 bg-white rounded-xl font-medium
                       hover:border-blue-500 hover:-translate-y-1 transition-all duration-300
                       flex items-center justify-center gap-3 mb-3`}>
      <span className={`text-xl ${color}`}>{icon}</span>
      {text}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 relative overflow-hidden">
      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Main Content */}
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
            {/* Login Form */}
            {activeForm === 'login' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng nhập</h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                  Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
                </p>

                <form onSubmit={handleLoginSubmit}>
                  <InputField
                    icon={User}
                    label="Email hoặc Tên đăng nhập"
                    name="loginEmail"
                    placeholder="Nhập email hoặc tên đăng nhập"
                    required
                  />
                  
                  <InputField
                    icon={Lock}
                    label="Mật khẩu"
                    type="password"
                    name="loginPassword"
                    placeholder="Nhập mật khẩu"
                    required
                  />

                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">Ghi nhớ đăng nhập</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold
                             hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
                  >
                    Đăng nhập
                  </button>
                </form>

                <div className="text-center mb-6">
                  <a href="#" className="text-blue-600 hover:underline text-sm">Quên mật khẩu?</a>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="space-y-3">
              <button
                onClick={() => console.log('Đăng nhập bằng Facebook')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="text-blue-600 group-hover:scale-110 transition-transform duration-200">
                  <FacebookIcon />
                </div>
                <span className="text-gray-700 font-medium">Đăng nhập bằng Facebook</span>
              </button>

              <button
                onClick={() => console.log('Đăng nhập bằng Google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <GoogleIcon />
                </div>
                <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
              </button>
            </div>
                
                <p className="text-center text-gray-600 text-sm mt-6">
                  Chưa có tài khoản?{' '}
                  <button onClick={() => setActiveForm('register')} className="text-blue-600 hover:underline font-medium">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            )}

            {/* Register Form */}
            {activeForm === 'register' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng ký</h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                  Tạo tài khoản mới để tham gia cộng đồng PreventionSupport.
                </p>

                <form onSubmit={handleRegisterSubmit} className="max-h-96 overflow-y-auto pr-2">
                  <InputField
                    icon={User}
                    label="Họ và tên"
                    name="fullName"
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                  
                  <InputField
                    icon={Mail}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                  
                  <InputField
                    icon={Phone}
                    label="Số điện thoại"
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                  
                  <InputField
                    icon={Lock}
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    placeholder="Tạo mật khẩu mạnh"
                    required
                  />
                  
                  <InputField
                    icon={LockKeyhole}
                    label="Xác nhận mật khẩu"
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />

                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="terms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
                      {' '}và{' '}
                      <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-600 leading-relaxed">
                      Nhận thông tin cập nhật và tin tức từ PreventionSupport
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold
                             hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
                  >
                    Tạo tài khoản
                  </button>
                </form>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <p className="text-center text-gray-600 text-sm mt-4">
                  Đã có tài khoản?{' '}
                  <button onClick={() => setActiveForm('login')} className="text-blue-600 hover:underline font-medium">
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            )}
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

export default LoginPage;