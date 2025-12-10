export const convertTo24Hour = (timeStr) => {
  if (!timeStr) return null;
  const time12 = String(timeStr).trim();
  const [time, period] = time12.split(" ");
  if (!time || !period) return null;
  const [hours, minutes] = time.split(":");
  let hours24 = parseInt(hours, 10);
  if (Number.isNaN(hours24)) return null;
  if (period?.toUpperCase() === "AM") {
    if (hours24 === 12) hours24 = 0;
  } else if (period?.toUpperCase() === "PM") {
    if (hours24 !== 12) hours24 += 12;
  }
  return `${String(hours24).padStart(2, "0")}:${String(minutes || "00")}`;
};

export const isCurrentlyOpen = (openingHours) => {
  if (!openingHours) return false;
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "lowercase" });
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
  const todayHours = openingHours[dayOfWeek];
  if (!todayHours || todayHours.closed) return false;
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};
