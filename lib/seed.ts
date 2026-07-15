import { createClient } from "@supabase/supabase-js";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function seed() {
  console.log("Seeding categories...");
  const { error: catError } = await supabase.from("categories").upsert(
    categories.map((c) => ({ name: c.name, slug: c.slug })),
    { onConflict: "slug" },
  );
  if (catError) console.error("Categories error:", catError);
  else console.log(`  ${categories.length} categories upserted.`);

  console.log("Seeding products...");
  for (const p of products) {
    const { error } = await supabase.from("products").upsert(
      {
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        original_price: p.originalPrice || null,
        is_new: p.isNew || false,
        is_active: true,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors.map((c) => JSON.stringify(c)),
        design_description: p.design_description,
      },
      { onConflict: "slug" },
    );
    if (error) console.error(`  ${p.name} error:`, error.message);
    else console.log(`  ${p.name} upserted.`);
  }

  console.log("Seeding discounts...");
  const defaultDiscounts = [
    { code: "PICACHO10", percentage: 10, is_active: true },
    { code: "SENDERO20", percentage: 20, is_active: true },
    { code: "BIENVENIDO15", percentage: 15, is_active: true },
  ];
  const { error: discError } = await supabase.from("discounts").upsert(
    defaultDiscounts,
    { onConflict: "code" },
  );
  if (discError) console.error("Discounts error:", discError);
  else console.log(`  ${defaultDiscounts.length} discounts upserted.`);

  console.log("Seed complete.");
}

seed();
