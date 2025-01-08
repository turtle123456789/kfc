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

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addData("products", { ...formData }); // Thêm sản phẩm vào database
      alert("Sản phẩm đã được thêm thành công!");
      router.push("/admin/products"); // Quay lại danh sách sản phẩm
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Thêm sản phẩm thất bại!");
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
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Thêm sản phẩm
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
    </LayoutAdmin>
  );
};

export default AddProduct;
