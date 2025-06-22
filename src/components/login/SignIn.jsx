"use client"

import { useState, useCallback, useEffect } from "react"
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SignIn.css" // Ensure this file exists in the same directory

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
      setTimeout(() => navigate(getRouteByRole(demo.roleId), { replace: true }), 1200)
      return
    }

    try {
      const res = await axios.post("https://localhost:7092/api/Auth/login", {
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
      setTimeout(() => navigate(getRouteByRole(roleId), { replace: true }), 1500)
    } catch (error) {
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

  const BackToHomeButton = () => (
    <button className="back-to-home-button group animate-slide-in-left" onClick={() => navigate("/")}>
      <div className="icon-container">
        <ArrowLeft className="w-4 h-4 text-white" />
      </div>
      <span>Quay lại trang chủ</span>
    </button>
  )

  return (
    <div className="signin-container">
      <BackToHomeButton />
      <div className="flex min-h-screen pt-20">
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white/10 backdrop-blur-sm">
          <div className="decorative-element">
            <div className="circle"></div>
            <div className="square"></div>
            <div className="dot dot-top"></div>
            <div className="dot dot-left"></div>
            <div className="dot dot-right"></div>
            <div className="dot dot-bottom"></div>
          </div>
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Đăng nhập ngay</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Đăng nhập để tham gia cộng đồng PreventionSupport và cùng nhau hỗ trợ phòng chống ma túy.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center p-8">
          <div className="form-container">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng nhập</h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
              </p>

              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-center text-sm">
                  {successMessage}
                </div>
              )}
              {errors.api && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center text-sm">
                  {errors.api}
                </div>
              )}

              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">Tên đăng nhập</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-hover:text-cyan-500 transition-colors" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    placeholder="demo_admin, demo_member, ..."
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800
                               placeholder:text-gray-400 group-hover:shadow-md ${
                                 errors.email
                                   ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                   : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                               }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-hover:text-cyan-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="123456"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800
                               placeholder:text-gray-400 group-hover:shadow-md ${
                                 errors.password
                                   ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                   : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                               }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 
                               focus:outline-none focus:text-gray-600 transition-colors hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              <div className="mb-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="demo"
                  checked={useDemo}
                  onChange={toggleDemoMode}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 focus:outline-none"
                />
                <label htmlFor="demo" className="text-sm text-gray-600 cursor-pointer">
                  Sử dụng tài khoản demo (bỏ qua API)
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold
                           focus:outline-none focus:ring-4 focus:ring-cyan-500/20 mb-4 hover:shadow-lg transition-all duration-300
                           hover:scale-[1.02] hover:-translate-y-1"
              >
                Đăng nhập
              </button>
<p className="text-sm text-gray-600 text-center">
  Bạn chưa có tài khoản?{" "}
  <button
    onClick={() => navigate("/register")}
    className="text-cyan-600 hover:text-cyan-800 font-medium ml-1 underline underline-offset-2 transition-colors"
  >
    Tạo tài khoản
  </button>
</p>

              {useDemo && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">🧪</span>
                      Tài khoản demo có sẵn:
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(demoAccounts).map(([username, info]) => (
                        <button
                          key={username}
                          onClick={() => handleSelectDemo(username)}
                          className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-cyan-300 
                                   hover:bg-cyan-50 transition-all duration-200 group"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium text-cyan-600 group-hover:text-cyan-700">
                                {username}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">/ 123456</span>
                            </div>
                            <span className="text-xs bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-2 py-1 rounded-full">
                              {info.role}
                            </span>
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
  )
}

export default SignIn
