import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "@/components/loader";
import Image from "next/image";
import Counter from "@/components/counter";
import AuthContext from "@/feature/auth-context";

export default function Order() {
  const { userInfo, increment } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    try {
      const res = await axios.post("/api/item", { id, name: "products" });
      const data = await res.data;
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    const data = { ...product, id, quantity, uid: userInfo.uid };
    try {
      const res = await axios.post("/api/cart", data);
      const { result } = res.data;
      if (result === "success") {
        increment(quantity);
        router.push("/thuc-don");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col lg:flex-row items-center">
      {/* Product Image Section */}
      <div className="w-full lg:w-1/2 p-4 flex justify-center">
        <Image
          src={product.img}
          className="rounded-lg"
          width={500}
          height={500}
          alt={product.name || "Product Image"}
        />
      </div>

      {/* Product Details Section */}
      <div className="w-full lg:w-1/2 p-4">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-3xl font-bold uppercase mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <h3 className="text-xl font-semibold mb-2">Món của bạn:</h3>
          <ul className="text-gray-700 mb-6">
            <li>
              <strong>Món chính:</strong> {product.name}
            </li>
            <li>
              <strong>Mô tả:</strong> {product.description}
            </li>
          </ul>

          <div className="flex items-center justify-between">
            {/* Counter Component */}
            <Counter
              decrement={() => setQuantity(Math.max(1, quantity - 1))}
              increment={() => setQuantity(quantity + 1)}
              quantity={quantity}
              block={true}
            />

            {/* Add to Cart Button */}
            <button
              onClick={handleAddItem}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition"
            >
              Thêm vào giỏ {quantity * product.price}₫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
