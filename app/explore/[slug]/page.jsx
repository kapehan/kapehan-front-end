import ExploreSlugClient from "./ExploreSlugClient";
import { normalizeShop } from "./utils/shopNormalizer";
import { getCoffeeShopById } from "../../../services/coffeeShopService";

const fetchShopBySlug = async (shopSlug) => {
  if (!shopSlug) return null;
  try {
    // Use centralized service instead of manual fetch
    const data = await getCoffeeShopById(shopSlug);
    return data?.data ?? data;
  } catch {
    return null;
  } 
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const shopSlug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug;
  const raw = await fetchShopBySlug(shopSlug);
  const normalized = raw ? normalizeShop(raw, shopSlug) : null;
  const shop =
    normalized && normalized.mismatch !== true && normalized.shop
      ? normalized.shop
      : null;

  if (!shop) {
    return {
      title: "Coffee Shop Not Found | Kapehan",
      description:
        "The coffee shop you are looking for doesn't exist or has been removed.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${shop.name} | Kapehan`;
  const description =
    shop.description ||
    `Explore ${shop.name}${shop.city ? ` in ${shop.city}` : ""} on Kapehan.`;
  const image = shop.image || "/placeholder.svg?height=1200&width=1600";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CoffeeShopDetailPage({ params }) {
  const resolvedParams = await params;
  const shopSlug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug;
  const raw = await fetchShopBySlug(shopSlug);
  const normalized = raw ? normalizeShop(raw, shopSlug) : null;
  const shop =
    normalized && normalized.mismatch !== true && normalized.shop
      ? normalized.shop
      : null;

  return <ExploreSlugClient shop={shop} shopSlug={shopSlug} />;
}
