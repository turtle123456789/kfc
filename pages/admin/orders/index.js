import { useContext, useEffect, useState } from "react";
import { getData, getFilteredOrders } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import AuthContext from "@/feature/auth-context";
import { useRouter } from "next/router";

const Orders = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 6))); // Default to 7 days ago
  const [endDate, setEndDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const ordersPerPage = 5; // Orders per page

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleQuickSelect = (value) => {
    const today = new Date();
    switch (value) {
      case "today":
        setStartDate(new Date(today.setHours(0, 0, 0, 0)));
        setEndDate(new Date(today.setHours(23, 59, 59, 999)));
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setStartDate(new Date(yesterday.setHours(0, 0, 0, 0)));
        setEndDate(new Date(yesterday.setHours(23, 59, 59, 999)));
        break;
      case "7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        setStartDate(sevenDaysAgo);
        setEndDate(today);
        break;
      case "14days":
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);
        setStartDate(fourteenDaysAgo);
        setEndDate(today);
        break;
      case "30days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29);
        setStartDate(thirtyDaysAgo);
        setEndDate(today);
        break;
      case "thisWeek":
        const firstDayOfWeek = today.getDate() - today.getDay(); // First day of the week
        const lastDayOfWeek = firstDayOfWeek + 6; // Last day of the week
        const startOfWeek = new Date(today.setDate(firstDayOfWeek));
        const endOfWeek = new Date(today.setDate(lastDayOfWeek));
        setStartDate(startOfWeek);
        setEndDate(endOfWeek);
        break;
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        setStartDate(lastWeekStart);
        setEndDate(lastWeekEnd);
        break;
      case "thisMonth":
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
        break;
      case "lastMonth":
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(lastMonthStart);
        setEndDate(lastMonthEnd);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
        if (!userInfo) {
            setTimeout(() => {
              setLoadingUserInfo(false);
            }, 500); 
            return;
        }

        setLoadingUserInfo(false); 
        
        try {
            const user = await getData("users", userInfo.uid);
            if (user && user.role === "admin") {
                if (router.pathname !== "/admin/orders") {
                router.push("/admin/orders");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/admin");
        }
    };

    checkUserRole();

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const ordersData = await getFilteredOrders("previous-order", start, end);
        const ordersflat = ordersData.flatMap(orderGroup => orderGroup.items);
        setOrders(ordersflat);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [startDate, endDate]);

  if (loadingUserInfo) {
    return (
      <LayoutAdmin>
        <h2 className="text-4xl mt-10 font-bold text-center">Danh sách Đơn Hàng</h2>
        <div className="text-center mt-10">Đang tải dữ liệu...</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <h2 className="text-4xl mt-10 font-bold text-center">Danh sách Đơn Hàng</h2>

      {/* Time Range Selection */}
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

          {/* Date pickers */}
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

      {/* Orders Table */}
      {loading ? (
        <div className="text-center mt-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="mt-10 overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 border text-xs sm:text-sm" rowSpan={2}>STT</th>
                  <th className="px-4 py-2 border text-xs sm:text-sm" rowSpan={2}>Ngày Đặt</th>
                  <th className="px-6 py-2 border text-xs sm:text-sm hidden md:table-cell" rowSpan={2}>Tổng Tiền</th>
                  <th className="px-6 py-2 border text-xs sm:text-sm hidden lg:table-cell" rowSpan={2}>Địa chỉ</th>
                  <th className="px-8 py-2 border text-xs sm:text-sm" colSpan={4}>Chi Tiết</th>
                </tr>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="px-4 py-2 border text-xs sm:text-sm">Tên món</th>
                  <th className="px-4 py-2 border text-xs sm:text-sm">Số lượng</th>
                  <th className="px-4 py-2 border text-xs sm:text-sm">Đơn giá</th>
                  <th className="px-4 py-2 border text-xs sm:text-sm">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, orderIndex) => (
                  <React.Fragment key={orderIndex}>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border text-center text-xs sm:text-sm" rowSpan={order.list_item?.length || 1}>
                        {orderIndex + 1}
                      </td>
                      <td className="px-4 py-2 border text-center text-xs sm:text-sm" rowSpan={order.list_item?.length || 1}>
                        {order.date}
                      </td>
                      <td className="px-6 py-2 border text-right text-xs sm:text-sm hidden md:table-cell" rowSpan={order.list_item?.length || 1}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(order.amount)}
                      </td>
                      <td className="px-6 py-2 border text-xs sm:text-sm hidden lg:table-cell" rowSpan={order.list_item?.length || 1}>
                        {order.address?.wards}, {order.address?.home}, {order.address?.district}, {order.address?.city}
                      </td>

                      {order.list_item?.[0] && (
                        <>
                          <td className="px-4 py-2 border text-xs sm:text-sm">{order.list_item[0].description}</td>
                          <td className="px-4 py-2 border text-center text-xs sm:text-sm">{order.list_item[0].quantity}</td>
                          <td className="px-4 py-2 border text-right text-xs sm:text-sm">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              minimumFractionDigits: 0,
                            }).format(order.list_item[0].price)}
                          </td>
                          <td className="px-4 py-2 border text-right text-xs sm:text-sm">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              minimumFractionDigits: 0,
                            }).format(order.list_item[0].price * order.list_item[0].quantity)}
                          </td>
                        </>
                      )}
                    </tr>

                    {order.list_item?.slice(1).map((listItem, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-xs sm:text-sm">{listItem.description}</td>
                        <td className="px-4 py-2 border text-center text-xs sm:text-sm">{listItem.quantity}</td>
                        <td className="px-4 py-2 border text-right text-xs sm:text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                          }).format(listItem.price)}
                        </td>
                        <td className="px-4 py-2 border text-right text-xs sm:text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                          }).format(listItem.price * listItem.quantity)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">Không có đơn hàng nào trong khoảng thời gian này.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-5">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </LayoutAdmin>
  );
};

export default Orders;
