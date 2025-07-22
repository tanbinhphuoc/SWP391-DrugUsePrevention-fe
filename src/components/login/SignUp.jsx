import { useState, useCallback, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, RefreshCw, ArrowLeft, Shield, Sparkles, Users, UserPlus, Phone, MapPin, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const checkPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 6) score++;
    else feedback.push("Ít nhất 6 ký tự");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Chữ hoa");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("Chữ thường");

    if (/\d/.test(password)) score++;
    else feedback.push("Số");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push("Ký tự đặc biệt");

    const strength = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";
    return { score, strength, feedback };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^(\+84|84|0)[0-9]{8,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateUsername = (username) => {
    return username.length <= 100;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (!validateUsername(username)) {
      newErrors.username = "Tên đăng nhập không được vượt quá 100 ký tự";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!validateEmail(email)) {
      newErrors.email = "Địa chỉ email không hợp lệ";
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    }

    if (fullName && fullName.length > 150) {
      newErrors.fullName = "Họ và tên không được vượt quá 150 ký tự";
    }

    if (address && address.length > 255) {
      newErrors.address = "Địa chỉ không được vượt quá 255 ký tự";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (password.length > 255) {
      newErrors.password = "Mật khẩu không được vượt quá 255 ký tự";
    } else {
      const passwordStrength = checkPasswordStrength(password);
      if (passwordStrength.strength === "weak") {
        newErrors.password = "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateStrongPassword = useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*(),.?\":{}|<>";

    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }, []);

  const passwordStrength = password ? checkPasswordStrength(password) : null;

  const handleUsernameChange = useCallback(
    (e) => {
      setUsername(e.target.value);
      if (errors.username) {
        setErrors((prev) => ({ ...prev, username: "" }));
      }
    },
    [errors.username]
  );

  const handleBirthDateChange = useCallback(
    (e) => {
      setBirthDate(e.target.value);
      if (errors.birthDate) {
        setErrors((prev) => ({ ...prev, birthDate: "" }));
      }
    },
    [errors.birthDate]
  );

  const handleAddressChange = useCallback(
    (e) => {
      setAddress(e.target.value);
      if (errors.address) {
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    },
    [errors.address]
  );

  const handleFullNameChange = useCallback(
    (e) => {
      setFullName(e.target.value);
      if (errors.fullName) {
        setErrors((prev) => ({ ...prev, fullName: "" }));
      }
    },
    [errors.fullName]
  );

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    },
    [errors.email]
  );

  const handlePhoneChange = useCallback(
    (e) => {
      setPhone(e.target.value);
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    },
    [errors.phone]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);
      if (errors.password) {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    },
    [errors.password]
  );

  const handleConfirmPasswordChange = useCallback(
    (e) => {
      setConfirmPassword(e.target.value);
      if (errors.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    },
    [errors.confirmPassword]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generateStrongPassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }, [generateStrongPassword, errors.password, errors.confirmPassword]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        api: "Vui lòng kiểm tra lại và nhập đầy đủ thông tin!"
      }));
      return;
    }

    setIsLoading(true);

    const registerData = {
      userName: username,
      password: password,
      email: email,
      fullName: fullName || null,
      dateOfBirth: birthDate ? new Date(birthDate).toISOString() : null,
      phone: phone || null,
      address: address || null,
    };

    try {
      const response = await axios.post("http://localhost:7092/api/Auth/register", registerData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        timeout: 10000,
        withCredentials: false,
      });

      setErrors((prev) => ({ ...prev, api: "", success: "Đăng ký thành công! 🎉" }));
      console.log("Register response:", response.data);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);

      let errorMessage = "Đăng ký thất bại. ";

      if (error.code === "ECONNABORTED") {
        errorMessage += "Yêu cầu đã hết thời gian chờ. Vui lòng thử lại!";
      } else if (!error.response) {
        errorMessage += "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại!";
      } else {
        errorMessage += error.response?.data?.message || "Vui lòng thử lại sau!";
      }

      setErrors((prev) => ({
        ...prev,
        api: errorMessage,
      }));
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 delay-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-teal-300/10 to-green-300/10 rounded-full blur-2xl animate-pulse transition-opacity duration-1000 delay-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '2s'}}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBackToHome}
        className={`absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white group transform ${isPageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
      >
        <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
        <span className="text-slate-600 group-hover:text-emerald-600 transition-colors text-sm font-medium">Quay lại trang chủ</span>
      </button>

      <div className="flex min-h-screen">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-2/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 relative overflow-hidden">
          {/* Animated Elements */}
          <div className="absolute inset-0">
            <div className={`absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce transition-all duration-700 delay-200 ${isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{animationDelay: '0s', animationDuration: '3s'}}></div>
            <div className={`absolute bottom-32 right-16 w-24 h-24 bg-teal-300/20 rounded-full blur-lg animate-bounce transition-all duration-700 delay-400 ${isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{animationDelay: '1s', animationDuration: '4s'}}></div>
            <div className={`absolute top-1/2 right-1/3 w-16 h-16 bg-emerald-300/30 rounded-full blur-md animate-bounce transition-all duration-700 delay-600 ${isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
            {/* Logo Section */}
            <div className={`flex items-center gap-4 mb-12 transition-all duration-700 delay-300 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">PreventionSupport</h1>
                <p className="text-emerald-100 text-sm">Hỗ trợ phòng chống tệ nạn xã hội</p>
              </div>
            </div>

            {/* Welcome Content */}
            <div className="space-y-6">
              <div className={`transition-all duration-700 delay-500 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                  Tham gia<br />
                  <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                    cộng đồng!
                  </span>
                </h2>
                <p className="text-emerald-100 text-lg leading-relaxed">
                  Tạo tài khoản để tham gia cộng đồng hỗ trợ phòng chống ma túy và xây dựng tương lai tốt đẹp cho xã hội.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 mt-12">
                <div className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-700 delay-700 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Cộng đồng hỗ trợ</h3>
                    <p className="text-emerald-100 text-sm">Kết nối với những người cùng chí hướng</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-700 delay-800 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">An toàn & bảo mật</h3>
                    <p className="text-emerald-100 text-sm">Thông tin được bảo vệ tuyệt đối</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-3/5 xl:w-3/5 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-lg">
            {/* Mobile Logo */}
            <div className={`lg:hidden flex items-center justify-center gap-3 mb-8 transition-all duration-700 delay-200 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">PreventionSupport</h1>
              </div>
            </div>

            {/* Form Card */}
            <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 lg:p-8 relative overflow-hidden transition-all duration-700 delay-400 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Form Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                {/* Form Header */}
                <div className={`text-center mb-6 transition-all duration-700 delay-600 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Tạo tài khoản</h2>
                  <p className="text-slate-600">Tham gia cộng đồng PreventionSupport ngay hôm nay</p>
                </div>

                {/* Messages */}
                {errors.success && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{errors.success}</span>
                  </div>
                )}
                {errors.api && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                    <span className="text-red-700 text-sm">{errors.api}</span>
                  </div>
                )}

                {/* Scrollable Form Fields */}
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4 custom-scrollbar">

                  {/* Username Field */}
                  <div className={`transition-all duration-700 delay-700 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Nhập tên đăng nhập"
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.username ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>

                  {/* Full Name Field */}
                  <div className={`transition-all duration-700 delay-750 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={handleFullNameChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email Field */}
                  <div className={`transition-all duration-700 delay-800 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Nhập địa chỉ email"
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field */}
                  <div className={`transition-all duration-700 delay-850 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Nhập số điện thoại (VD: 0901234567)"
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Birth Date Field */}
                  <div className={`transition-all duration-700 delay-900 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.birthDate ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                  </div>

                  {/* Address Field */}
                  <div className={`transition-all duration-700 delay-950 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                        placeholder="Nhập địa chỉ của bạn"
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.address ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  {/* Password Field */}
                  <div className={`transition-all duration-700 delay-1000 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative"> {/* Added relative to this div */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Tạo mật khẩu"
                        className={`w-full pl-12 pr-12 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {/* Generate Password Button - repositioned here */}
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="absolute top-1/2 right-12 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md"
                      >
                         <RefreshCw className="w-3 h-3" />
                         Tạo
                      </button>
                    </div>
                    {passwordStrength && (
                      <div className="mt-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${passwordStrength.strength === 'strong' ? 'text-green-600' : passwordStrength.strength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                            Mức độ mạnh:{" "}
                            {passwordStrength.strength === "strong" ? "Mạnh" : passwordStrength.strength === "medium" ? "Trung bình" : "Yếu"}
                          </span>
                        </div>
                        {passwordStrength.strength !== "strong" && passwordStrength.feedback.length > 0 && (
                          <p className="text-slate-500 mt-1">
                            Cần thêm: {passwordStrength.feedback.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className={`transition-all duration-700 delay-1050 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Xác nhận mật khẩu"
                        className={`w-full pl-12 pr-12 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Removed the old Generate Password Button div here */}

                </div> {/* End of scrollable area */}

                {/* Sign Up Button */}
                <div className={`mt-6 transition-all duration-700 delay-1200 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Đăng ký
                      </>
                    )}
                  </button>
                </div>

                {/* Login link */}
                <div className={`text-center mt-4 text-sm transition-all duration-700 delay-1300 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <p className="text-slate-600">
                    Đã có tài khoản?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
                    >
                      Đăng nhập tại đây
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;