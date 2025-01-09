import { useRouter } from "next/router";
import { useState } from "react";
import { addData } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";

const AddProduct = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    img: "",
    type: "",
  });
  const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi dữ liệu

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form với validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem tất cả các trường bắt buộc đã được điền chưa
    if (!formData.name || !formData.price || !formData.img || !formData.type) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }

    // Kiểm tra giá phải là một số hợp lệ
    if (isNaN(formData.price) || formData.price <= 0) {
      alert("Giá sản phẩm phải là một số hợp lệ và lớn hơn 0!");
      return;
    }

    setLoading(true); // Bắt đầu loading khi gửi form

    try {
      console.log("formData", formData);
      await addData("products", { ...formData }); // Thêm sản phẩm vào database
      alert("Sản phẩm đã được thêm thành công!");
      router.push("/admin/products"); // Quay lại danh sách sản phẩm
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Thêm sản phẩm thất bại!");
    } finally {
      setLoading(false); // Dừng loading khi hoàn thành
    }
  };

  return (
    <LayoutAdmin>
      <h2 className="text-2xl md:text-4xl mt-5 font-bold text-center">
        Thêm sản phẩm mới
      </h2>
      <form
        className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow-md rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">Ảnh sản phẩm (URL)</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">Loại</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            disabled={loading} // Vô hiệu hóa nút khi đang loading
          >
            {loading ? "Đang thêm..." : "Thêm sản phẩm"} {/* Hiển thị trạng thái khi submit */}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Hủy
          </button>
        </div>
      </form>

      {/* Spinner khi đang loading */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600" />
        </div>
      )}
    </LayoutAdmin>
  );
};

export default AddProduct;
