import { useState, useEffect } from "react";
import axios from "axios";
import SliderPanes from "@/components/slider";
import ListBody from "@/components/list-body";
import CardList from "@/components/card-list";
import CardFood from "@/components/card-food";

export default function Home() {
  const [listFood, setListFood] = useState(null);
  const [foods, setFoods] = useState(null);
  const [loading, setLoading] = useState(false);
  async function fecthData() {
    const res = await axios.get("/api/favourite");
    const data = await res.data;
    setListFood(data);
    setLoading(true);
  }
  async function fectFood() {
    const res = await axios.get("/api/product");
    const data = await res.data;
    setFoods(data);
  }
  useEffect(() => {
    fecthData();
    fectFood(); 
  }, []);
  return (
    <div className="min-h-screen">
      <SliderPanes />
      <div className="container m-auto mt-4 p-10">
        <h2 className="font-bold text-3xl tracking-[2px] oswald line-space mb-8">
          <span className="relative bg-white">DANH MỤC SẢN PHẨM</span>
        </h2>
        <ListBody>
          {loading &&
            listFood.map((item, index) => <CardList key={index} {...item} />)}
        </ListBody>
        <h2 className="font-bold text-3xl flex items-center tracking-[2px] oswald line-space my-8">
          <div className="w-[41px] h-[77px] icon-avatar"></div>
          <span className="relative pl-2 bg-white">
            CÓ THỂ BẠN SẼ THÍCH SẢN PHẨM NÀY
          </span>
        </h2>
        <ListBody>
          {foods &&
            foods.map((item, index) => {
              if (item.type === "2") {
                return <CardFood key={index} {...item} />;
              }
            })}
        </ListBody>
      </div>
    </div>
  );
}
