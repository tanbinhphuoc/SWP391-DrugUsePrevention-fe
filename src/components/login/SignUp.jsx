import { useState, useCallback } from "react";
import { User, Mail, Lock, Eye, EyeOff, RefreshCw, ArrowLeft, Shield, Sparkles, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

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
      const response = await axios.post("http://localhost:7092/api/Auth/register", registerData, {
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

  const handleBackToHome = () => {
    setTimeout(() => {
      navigate("/")
    }, 300)
  }

  return (
    <div className="signin-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="bg-element-1"></div>
        <div className="bg-element-2"></div>
        <div className="bg-element-3"></div>
      </div>

      {/* Back to Home Button */}
      <button 
        onClick={handleBackToHome}
        className="back-to-home-button animate-slide-in-left"
      >
        <div className="icon-container">
          <ArrowLeft className="w-4 h-4 text-white" />
        </div>
        <span>Quay lại trang chủ</span>
      </button>

      <div className="main-container">
        {/* Left Side - Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            {/* Logo/Icon */}
            <div className="logo-container">
              <div className="logo-main animate-fade-in">
                <UserPlus className="w-12 h-12 text-white" />
              </div>
              <div className="logo-badge">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Welcome Text */}
            <h1 className="welcome-title animate-fade-in">
              Chung tay vì cộng đồng!
            </h1>
            <p className="welcome-description animate-fade-in">
              Tham gia cùng chúng tôi để hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, đánh giá rủi ro và tư vấn chuyên nghiệp.
            </p>

            {/* Feature Cards */}
            <div className="feature-cards">
              <div className="feature-card animate-fade-in">
                <Users className="w-8 h-8 text-cyan-500" />
                <h3>Cộng đồng</h3>
                <p>Kết nối với cộng đồng hỗ trợ</p>
              </div>
              <div className="feature-card animate-fade-in">
                <Shield className="w-8 h-8 text-blue-500" />
                <h3>An toàn</h3>
                <p>Môi trường an toàn và bảo mật</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-container animate-fade-in">
              {/* Form Background Pattern */}
              <div className="form-background"></div>
              
              <div className="form-content">
                {/* Form Header */}
                <div className="form-header">
                  <h2 className="form-title">Đăng ký</h2>
                  <p className="form-subtitle">Tạo tài khoản mới để tham gia cộng đồng PreventionSupport</p>
                </div>

                {/* Error Message */}
                {errors.api && (
                  <div className="error-message">
                    <span>{errors.api}</span>
                  </div>
                )}

                {/* Scrollable Form Fields */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                  
                  {/* Username Field */}
                  <div className="input-group">
                    <label className="input-label">
                      Tên đăng nhập <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Nhập tên đăng nhập"
                        className={`form-input ${errors.username ? 'error' : ''}`}
                      />
                    </div>
                    {errors.username && <p className="input-error">{errors.username}</p>}
                  </div>

                  {/* Full Name Field */}
                  <div className="input-group">
                    <label className="input-label">Họ và tên</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={fullName}
                        onChange={handleFullNameChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                      />
                    </div>
                    {errors.fullName && <p className="input-error">{errors.fullName}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="input-group">
                    <label className="input-label">
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Nhập địa chỉ email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="input-error">{errors.email}</p>}
                  </div>

                  {/* Phone Field */}
                  <div className="input-group">
                    <label className="input-label">Số điện thoại</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Nhập số điện thoại (VD: 0901234567)"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                      />
                    </div>
                    {errors.phone && <p className="input-error">{errors.phone}</p>}
                  </div>

                  {/* Birth Date Field */}
                  <div className="input-group">
                    <label className="input-label">Ngày sinh</label>
                    <div className="input-wrapper">
                      <input
                        type="date"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        className={`form-input ${errors.birthDate ? 'error' : ''}`}
                      />
                    </div>
                    {errors.birthDate && <p className="input-error">{errors.birthDate}</p>}
                  </div>

                  {/* Address Field */}
                  <div className="input-group">
                    <label className="input-label">Địa chỉ</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                        placeholder="Nhập địa chỉ"
                        className={`form-input ${errors.address ? 'error' : ''}`}
                      />
                    </div>
                    {errors.address && <p className="input-error">{errors.address}</p>}
                  </div>

                  {/* Password Field */}
                  <div className="input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="input-label" style={{ marginBottom: 0 }}>
                        Mật khẩu <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#06b6d4',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Tạo mật khẩu mạnh
                      </button>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Tạo mật khẩu mạnh"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="input-error">{errors.password}</p>}

                    {/* Password Strength Indicator */}
                    {password && passwordStrength && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              style={{
                                height: '4px',
                                flex: 1,
                                borderRadius: '2px',
                                backgroundColor: level <= passwordStrength.score
                                  ? passwordStrength.strength === "weak"
                                    ? "#ef4444"
                                    : passwordStrength.strength === "medium"
                                      ? "#eab308"
                                      : "#10b981"
                                  : "#e5e7eb"
                              }}
                            ></div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: passwordStrength.strength === "weak"
                                ? "#dc2626"
                                : passwordStrength.strength === "medium"
                                  ? "#d97706"
                                  : "#059669"
                            }}
                          >
                            {passwordStrength.strength === "weak"
                              ? "Yếu"
                              : passwordStrength.strength === "medium"
                                ? "Trung bình"
                                : "Mạnh"}
                          </span>
                          {passwordStrength.feedback.length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Cần: {passwordStrength.feedback.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="input-group">
                    <label className="input-label">
                      Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Xác nhận mật khẩu"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="input-error">{errors.confirmPassword}</p>}
                  </div>

                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="submit-button"
                  style={{ marginTop: '1rem' }}
                >
                  Tạo tài khoản
                </button>

                {/* Login Link */}
                <p className="register-link">
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="register-button"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;