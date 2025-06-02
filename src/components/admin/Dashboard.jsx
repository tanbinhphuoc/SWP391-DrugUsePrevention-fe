import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");

    if (localToken || sessionToken) {
      let userData;
      if (localToken) {
        userData = {
          userName: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          expiresAt: localStorage.getItem("expiresAt"),
        };
      } else {
        userData = {
          userName: sessionStorage.getItem("userName"),
          email: sessionStorage.getItem("email"),
          expiresAt: sessionStorage.getItem("expiresAt"),
        };
      }

      // Check if token has expired
      const currentTime = new Date();
      const expirationTime = new Date(userData.expiresAt);
      if (currentTime > expirationTime) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      setUserInfo(userData);
    } else {
      alert("Vui lòng đăng nhập để truy cập trang quản lý!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Quản lý tài khoản</h1>
      {userInfo ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>
            <strong>Tên người dùng:</strong> {userInfo.userName}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Hết hạn token:</strong>{" "}
            {new Date(userInfo.expiresAt).toLocaleString()}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
};

export default Dashboard;