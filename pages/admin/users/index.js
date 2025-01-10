import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getData, deleData } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";
import AuthContext from "@/feature/auth-context";

const Users = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    const checkUserRole = async () => {
      if (!userInfo) {
        setTimeout(() => {
          setLoadingUserInfo(false); // Sau thời gian chờ, dừng trạng thái loading
        }, 500); 
      }

      setLoadingUserInfo(false); // Ngừng trạng thái loading khi đã có `userInfo`
      
      try {
        const user = await getData("users", userInfo.uid);
        if (user && user.role === "admin") {
          if (router.pathname !== "/admin/users") {
            router.push("/admin/users");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/admin");
      }
    };

    checkUserRole();

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getData("users");
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortedUsers = () => {
    const sorted = [...users];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toLowerCase() || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers().slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const deleteUser = async (userId) => {
    const confirmed = confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
    if (!confirmed) return;

    try {
      await deleData("users", userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert("Tài khoản đã được xóa thành công.");
    } catch (error) {
      console.log("Error deleting user:", error);
      alert("Đã xảy ra lỗi khi xóa tài khoản.");
    }
  };

  const viewOrders = (userId) => {
    router.push(`/admin/users/orders/${userId}`);
  };

  return (
    <LayoutAdmin>
      <h2 className="text-2xl md:text-4xl mt-5 font-bold text-center">
        Danh sách Người Dùng
      </h2>

      {loading ? (
        <div className="text-center mt-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="mt-10">
          {currentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm md:text-base">
                    <th className="px-2 py-2 border">STT</th>
                    <th
                      className="px-2 py-2 border cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Tên {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-2 py-2 border cursor-pointer"
                      onClick={() => handleSort("account")}
                    >
                      Email {sortConfig.key === "account" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-2 py-2 border">Số Điện Thoại</th>
                    <th className="px-2 py-2 border">Vai Trò</th>
                    <th className="px-2 py-2 border">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 text-sm md:text-base">
                      <td className="px-2 py-2 border text-center">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-2 py-2 border">{user.name}</td>
                      <td className="px-2 py-2 border">
                        {user.account || "Không có email"}
                      </td>
                      <td className="px-2 py-2 border">
                        {user.phone || "Không có số điện thoại"}
                      </td>
                      <td className="px-2 py-2 border">{user.role || "Người dùng"}</td>
                      <td className="px-2 py-2 border text-center">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm mr-2"
                          onClick={() => viewOrders(user.id)}
                        >
                          Xem Đơn Hàng
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm md:text-base">
              Không có người dùng nào.
            </p>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center mt-5 gap-4">
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm md:text-base">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <br />
    </LayoutAdmin>
  );
};

export default Users;
