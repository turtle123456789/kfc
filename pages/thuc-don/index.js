import axios from "axios";
import { useEffect, useState } from "react";
import ListBody from "@/components/list-body";
import Loader from "@/components/loader";
import CardFood from "@/components/card-food";
import NavScroll from "@/components/nav-scroll";
import { useRouter } from "next/router";

export default function ThucDon() {
  const [products, setProducts] = useState(null);
  const [types, setTypes] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  async function fecthType() {
    try{
      const res = await axios.get("/api/favourite");
      const data = await res.data;
      setTypes(data);
    }catch{
      console.log("error");
    }

  }
  async function fecthData() {
    try{
      const res = await axios.get("/api/product");
      const data = await res.data;
      setProducts(data);
      setLoading(true);
    }catch{
      console.log("error");
    }

  }
  useEffect(() => {
    fecthData();
    fecthType();
  }, []);
  if (!loading) {
    return <Loader />;
  }
  return (
    <div cl assName="container m-auto">
      <NavScroll type={types} />
      {types &&
        types.map((item, index) => {
          return (
            <div key={index} className="container m-auto pt-20" id={item.path}>
              <h2 className="text-[28px] font-bold uppercase p-4">
                {item.name}
              </h2>
              <ListBody>
                {products.map(
                  (_item, _index) =>
                    _item.type === item.id && (
                      <CardFood key={_index} {..._item} />
                    )
                )}
              </ListBody>
            </div>
          );
        })}
    </div>
  );
}
