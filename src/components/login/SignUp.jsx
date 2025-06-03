import { useState, useCallback } from "react";
import { User, Mail, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
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
  const navigate = useNavigate();

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
      alert("Vui lòng kiểm tra lại và nhập đầy đủ thông tin!");
      return;
    }

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
      const response = await axios.post("https://localhost:7092/api/Auth/register", registerData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        timeout: 10000,
        withCredentials: false,
      });

      alert("Đăng ký thành công! 🎉");
      console.log("Register response:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      
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

  const BackToHomeButton = () => (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="fixed top-8 left-8 z-50 group flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 animate-slide-in-left"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:rotate-[-5deg] transition-transform duration-300">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
      <span className="text-gray-700 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
        Quay lại trang chủ
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 relative overflow-hidden">
      <BackToHomeButton />
      <div className="flex min-h-screen pt-20">
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white/10 backdrop-blur-sm">
          <div className="w-72 h-72 mb-8 relative animate-pulse-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-full opacity-20"></div>
            <div className="absolute inset-1/4 bg-white/80 rotate-45 rounded-lg"></div>
            <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-cyan-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2"></div>
          </div>
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Chung tay vì cộng đồng</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Tham gia cùng chúng tôi để hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, đánh giá rủi ro
              và tư vấn chuyên nghiệp.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center p-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng ký</h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Tạo tài khoản mới để tham gia cộng đồng PreventionSupport.
              </p>

              {errors.api && <p className="text-red-500 text-center mb-4">{errors.api}</p>}

              <div className="max-h-96 overflow-y-auto pr-2">
                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="Nhập tên đăng nhập"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.username
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
                </div>

                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">Họ và tên</label>
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
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

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
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">Số điện thoại</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Nhập số điện thoại (VD: 0901234567)"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.phone
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">Ngày sinh</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.birthDate
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.birthDate && <p className="text-xs text-red-600 mt-1">{errors.birthDate}</p>}
                </div>

                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">Địa chỉ</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={handleAddressChange}
                      placeholder="Nhập địa chỉ"
                      className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.address
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>

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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Tạo mật khẩu mạnh"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.password
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
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
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}

                  {password && passwordStrength && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength.score
                                ? passwordStrength.strength === "weak"
                                  ? "bg-red-500"
                                  : passwordStrength.strength === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === "weak"
                              ? "text-red-600"
                              : passwordStrength.strength === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {passwordStrength.strength === "weak"
                            ? "Yếu"
                            : passwordStrength.strength === "medium"
                              ? "Trung bình"
                              : "Mạnh"}
                        </span>
                        {passwordStrength.feedback.length > 0 && (
                          <span className="text-xs text-gray-500">
                            Cần: {passwordStrength.feedback.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6 group">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Xác nhận mật khẩu"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.confirmPassword
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
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
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
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

              <p className="text-center text-gray-600 text-sm mt-4">
                Đã có tài khoản?{" "}
                <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline font-medium">
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;