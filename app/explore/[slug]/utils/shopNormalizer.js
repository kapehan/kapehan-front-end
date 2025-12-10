import { convertTo24Hour } from "./timeUtils.js";
import { createSlug } from "./slugUtils.js";

export const normalizeShop = (raw, slugFromRoute) => {
  if (!raw) return null;

  const paymentMethods = Array.isArray(raw.payment_methods)
    ? raw.payment_methods.map((p) => p?.type).filter(Boolean)
    : [];

  const openingHoursObj = Array.isArray(raw.openingHours)
    ? raw.openingHours.reduce((acc, cur) => {
        const day = (cur?.day || "").toLowerCase();
        const rawOpen = cur?.open ?? null;
        const rawClose = cur?.close ?? null;
        const isClosedFlag = Boolean(cur?.isClosed);
        const open24 = convertTo24Hour(rawOpen);
        const close24 = convertTo24Hour(rawClose);
        const closed =
          isClosedFlag ||
          !rawOpen ||
          !rawClose ||
          open24 === null ||
          close24 === null;

        acc[day] = {
          open: closed ? null : open24,
          close: closed ? null : close24,
          closed,
        };
        return acc;
      }, {})
    : raw.openingHours || undefined;

  const amenitiesArr = Array.isArray(raw.amenities)
    ? raw.amenities.map((a) => String(a).toLowerCase())
    : [];
  const normalizedAmenities = {
    wifi: amenitiesArr.includes("wi-fi") || amenitiesArr.includes("wifi"),
    parking: amenitiesArr.includes("parking"),
    outdoorSeating:
      amenitiesArr.includes("outdoor seating") || amenitiesArr.includes("outdoor"),
    petFriendly:
      amenitiesArr.includes("pet-friendly") || amenitiesArr.includes("pet friendly"),
    wheelchairAccessible:
      amenitiesArr.includes("wheelchair-accessible") ||
      amenitiesArr.includes("wheelchair accessible") ||
      amenitiesArr.includes("accessible"),
  };

  const idValue = raw.id || raw._id || createSlug(raw.name || "shop");
  const enhancedShop = {
    _id: idValue,
    id: idValue,
    name: raw.name,
    description: raw.description,
    image: raw.imageUrl || raw.image,
    address: raw.address,
    city: raw.city,
    rating: raw.rating,
    review_count: raw.review_count,
    categories: Array.isArray(raw.vibes) && raw.vibes.length ? raw.vibes : undefined,
    socialMedia: {
      facebook: raw.facebook || undefined,
      instagram: raw.instagram || undefined,
      twitter: raw.twitter || undefined,
    },
    paymentMethods: paymentMethods.length ? paymentMethods : ["Cash"],
    openingHours: openingHoursObj,
    amenities: normalizedAmenities,
    openNow: typeof raw.isOpen === "boolean" ? raw.isOpen : undefined,
  };

  const derivedSlug = createSlug(enhancedShop.name);
  if (derivedSlug !== createSlug(slugFromRoute)) {
    return { mismatch: true, shop: null };
  }
  return { mismatch: false, shop: enhancedShop };
};
