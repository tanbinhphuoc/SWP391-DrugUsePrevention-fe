import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { BarChart3, TrendingUp, Users, Download, Filter } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Giả lập API
const mockApi = {
  fetchReports: async () => ({
    overview: {
      title: "Báo cáo tổng quan hệ thống",
      metrics: [
        { label: "Tổng người dùng", value: "2,847", change: "+15.3%", trend: "up" },
        { label: "Khóa học hoàn thành", value: "1,234", change: "+8.7%", trend: "up" },
        { label: "Buổi tư vấn", value: "456", change: "+12.1%", trend: "up" },
        { label: "Tỷ lệ hài lòng", value: "94.2%", change: "+2.1%", trend: "up" }
      ]
    },
    users: {
      title: "Báo cáo người dùng",
      metrics: [
        { label: "Người dùng mới", value: "234", change: "+18.5%", trend: "up" },
        { label: "Người dùng hoạt động", value: "1,892", change: "+5.2%", trend: "up" },
        { label: "Tỷ lệ giữ chân", value: "87.3%", change: "+3.1%", trend: "up" },
        { label: "Thời gian sử dụng TB", value: "45 phút", change: "+7.8%", trend: "up" }
      ]
    },
    courses: {
      title: "Báo cáo khóa học",
      metrics: [
        { label: "Khóa học mới", value: "12", change: "+3", trend: "up" },
        { label: "Tỷ lệ hoàn thành", value: "78.5%", change: "+4.2%", trend: "up" },
        { label: "Đánh giá trung bình", value: "4.6/5", change: "+0.2", trend: "up" },
        { label: "Thời gian học TB", value: "3.2 giờ", change: "+0.5", trend: "up" }
      ]
    },
    consultations: {
      title: "Báo cáo tư vấn",
      metrics: [
        { label: "Buổi tư vấn mới", value: "89", change: "+15.2%", trend: "up" },
        { label: "Tỷ lệ hoàn thành", value: "92.1%", change: "+1.8%", trend: "up" },
        { label: "Đánh giá chất lượng", value: "4.8/5", change: "+0.1", trend: "up" },
        { label: "Thời gian chờ TB", value: "2.3 ngày", change: "-0.5", trend: "down" }
      ]
    },
    chartData: [
      { month: "T1", users: 1200, courses: 45, consultations: 89 },
      { month: "T2", users: 1450, courses: 52, consultations: 102 },
      { month: "T3", users: 1680, courses: 48, consultations: 95 },
      { month: "T4", users: 1920, courses: 61, consultations: 118 },
      { month: "T5", users: 2150, courses: 58, consultations: 134 },
      { month: "T6", users: 2380, courses: 67, consultations: 156 }
    ],
    topPerformers: [
      { name: "Khóa học Nhận thức về ma túy", metric: "1,234 học viên", performance: "98%" },
      { name: "TS. Nguyễn Minh Anh", metric: "156 buổi tư vấn", performance: "4.9/5" },
      { name: "Chương trình Tuyên truyền", metric: "2,500 người tham gia", performance: "95%" },
      { name: "Khảo sát ASSIST", metric: "892 lượt hoàn thành", performance: "92%" }
    ],
    recommendations: [
      "Tăng cường đào tạo cho consultant",
      "Phát triển thêm khóa học chuyên sâu",
      "Tối ưu hóa giao diện",
      "Mở rộng chương trình tuyên truyền"
    ]
  }),
  addRecommendation: async (data) => ({ id: Date.now(), ...data }),
};

const SystemReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [reportData, setReportData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    mockApi.fetchReports().then(data => setReportData(data));
  }, []);

  const currentReport = reportData[selectedReport] || { title: "", metrics: [] };
  const chartData = reportData.chartData || [];
  const topPerformers = reportData.topPerformers || [];
  const recommendations = reportData.recommendations || [];

  const handleExport = () => {
    toast.info("Đang xuất báo cáo... (Chưa triển khai)");
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    try {
      const newRec = await mockApi.addRecommendation({ text: recommendation });
      setReportData({ ...reportData, recommendations: [...recommendations, newRec.text] });
      setIsModalOpen(false);
      setRecommendation("");
      toast.success("Thêm đề xuất thành công!");
    } catch {
      toast.error("Thêm đề xuất thất bại!");
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Xu hướng theo thời gian" } },
  };

  const chartConfig = {
    labels: chartData.map(d => d.month),
    datasets: [
      { label: "Người dùng", data: chartData.map(d => d.users), backgroundColor: "rgba(139, 92, 246, 0.5)" },
      { label: "Khóa học", data: chartData.map(d => d.courses), backgroundColor: "rgba(34, 197, 94, 0.5)" },
      { label: "Tư vấn", data: chartData.map(d => d.consultations), backgroundColor: "rgba(59, 130, 246, 0.5)" },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Báo cáo tổng thể</h2>
        <div className="flex space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {Object.keys(reportData).filter(k => k !== "chartData" && k !== "topPerformers" && k !== "recommendations").map((key) => (
          <button
            key={key}
            onClick={() => setSelectedReport(key)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              selectedReport === key ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {reportData[key]?.title.split(' ')[1]}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentReport.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentReport.metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Xu hướng theo thời gian</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <Bar options={chartOptions} data={chartConfig} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hiệu suất cao nhất</h3>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{performer.name}</p>
                  <p className="text-sm text-gray-600">{performer.metric}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{performer.performance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân tích chi tiết</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">85.7%</div>
            <div className="text-sm text-gray-600">Tỷ lệ người dùng hoàn thành khóa học</div>
            <div className="text-xs text-green-600 mt-1">+3.2% so với tháng trước</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.6/5</div>
            <div className="text-sm text-gray-600">Đánh giá trung bình của người dùng</div>
            <div className="text-xs text-green-600 mt-1">+0.2 so với tháng trước</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">2.3 ngày</div>
            <div className="text-sm text-gray-600">Thời gian phản hồi trung bình</div>
            <div className="text-xs text-red-600 mt-1">+0.1 ngày so với tháng trước</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">Đề xuất cải tiến</h3>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thêm đề xuất</button>
        </div>
        <ul className="space-y-2 text-blue-700">
          {recommendations.map((rec, index) => (
            <li key={index}>• {rec}</li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm đề xuất cải tiến</h3>
            <form onSubmit={handleAddRecommendation}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nội dung đề xuất</label>
                <textarea
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SystemReports;
