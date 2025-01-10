import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getData, deleData } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";
import AuthContext from "@/feature/auth-context";

const Products = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // Thêm state cho ID sản phẩm đang xóa

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Số sản phẩm mỗi trang

  // State sắp xếp
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
          if (router.pathname !== "/admin/products") {
            router.push("/admin/products");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/admin");
      }
    };

    checkUserRole();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productData = await getData("products");
        // console.log("productData", productData);
        setProducts(productData);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loadingUserInfo) {
    return (
      <LayoutAdmin>
        <h2 className="text-2xl md:text-4xl mt-5 font-bold text-center">
          Danh sách Sản phẩm
        </h2>

        <div className="mt-5 text-right">
          <button
            onClick={() => router.push("/admin/products/add")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            + Thêm sản phẩm
          </button>
        </div>
        <div className="text-center mt-10">Đang tải dữ liệu...</div>
      </LayoutAdmin>
    );
  }

  // Hàm sắp xếp
  const sortedProducts = () => {
    const sorted = [...products];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
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

  // Tính toán dữ liệu hiện tại cho trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts().slice(indexOfFirstProduct, indexOfLastProduct);

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Chuyển trang
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
      if (confirm) {
        setLoadingId(id); // Đặt sản phẩm đang xóa vào state

        await deleData("products", id); // Gọi hàm deleData với ID sản phẩm

        alert("Xóa sản phẩm thành công!");
        setProducts((prev) => prev.filter((product) => product.id !== id)); // Cập nhật danh sách sản phẩm
      }
    } catch (error) {
      console.log("Lỗi khi xóa sản phẩm:", error);
      alert("Xóa sản phẩm thất bại!");
    } finally {
      setLoadingId(null); // Sau khi xóa xong, reset lại loadingId
    }
  };

  return (
    <LayoutAdmin>
      <h2 className="text-2xl md:text-4xl mt-5 font-bold text-center">
        Danh sách Sản phẩm
      </h2>

      <div className="mt-5 text-right">
        <button
          onClick={() => router.push("/admin/products/add")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="mt-10">
          {currentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm md:text-base">
                    <th className="px-2 py-2 border">STT</th>
                    <th
                      className="px-2 py-2 border cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Tên sản phẩm {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-2 py-2 border">Mô tả</th>
                    <th
                      className="px-2 py-2 border cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      Giá {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-2 py-2 border">Hình ảnh</th>
                    <th className="px-2 py-2 border">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 text-sm md:text-base ${loadingId === product.id ? 'bg-gray-100 opacity-50' : ''}`} // Thêm hiệu ứng mờ cho dòng đang xóa
                    >
                      <td className="px-2 py-2 border text-center">
                        {indexOfFirstProduct + index + 1}
                      </td>
                      <td className="px-2 py-2 border text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]">
                        {product.name}
                      </td>
                      <td className="px-2 py-2 border text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                        {product.description}
                      </td>
                      <td className="px-2 py-2 border">{product.price}₫</td>
                      <td className="px-2 py-2 border text-center">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded"
                        />
                      </td>
                      <td className="px-2 py-2 border text-center">
                        <button
                          onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                          disabled={loadingId === product.id} // Vô hiệu hóa nút xóa khi đang xóa
                        >
                          {loadingId === product.id ? "Đang xóa..." : "Xóa"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm md:text-base">
              Không có sản phẩm nào.
            </p>
          )}

          {/* Điều khiển phân trang */}
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

export default Products;
