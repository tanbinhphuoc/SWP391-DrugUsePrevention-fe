"use client"

import { useState, useCallback, useEffect } from "react"
import { User, Lock, Eye, EyeOff, ArrowLeft, Shield, Sparkles, Users, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SignIn.css"

const demoAccounts = {
  demo_member: { role: "Member", roleId: 2 },
  demo_staff: { role: "Staff", roleId: 3 },
  demo_consult: { role: "Consultant", roleId: 4 },
  demo_manager: { role: "Manager", roleId: 5 },
  demo_admin: { role: "Admin", roleId: 6 },
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [useDemo, setUseDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const expiresAt = localStorage.getItem("expiresAt")
    const roleId = localStorage.getItem("roleId")
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      navigate(getRouteByRole(Number(roleId)), { replace: true })
    }
  }, [navigate])

  const handleEmailChange = useCallback(
    (e) => {
      setLoginEmail(e.target.value)
      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
    },
    [errors.email],
  )

  const handlePasswordChange = useCallback(
    (e) => {
      setLoginPassword(e.target.value)
      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
    },
    [errors.password],
  )

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const toggleDemoMode = () => {
    setUseDemo(!useDemo)
    setErrors({})
    setSuccessMessage("")
  }

  const getRouteByRole = (roleId) => {
    const routes = {
      1: "/",
      2: "/member-dashboard",
      3: "/staff-dashboard",
      4: "/consultant-dashboard",
      5: "/manager-dashboard",
      6: "/dashboard",
    }
    return routes[roleId] || "/"
  }

  const validateForm = () => {
    const newErrors = {}
    if (!loginEmail.trim()) newErrors.email = "Vui lòng nhập tài khoản"
    if (!loginPassword.trim()) newErrors.password = "Vui lòng nhập mật khẩu"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveUserData = ({ token, userName, email, expiresAt, roleId, roleName, userId }) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userName", userName)
    localStorage.setItem("email", email)
    localStorage.setItem("expiresAt", expiresAt)
    localStorage.setItem("roleId", String(roleId))
    localStorage.setItem("roleName", roleName)
    localStorage.setItem("userId", String(userId))
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrors((prev) => ({ ...prev, api: "Vui lòng kiểm tra lại thông tin!" }))
      return
    }

    setIsLoading(true)

    if (useDemo && demoAccounts[loginEmail] && loginPassword === "123456") {
      const demo = demoAccounts[loginEmail]
      const fakeData = {
        token: "demo-token",
        userName: loginEmail,
        email: `${loginEmail}@demo.com`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        roleId: demo.roleId,
        roleName: demo.role,
        userId: 999,
      }
      saveUserData(fakeData)
      setSuccessMessage(`Đăng nhập demo với quyền ${demo.role}!`)
      setTimeout(() => {
        setIsLoading(false)
        navigate(getRouteByRole(demo.roleId), { replace: true })
      }, 1200)
      return
    }

    try {
      const res = await axios.post("http://localhost:7092/api/Auth/login", {
        userName: loginEmail,
        password: loginPassword,
      })

      const { token, userName, email, expiresAt, role, userId } = res.data
      const roleMap = {
        Guest: 1,
        Member: 2,
        Staff: 3,
        Consultant: 4,
        Manager: 5,
        Admin: 6,
      }
      const roleId = roleMap[role] || 2

      saveUserData({ token, userName, email, expiresAt, roleId, roleName: role, userId })
      setSuccessMessage(`Đăng nhập thành công với quyền ${role}`)
      setTimeout(() => {
        setIsLoading(false)
        navigate(getRouteByRole(roleId), { replace: true })
      }, 1500)
    } catch (error) {
      setIsLoading(false)
      let message = "Đăng nhập thất bại."
      if (error.response?.data?.message) {
        message = error.response.data.message
      }
      setErrors((prev) => ({ ...prev, api: message }))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  const handleSelectDemo = (account) => {
    setLoginEmail(account)
    setLoginPassword("123456")
    setUseDemo(true)
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
        onClick={() => navigate("/")}
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
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div className="logo-badge">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Welcome Text */}
            <h1 className="welcome-title animate-fade-in">
              Chào mừng trở lại!
            </h1>
            <p className="welcome-description animate-fade-in">
              Đăng nhập để tiếp tục hành trình cùng cộng đồng PreventionSupport trong việc phòng chống ma túy.
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

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-container animate-fade-in">
              {/* Form Background Pattern */}
              <div className="form-background"></div>
              
              <div className="form-content">
                {/* Form Header */}
                <div className="form-header">
                  <h2 className="form-title">Đăng nhập</h2>
                  <p className="form-subtitle">Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>

                {/* Messages */}
                {successMessage && (
                  <div className="success-message">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}
                {errors.api && (
                  <div className="error-message">
                    <span>{errors.api}</span>
                  </div>
                )}

                {/* Username Field */}
                <div className="input-group">
                  <label className="input-label">Tên đăng nhập</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={handleEmailChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tên đăng nhập"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="input-error">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="input-group">
                  <label className="input-label">Mật khẩu</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={handlePasswordChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập mật khẩu"
                      className={`form-input ${errors.password ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="input-error">{errors.password}</p>}
                </div>

                {/* Demo Mode Toggle */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={useDemo}
                      onChange={toggleDemoMode}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Sử dụng tài khoản demo (bỏ qua API)</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                {/* Register Link */}
                <p className="register-link">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="register-button"
                  >
                    Tạo tài khoản
                  </button>
                </p>

                {/* Demo Accounts */}
                {useDemo && (
                  <div className="demo-section">
                    <div className="demo-container">
                      <h3 className="demo-header">
                        <div className="demo-badge">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        Tài khoản demo có sẵn:
                      </h3>
                      <div className="demo-accounts">
                        {Object.entries(demoAccounts).map(([username, info]) => (
                          <button
                            key={username}
                            onClick={() => handleSelectDemo(username)}
                            className="demo-account"
                          >
                            <div className="demo-account-content">
                              <div className="demo-account-info">
                                <span className="demo-username">{username}</span>
                                <span className="demo-password">/ 123456</span>
                              </div>
                              <span className="demo-role">{info.role}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn