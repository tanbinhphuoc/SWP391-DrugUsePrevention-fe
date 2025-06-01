import React, { useState, useCallback } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleEmailChange = useCallback((e) => {
    setLoginEmail(e.target.value);
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }, [errors.email]);

  const handlePasswordChange = useCallback((e) => {
    setLoginPassword(e.target.value);
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  }, [errors.password]);

  const handleRememberChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!loginEmail.trim()) {
      newErrors.email = 'Vui lòng nhập email hoặc tên đăng nhập';
    }
    
    if (!loginPassword.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        loginEmail,
        loginPassword,
        rememberMe
      };
      alert('Đăng nhập thành công! 🎉');
      console.log('Login data:', formData);
    }
  };

  const handleNavigateToRegister = () => {
    console.log('Navigate to register page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 relative overflow-hidden">
      <FloatingShapes />
      <BackToHomeButton />
      
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
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng nhập</h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
              </p>

              {/* Email Input */}
              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={handleEmailChange}
                    placeholder="Nhập email hoặc tên đăng nhập"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                             focus:outline-none focus:ring-3 transition-all duration-300 group-hover:-translate-y-1 text-gray-800
                             placeholder:text-gray-400 ${
                               errors.email 
                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                                 : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                             }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                             focus:outline-none focus:ring-3 transition-all duration-300 group-hover:-translate-y-1 text-gray-800
                             placeholder:text-gray-400 ${
                               errors.password 
                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                                 : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                             }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 
                             focus:outline-none focus:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={handleRememberChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:outline-none"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold
                         hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4
                         focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Đăng nhập
              </button>

              <div className="text-center mb-6">
                <button 
                  type="button"
                  className="text-blue-600 hover:underline text-sm focus:outline-none focus:underline"
                  onClick={() => console.log('Forgot password clicked')}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => console.log('Đăng nhập bằng Facebook')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg 
                           hover:bg-gray-50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-200">
                    <FacebookIcon />
                  </div>
                  <span className="text-gray-700 font-medium">Đăng nhập bằng Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log('Đăng nhập bằng Google')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg 
                           hover:bg-gray-50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    <GoogleIcon />
                  </div>
                  <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
                </button>
              </div>
              
              <p className="text-center text-gray-600 text-sm mt-6">
                Chưa có tài khoản?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:underline font-medium focus:outline-none focus:underline"
                >
                  Đăng ký ngay
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
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-100px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
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
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          
          .flex-1:first-child {
            min-height: 40vh;
          }
          
          .fixed.top-8.left-8 {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
          }
          
          .fixed.top-8.left-8 span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;