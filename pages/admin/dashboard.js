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
  const [loading, setLoading] = useState(true);
  const [startDate] = useState(new Date(new Date().setDate(new Date().getDate() - 6)));
  const [endDate] = useState(new Date());
  const [chartDataOrders, setChartDataOrders] = useState({ labels: [], dataOrders: [] });
  const [chartDataRevenue, setChartDataRevenue] = useState({ labels: [], dataRevenue: [] });

  useEffect(() => {
    const checkUserRole = async () => {
      if (userInfo) {
        try {
          const user = await getItem("users", userInfo.uid);
          if (user?.role === "admin" && router.pathname !== "/admin/dashboard") {
            router.push("/admin/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else if (router.pathname !== "/admin") {
        router.push("/admin");
      }
    };

    checkUserRole();

    const fetchReportData = async () => {
      setLoading(true);
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
        setLoading(false);
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

  return (
    <LayoutAdmin>
      {/* Thời gian */}
      <div className="flex flex-wrap items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-6 p-4 bg-white shadow-md rounded-lg">
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white ml-auto">
          <div className="flex space-x-6 items-center">
            <span>
              {startDate.toLocaleDateString("en-CA")} {/* Hiển thị ngày bắt đầu */}
            </span>
            <span className="text-lg">→</span>
            <span>
              {endDate.toLocaleDateString("en-CA")} {/* Hiển thị ngày kết thúc */}
            </span>
          </div>
        </div>
      </div>


      {/* Báo cáo */}
      {loading ? (
        <div className="text-center text-xl font-semibold">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:bg-blue-50 transition-all cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-700">Tổng số đơn hàng</h3>
            <p className="text-3xl font-bold text-blue-600">{reportData.totalOrders}</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-blue-600">{reportData.totalAmount.toLocaleString()} VND</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:bg-blue-50 transition-all cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-700">Tổng số người dùng</h3>
            <p className="text-3xl font-bold text-blue-600">{reportData.totalUsers}</p>
          </div>
        </div>
      )}

      {/* Biểu đồ */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Biểu đồ số lượng đơn hàng</h3>
          <Line data={{ labels: chartDataOrders.labels, datasets: [{ label: "Đơn hàng", data: chartDataOrders.dataOrders, borderColor: "rgb(75, 192, 192)", backgroundColor: "rgba(75, 192, 192, 0.2)", fill: true }] }} options={chartOptions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h3>
          <Line data={{ labels: chartDataRevenue.labels, datasets: [{ label: "Doanh thu", data: chartDataRevenue.dataRevenue, borderColor: "rgb(255, 99, 132)", backgroundColor: "rgba(255, 99, 132, 0.2)", fill: true }] }} options={chartOptions} />
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminDashboard;
