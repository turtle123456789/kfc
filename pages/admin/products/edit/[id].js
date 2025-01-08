import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getItem, updateData } from "@/feature/firebase/firebaseAuth";
import LayoutAdmin from "@/components/layout-body-admin";

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    img: "",
    type: "",
  });

  // Fetch product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const data = await getItem("products", id); // Lấy dữ liệu sản phẩm theo ID
          setProduct(data);
          console.log('data',data);
          setFormData({
            name: data.name || "",
            price: data.price || "",
            description: data.description || "",
            img: data.img || "",
            type: data.type || "",
          });
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateData("products", id, { ...formData }); // Cập nhật sản phẩm trong database
      alert("Sản phẩm đã được cập nhật!");
      router.push("/admin/products"); // Quay lại danh sách sản phẩm
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Cập nhật sản phẩm thất bại!");
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div>Đang tải dữ liệu...</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <h2 className="text-2xl md:text-4xl mt-5 font-bold text-center">
        Chỉnh sửa sản phẩm
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
            Lưu thay đổi
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

export default EditProduct;
