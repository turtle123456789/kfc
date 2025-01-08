import EmptyCart from "@/components/empty-cart";
import Loader from "@/components/loader";
import UserBody from "@/components/user-body";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import PreviousOrderBody from "@/components/previous-order-body";

export default function PreviousOrders() {
  const { userInfo } = useContext(AuthContext);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  async function fetchData() {
    const res = await axios.post("/api/item", {
      name: "previous-order",
      id: userInfo.uid,
    });
    const data = await res.data;
    if (data) {
      setPreviousOrder(data.items);
      setTotal(data.items.length);
    }
    setLoading(true);
  }
  useEffect(() => {
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);
  if (!loading) {
    return <Loader />;
  }

  return (
    <UserBody>
      <div>
        <h2 className="oswald uppercase text-4xl my-4">các đơn hàng đã đặt</h2>

        {total === 0 || !previousOrder ? (
          <EmptyCart />
        ) : (
          <div className="p-4">
            {previousOrder.map((item) => (
              <PreviousOrderBody key={item.date} {...item} />
            ))}
          </div>
        )}
      </div>
    </UserBody>
  );
}
