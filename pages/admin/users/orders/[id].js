import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFilteredOrdersById } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

const UserOrders = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy ID người dùng từ URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 6))
  ); // Mặc định 7 ngày trước
  const [endDate, setEndDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5; // Số đơn hàng mỗi trang

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

  useEffect(() => {
    if (!id) return; // Nếu chưa có ID trong URL, không tiếp tục
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const userOrders = await getFilteredOrdersById("previous-order", start, end, id);
        setOrders(userOrders.flatMap((orderGroup) => orderGroup.items));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id, startDate, endDate]);

  return (
    <LayoutAdmin>
        <h2 className="text-4xl mt-10 font-bold text-center">Danh sách Đơn Hàng</h2>

        {/* Chọn thời gian */}
        <div className="flex flex-wrap items-center space-x-6 mb-6 p-4 bg-white shadow-lg rounded-lg ">
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white ml-auto">
                <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-6">
                    {/* Start Date Picker */}
                    <div className="relative w-full md:w-auto flex-shrink-0">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy/MM/dd"
                        className="w-full md:w-40 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    <span className="text-lg hidden md:inline">→</span>

                    {/* End Date Picker */}
                    <div className="relative w-full md:w-auto flex-shrink-0">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="yyyy/MM/dd"
                        className="w-full md:w-40 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>
            </div>
        </div>

        {/* Hiển thị bảng đơn hàng */}
        {loading ? (
          <div>Đang tải dữ liệu...</div>
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
                          {/* STT */}
                          <td className="px-4 py-2 border text-center text-xs sm:text-sm" rowSpan={order.list_item?.length || 1}>
                            {orderIndex + 1}
                          </td>

                          {/* Ngày đặt */}
                          <td className="px-4 py-2 border text-center text-xs sm:text-sm" rowSpan={order.list_item?.length || 1}>
                            {order.date}
                          </td>

                          {/* Tổng tiền */}
                          <td className="px-6 py-2 border text-right text-xs sm:text-sm hidden md:table-cell" rowSpan={order.list_item?.length || 1}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              minimumFractionDigits: 0,
                            }).format(order.amount)}
                          </td>

                          {/* Địa chỉ */}
                          <td className="px-6 py-2 border text-xs sm:text-sm hidden lg:table-cell" rowSpan={order.list_item?.length || 1}>
                            {order.address?.wards}, {order.address?.home}, {order.address?.district}, {order.address?.city}
                          </td>

                          {/* Chi tiết hàng đầu tiên */}
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

                        {/* Chi tiết các hàng còn lại */}
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
        <br />
      </LayoutAdmin>
  );
};

export default UserOrders;
