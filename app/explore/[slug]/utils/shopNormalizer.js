import { convertTo24Hour } from "./timeUtils.js";
import { createSlug } from "./slugUtils.js";

export const normalizeShop = (raw, slugFromRoute) => {
  if (!raw) return null;

  const paymentMethods = Array.isArray(raw.payment_methods)
    ? raw.payment_methods.map((p) => p?.type).filter(Boolean)
    : [];

  // --- Robust opening hours normalization ---
  const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const DAY_ALIASES = {
    mon: "monday",
    monday: "monday",
    tue: "tuesday",
    tues: "tuesday",
    tuesday: "tuesday",
    wed: "wednesday",
    weds: "wednesday",
    wednesday: "wednesday",
    thu: "thursday",
    thur: "thursday",
    thurs: "thursday",
    thursday: "thursday",
    fri: "friday",
    friday: "friday",
    sat: "saturday",
    saturday: "saturday",
    sun: "sunday",
    sunday: "sunday",
  };

  let openingHoursObj = {};
  if (Array.isArray(raw.openingHours)) {
    const inputByDay = {};
    raw.openingHours.forEach((cur) => {
      let dayRaw = (cur?.day || "").toLowerCase().replace(/\s+/g, "");
      let dayNorm = DAY_ALIASES[dayRaw] || DAY_ALIASES[dayRaw.slice(0, 3)] || null;
      if (dayNorm && DAYS.includes(dayNorm)) inputByDay[dayNorm] = cur;
    });
    for (const day of DAYS) {
      const cur = inputByDay[day];
      if (cur) {
        const rawOpen = cur?.open ?? null;
        const rawClose = cur?.close ?? null;
        // Only treat as closed if isClosed is strictly true, not just truthy
        const isClosedFlag = cur?.isClosed === true;
        const open24 = convertTo24Hour(rawOpen);
        const close24 = convertTo24Hour(rawClose);
        // If isClosed is true, mark closed, otherwise only check for valid open/close times
        const closed = isClosedFlag || open24 === null || close24 === null;
        openingHoursObj[day] = {
          open: closed ? null : open24,
          close: closed ? null : close24,
          closed,
        };
      } else {
        openingHoursObj[day] = { open: null, close: null, closed: true };
      }
    }
  } else if (raw.openingHours && typeof raw.openingHours === "object") {
    // Accept both lower/upper case and abbreviations as keys
    for (const day of DAYS) {
      let cur =
        raw.openingHours[day] ||
        raw.openingHours[day.charAt(0).toUpperCase() + day.slice(1)] ||
        raw.openingHours[day.slice(0, 3)] ||
        raw.openingHours[day.slice(0, 1).toUpperCase() + day.slice(1, 3)];
      if (cur) {
        openingHoursObj[day] = {
          open: cur.open ?? null,
          close: cur.close ?? null,
          closed: typeof cur.closed === "boolean" ? cur.closed : false,
        };
      } else {
        openingHoursObj[day] = { open: null, close: null, closed: true };
      }
    }
  } else {
    for (const day of DAYS) {
      openingHoursObj[day] = { open: null, close: null, closed: true };
    }
  }
  // --- end robust opening hours normalization ---

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
