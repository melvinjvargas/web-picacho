import { getAllProductsServer } from "@/lib/data/products-server";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const products = await getAllProductsServer();
  return <HomeClient products={products} />;
}
