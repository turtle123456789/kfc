import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getItem, getData, getFilteredOrders } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin"; 
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import AuthContext from "@/feature/auth-context";
import { Line } from "react-chartjs-2"; 
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [reportData, setReportData] = useState({ totalOrders: 0, totalUsers: 0, totalAmount: 0 });
  const [loadingReports, setLoadingReports] = useState(true); 
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 6)));
  const [endDate, setEndDate] = useState(new Date());
  const [chartDataOrders, setChartDataOrders] = useState({ labels: [], dataOrders: [] });
  const [chartDataRevenue, setChartDataRevenue] = useState({ labels: [], dataRevenue: [] });
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("userInfo",userInfo);
      if (!userInfo) {
        setTimeout(() => {
          setLoadingUserInfo(false);
        }, 500); 
      }

      setLoadingUserInfo(false); 
      
      try {
          const user = await getData("users", userInfo.uid);
          console.log("user",user);
          if (user && user.role === "admin") {
              if (router.pathname !== "/admin/dashboard") {
              router.push("/admin/dashboard");
              }
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
          router.push("/admin");
      }
    };

    checkUserRole();

    const fetchReportData = async () => {
      setLoadingReports(true);
      setLoadingCharts(true);
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const ordersData = await getFilteredOrders("previous-order", start, end);
        const usersData = await getData("users");

        const totalAmount = ordersData.reduce((total, order) => {
          if (order.items?.length) {
            const orderTotal = order.items.reduce((sum, item) => sum + (item.amount || item.total || 0), 0);
            return total + orderTotal;
          }
          return total;
        }, 0);

        const totalItemsLength = ordersData.reduce((count, order) => count + (order.items?.length || 0), 0);

        setReportData({
          totalOrders: totalItemsLength,
          totalUsers: usersData.length,
          totalAmount,
        });

        const groupedByDateOrders = ordersData.reduce((acc, order) => {
          order.items.forEach(item => {
            const itemDate = new Date(item.date).toLocaleDateString();
            acc[itemDate] = (acc[itemDate] || 0) + 1;
          });
          return acc;
        }, {});

        const groupedByDateRevenue = ordersData.reduce((acc, order) => {
          order.items.forEach(item => {
            const itemDate = new Date(item.date).toLocaleDateString();
            acc[itemDate] = (acc[itemDate] || 0) + (item.amount || item.total || 0);
          });
          return acc;
        }, {});

        const labels = Object.keys(groupedByDateOrders).sort();
        setChartDataOrders({ labels, dataOrders: labels.map(label => groupedByDateOrders[label]) });
        setChartDataRevenue({ labels, dataRevenue: labels.map(label => groupedByDateRevenue[label]) });
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo:", error);
      } finally {
        setLoadingReports(false);
        setLoadingCharts(false);
      }
    };

    fetchReportData();
  }, [router, startDate, endDate]);

  const chartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Ngày" } },
      y: { title: { display: true, text: "Số lượng / Doanh thu" } },
    },
  };

  // Hàm để chọn khoảng thời gian nhanh
  const handleQuickSelect = (range) => {
    const today = new Date();
    switch (range) {
      case "today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setStartDate(sevenDaysAgo);
        setEndDate(today);
        break;
      case "14days":
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 14);
        setStartDate(fourteenDaysAgo);
        setEndDate(today);
        break;
      case "30days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setStartDate(thirtyDaysAgo);
        setEndDate(today);
        break;
      case "thisWeek":
        const firstDayOfWeek = today.getDate() - today.getDay();
        const lastDayOfWeek = firstDayOfWeek + 6;
        const startOfWeek = new Date(today.setDate(firstDayOfWeek));
        const endOfWeek = new Date(today.setDate(lastDayOfWeek));
        setStartDate(startOfWeek);
        setEndDate(endOfWeek);
        break;
      case "lastWeek":
        const firstDayOfLastWeek = today.getDate() - today.getDay() - 7;
        const lastDayOfLastWeek = firstDayOfLastWeek + 6;
        const startOfLastWeek = new Date(today.setDate(firstDayOfLastWeek));
        const endOfLastWeek = new Date(today.setDate(lastDayOfLastWeek));
        setStartDate(startOfLastWeek);
        setEndDate(endOfLastWeek);
        break;
      case "thisMonth":
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
        break;
      case "lastMonth":
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(firstDayOfLastMonth);
        setEndDate(lastDayOfLastMonth);
        break;
      default:
        break;
    }
  };

  if (loadingUserInfo) {
    return (
      <LayoutAdmin>
        <div className="text-center text-xl font-semibold">Đang tải dữ liệu...</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
  
      {/* Chọn thời gian */}
      <div className="flex flex-wrap items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-6 p-4 bg-white shadow-md rounded-lg">
        <div className="flex space-x-6 items-center">
          <select
            onChange={(e) => handleQuickSelect(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Chọn khoảng thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="7days">7 ngày trước</option>
            <option value="14days">14 ngày trước</option>
            <option value="30days">30 ngày trước</option>
            <option value="thisWeek">Tuần này</option>
            <option value="lastWeek">Tuần trước</option>
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
          </select>
  
          {/* Date picker hidden on small screens */}
          <div className="flex space-x-4 w-full sm:w-auto">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="p-2 border rounded w-full sm:w-auto hidden md:block"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="p-2 border rounded w-full sm:w-auto hidden md:block"
            />
          </div>
        </div>
      </div>
  
      {/* Báo cáo tổng hợp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 py-2 border rounded-lg bg-white shadow-md min-h-16">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <h3 className="text-sm md:text-base font-semibold">Tổng số đơn hàng</h3>
            <p className="text-lg md:text-xl font-bold mt-1 sm:mt-0">{reportData.totalOrders}</p>
          </div>
        </div>
        <div className="p-4 py-2 border rounded-lg bg-white shadow-md min-h-16">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <h3 className="text-sm md:text-base font-semibold">Tổng số người dùng</h3>
            <p className="text-lg md:text-xl font-bold mt-1 sm:mt-0">{reportData.totalUsers}</p>
          </div>
        </div>
        <div className="p-4 py-2 border rounded-lg bg-white shadow-md min-h-16">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <h3 className="text-sm md:text-base font-semibold">Tổng doanh thu</h3>
            <p className="text-lg md:text-xl font-bold mt-1 sm:mt-0">{reportData.totalAmount.toLocaleString()} VNĐ</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 py-2 border rounded-lg bg-white shadow-md">
          <h3 className="text-sm md:text-base font-semibold">Biểu đồ số lượng đơn hàng</h3>
          {loadingCharts ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Line data={{
              labels: chartDataOrders.labels,
              datasets: [{
                label: 'Số lượng đơn hàng',
                data: chartDataOrders.dataOrders,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
              }],
            }} options={chartOptions} />
          )}
        </div>

        <div className="p-4 py-2 border rounded-lg bg-white shadow-md">
          <h3 className="text-sm md:text-base font-semibold">Biểu đồ doanh thu</h3>
          {loadingCharts ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <Line data={{
              labels: chartDataRevenue.labels,
              datasets: [{
                label: 'Doanh thu',
                data: chartDataRevenue.dataRevenue,
                fill: false,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1,
              }],
            }} options={chartOptions} />
          )}
        </div>
      </div>


    </LayoutAdmin>
  );
  
};

export default AdminDashboard;
