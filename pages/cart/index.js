import { useState, useEffect, useContext } from "react";
import AuthContext from "@/feature/auth-context";
import Loader from "@/components/loader";
import CardCart from "@/components/card-cart";
import EmptyCart from "@/components/empty-cart";
import axios from "axios";
import { formatMoney, getDate } from "@/utils";
import Link from "next/link";

export default function Cart() {
  const { userInfo } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalFood, setTotalFood] = useState(0);
  const deleteCart= async()=>{
    try {
      const res = await axios.put("")
    }catch{
      console.log("Error")
    }
  }
  const fecthData = async () => {
    let value = 0;
    const res = await axios.post("/api/item", {
      id: userInfo.uid,
      name: "cart",
    });
    console.log('res', res)
    const data = res.data;
    if (data) {
      setTotalFood(data.arrayCart.length);
      data.arrayCart.forEach((element) => {
        value += element.quantity * element.price;
      });
      console.log(value);
      setTotal(value);
      setCart(data.arrayCart);
    }
    setLoading(true);
  };
  const handleCounter = (data) => {
    if (!data.quantity) {
      setTotal(parseInt(total) + parseInt(data.price));
    } else {
      setTotal(parseInt(total) - parseInt(data.price * data.quantity));
      setTotalFood(totalFood - 1);
    }
  };
  useEffect(() => {
    if (userInfo) {
      fecthData();
    }
  }, [userInfo]);
  return (
    <div className="container m-auto ">
      <div className=" before:left-[17px] page-with-bar">
        <h2 className="oswald text-4xl py-4  block">Giỏ hàng của tôi</h2>
      </div>
      <div className="flex justify-between">
        {totalFood === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="w-[60%]">
              {cart.map((item) => {
                return (
                  <CardCart
                    callback={(value) => handleCounter(value)}
                    key={item.id}
                    {...item}
                  />
                );
              })}
            </div>
            <div className="w-[38%]">
              <div className="sticky top-[150px] my-4 box-shadow p-6 rounded-xl ">
                <h2 className="oswald text-3xl uppercase border-b pb-4 border-[#ccc]">
                  {totalFood} món
                </h2>
                <div className="my-2 flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{formatMoney(total)}</span>
                </div>
                <div className="my-2 flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{formatMoney(10000)}₫</span>
                </div>
                <div className="my-2 font-bold roboto flex justify-between border-b border-[#ccc] pb-4">
                  <span>Tổng thanh toán</span>
                  <span>{formatMoney(parseInt(total) + 10000)}₫</span>
                </div>
                <Link href="/checkout">
                  <div className="flex p-4 roboto mt-6 btn-shadow cursor-pointer bg-red-500 text-white rounded-full justify-between">
                    <span>Thanh toán</span>
                    <span>{formatMoney(parseInt(total) + 10000)}₫</span>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
