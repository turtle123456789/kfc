import "@/styles/globals.css";
import { AuthContextProvider } from "@/feature/auth-context";
import Layout from "@/components/layout";
import LayoutAdmin from "@/components/layout-admin";  // Import LayoutAdmin
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";  // Import useRouter from Next.js

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");  // Kiểm tra nếu là trang admin

  return (
    <AuthContextProvider>
      {isAdminPage ? (
        <LayoutAdmin>  {/* Sử dụng LayoutAdmin cho các trang admin */}
          <Component {...pageProps} />
        </LayoutAdmin>
      ) : (
        <Layout>  {/* Sử dụng Layout thông thường cho các trang khác */}
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthContextProvider>
  );
}
