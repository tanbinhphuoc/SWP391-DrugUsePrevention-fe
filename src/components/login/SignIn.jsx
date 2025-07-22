"use client"

import { useState, useCallback, useEffect } from "react"
import { User, Lock, Eye, EyeOff, ArrowLeft, Shield, Sparkles, Users, CheckCircle, Heart, BookOpen, HandHeart } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    // Kiểm tra token để tự động đăng nhập
    const token = localStorage.getItem("token")
    const expiresAt = localStorage.getItem("expiresAt")
    const roleId = localStorage.getItem("roleId")
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      navigate(getRouteByRole(Number(roleId)), { replace: true })
    }

    // Tự động điền thông tin nếu người dùng đã chọn Remember Me trước đó
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    const isRemembered = localStorage.getItem("rememberMe") === "true"
    if (isRemembered && rememberedEmail) {
      setLoginEmail(rememberedEmail)
      setRememberMe(true)
    }

    return () => clearTimeout(timer)
  }, [])

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
      2: "/",
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
    // Luôn lưu token vào localStorage để duy trì phiên đăng nhập
    localStorage.setItem("token", token)
    localStorage.setItem("userName", userName)
    localStorage.setItem("email", email)
    localStorage.setItem("expiresAt", expiresAt)
    localStorage.setItem("roleId", String(roleId))
    localStorage.setItem("roleName", roleName)
    localStorage.setItem("userId", String(userId))
    
    // Lưu thông tin Remember Me để tự động điền form lần sau
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", userName)
      localStorage.setItem("rememberMe", "true")
    } else {
      localStorage.removeItem("rememberedEmail")
      localStorage.removeItem("rememberMe")
    }
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
      const res = await fetch("http://localhost:7092/api/Auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: loginEmail,
          password: loginPassword,
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại')
      }

      const { token, userName, email, expiresAt, role, userId } = data
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
      if (error.message) {
        message = error.message
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 delay-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-teal-300/10 to-green-300/10 rounded-full blur-2xl animate-pulse transition-opacity duration-1000 delay-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '2s'}}></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate("/", { replace: true })}
        className={`absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white group transform ${isPageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
      >
        <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
        <span className="text-slate-600 group-hover:text-emerald-600 transition-colors text-sm font-medium">Quay lại trang chủ</span>
      </button>

      <div className="flex min-h-screen">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 relative overflow-hidden">
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
                  <Shield className="w-8 h-8 text-white" />
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
                  Hành trình<br />
                  <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                    khỏe mạnh!
                  </span>
                </h2>
                <p className="text-emerald-100 text-lg leading-relaxed">
                  Đăng nhập để tiếp tục hành trình phòng chống tệ nạn xã hội và xây dựng một tương lai tươi sáng, an toàn cho cộng đồng.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 mt-12">
                <div className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-700 delay-700 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HandHeart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Hỗ trợ phục hồi</h3>
                    <p className="text-emerald-100 text-sm">Đồng hành cùng những người cần giúp đỡ</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-700 delay-800 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Phòng chống hiệu quả</h3>
                    <p className="text-emerald-100 text-sm">Ngăn ngừa tệ nạn từ sớm và hiệu quả</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-700 delay-900 ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Giáo dục tuyên truyền</h3>
                    <p className="text-emerald-100 text-sm">Nâng cao nhận thức cộng đồng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className={`lg:hidden flex items-center justify-center gap-3 mb-8 transition-all duration-700 delay-200 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
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
            <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative overflow-hidden transition-all duration-700 delay-400 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Form Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Form Header */}
                <div className={`text-center mb-8 transition-all duration-700 delay-600 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Đăng nhập</h2>
                  <p className="text-slate-600">Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>

                {/* Messages */}
                {successMessage && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{successMessage}</span>
                  </div>
                )}
                {errors.api && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                    <span className="text-red-700 text-sm">{errors.api}</span>
                  </div>
                )}

                {/* Username Field */}
                <div className={`mb-6 transition-all duration-700 delay-700 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={handleEmailChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tên đăng nhập"
                      className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                        errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className={`mb-6 transition-all duration-700 delay-800 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={handlePasswordChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập mật khẩu"
                      className={`w-full pl-12 pr-12 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 ${
                        errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me */}
                <div className={`flex items-center justify-between mb-6 transition-all duration-700 delay-900 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 bg-white border-2 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                      Ghi nhớ tên đăng nhập
                    </span>
                  </label>
                  <button
                    onClick={toggleDemoMode}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {useDemo ? 'Tắt Demo' : 'Demo Mode'}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl delay-1000 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                {/* Register Link */}
                <p className={`text-center text-slate-600 mt-6 transition-all duration-700 delay-1100 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  Bạn chưa có tài khoản?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Tạo tài khoản
                  </button>
                </p>

                {/* Demo Accounts */}
                {useDemo && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Tài khoản demo có sẵn:</h3>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(demoAccounts).map(([username, info], index) => (
                        <button
                          key={username}
                          onClick={() => handleSelectDemo(username)}
                          className="w-full p-3 bg-white/70 hover:bg-white border border-emerald-200 rounded-lg transition-all duration-200 hover:shadow-md group animate-in slide-in-from-right-4"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <div className="font-medium text-slate-800 text-sm">{username}</div>
                              <div className="text-slate-500 text-xs">Mật khẩu: 123456</div>
                            </div>
                            <div className="text-xs bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-2 py-1 rounded-full">
                              {info.role}
                            </div>
                          </div>
                        </button>
                      ))}
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