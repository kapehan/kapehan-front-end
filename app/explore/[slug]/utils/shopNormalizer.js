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

  let amenitiesArr = [];
  if (Array.isArray(raw.amenities)) {
    amenitiesArr = raw.amenities.map((a) => (typeof a === 'string' ? a.trim() : a)).filter(Boolean);
  } else if (raw.amenities && typeof raw.amenities === 'object') {
    amenitiesArr = Object.keys(raw.amenities).filter((k) => raw.amenities[k]);
  }
  const amenitiesArrLower = amenitiesArr.map((a) => String(a).toLowerCase());
  const normalizedAmenities = {
    wifi: amenitiesArrLower.includes("wi-fi") || amenitiesArrLower.includes("wifi"),
    parking: amenitiesArrLower.includes("parking"),
    outdoorSeating:
      amenitiesArrLower.includes("outdoor seating") || amenitiesArrLower.includes("outdoor"),
    petFriendly:
      amenitiesArrLower.includes("pet-friendly") || amenitiesArrLower.includes("pet friendly"),
    wheelchairAccessible:
      amenitiesArrLower.includes("wheelchair-accessible") || amenitiesArrLower.includes("wheelchair accessible") || amenitiesArrLower.includes("accessible"),
    airConditioning:
      amenitiesArrLower.includes("air conditioning") || amenitiesArrLower.includes("airconditioning") || amenitiesArrLower.includes("aircon"),
    powerOutlets:
      amenitiesArrLower.includes("power outlets") || amenitiesArrLower.includes("power outlet") || amenitiesArrLower.includes("outlets") || amenitiesArrLower.includes("outlet"),
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
    categories:
      Array.isArray(raw.vibes) && raw.vibes.length ? raw.vibes : undefined,
    socialMedia: {
      facebook: raw.facebook || undefined,
      instagram: raw.instagram || undefined,
      twitter: raw.twitter || undefined,
    },
    paymentMethods: paymentMethods.length ? paymentMethods : ["Cash"],
    openingHours: openingHoursObj,
    amenities: normalizedAmenities,
    amenitiesArray: amenitiesArr,

    openNow: typeof raw.isOpen === "boolean" ? raw.isOpen : undefined,
  };

  // --- added: resolve numeric coordinates from common shapes ---
  const tryNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const coordCandidates = [
    [raw.latitude, raw.longitude],
    [raw.lat, raw.lng],
    [raw.lat, raw.longitude],
    [raw.latitude, raw.lng],
    [raw.location?.lat, raw.location?.lng],
    [raw.location?.latitude, raw.location?.longitude],
    // coords arrays [lng, lat] or [lat, lng]
    ...(Array.isArray(raw.location?.coordinates)
      ? [[raw.location.coordinates[1], raw.location.coordinates[0]], [raw.location.coordinates[0], raw.location.coordinates[1]]]
      : []),
    ...(Array.isArray(raw.coordinates)
      ? [[raw.coordinates[1], raw.coordinates[0]], [raw.coordinates[0], raw.coordinates[1]]]
      : []),
  ];

  for (const [latRaw, lngRaw] of coordCandidates) {
    const lat = tryNum(latRaw);
    const lng = tryNum(lngRaw);
    if (lat !== null && lng !== null) {
      enhancedShop.latitude = lat;
      enhancedShop.longitude = lng;
      enhancedShop.location = { latitude: lat, longitude: lng };
      break;
    }
  }
  // --- end added ---

  const derivedSlug = createSlug(enhancedShop.name);
  if (derivedSlug !== createSlug(slugFromRoute)) {
    return { mismatch: true, shop: null };
  }
  return { mismatch: false, shop: enhancedShop };
};
