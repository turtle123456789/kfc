import Header from "../header-admin";
import Head from "next/head";
import Footer from "../footer";

export default function Layout({ children }) {
  return (
    <>
      <main>
        <Head>
          <title>Welcome to KFC</title>
        </Head>
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
