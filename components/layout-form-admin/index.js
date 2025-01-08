import Image from "next/image";

export default function LayoutForm({ children }) {
  return (
    <div className="min-h-[100vh]">
      <div className="container m-auto flex flex-col lg:flex-row">
        {/* Image section - hidden on mobile and shown on larger screens */}
        <div className="w-full lg:w-[45%] hidden lg:block">
          <Image
            className="h-[auto] w-full"  // Ensure image is responsive
            src={
              "https://static.kfcvietnam.com.vn/images/web/signin/lg/signin.jpg?v=gOD8e3"
            }
            width={1000}
            height={1000}
            alt="Login image"
          />
        </div>
        
        {/* Content section */}
        <div className="w-full lg:w-[55%] px-6 sm:px-12 md:px-14 mt-8 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
