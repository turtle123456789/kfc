import Image from "next/image";
export default function LayoutForm({ children }) {
  return (
    <div className="min-h-[100vh]">
      <div className="container m-auto flex">
            {/* <div className="w-[45%]">
            <Image
                className="h-[100vh] w-[auto]"
                src={
                "https://static.kfcvietnam.com.vn/images/web/signin/lg/signin.jpg?v=gOD8e3"
                }
                width={1000}
                height={1000}
                alt=""
            />
            </div> */}
        <div className="w-[100%] px-14">{children}</div>
      </div>
    </div>
  );
}
