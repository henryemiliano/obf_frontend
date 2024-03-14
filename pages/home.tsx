import Footer from "@/src/components/common/footer";
import SwrSpinner from "@/src/components/common/spinner";
import FavoriteCategory from "@/src/components/homeAuth/favoriteCategory";
import FeaturedCategory from "@/src/components/homeAuth/featuredCategory";

import FeaturedSection from "@/src/components/homeAuth/featuredSection";
import ListCategories from "@/src/components/homeAuth/listCatogories";
import NewestCategory from "@/src/components/homeAuth/newestCategory";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const HomeAuth = function () {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("onebitflix-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <SwrSpinner />;
  }

  return (
    <>
      <Head>
        <title>Onebitflix - Home</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <main>
        <FeaturedSection />
        <NewestCategory />
        <FavoriteCategory />
        <FeaturedCategory />
        <ListCategories />
        <Footer />
      </main>
    </>
  );
};

export default HomeAuth;
