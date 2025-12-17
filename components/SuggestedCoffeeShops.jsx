"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuCoffee } from "react-icons/lu";
import CoffeeShopCard from "./CoffeeShopCard";
import { getFeaturedCoffeeShops } from "../services/coffeeShopService";

export default function SuggestedCoffeeShops({
  title = "You Might Also Like",
  subtitle,
  city,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const resp = await getFeaturedCoffeeShops({
          limit: 3,
          sort: "rating:desc",
          ...(city ? { city } : {}),
        });
        const data = resp?.data ?? resp;
        const list =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.items) && data.items) ||
          (Array.isArray(data?.docs) && data.docs) ||
          (Array.isArray(resp?.items) && resp.items) ||
          [];
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (loading || items.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-8 md:mt-10 mb-6 md:mb-10">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-whyte-bold text-stone-900 mb-2 flex items-center justify-center">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-stone-100 flex items-center justify-center mr-3">
            <LuCoffee className="text-stone-700 text-lg md:text-xl" />
          </div>
          {title}
        </h2>
        {subtitle && (
          <p className="text-stone-600 text-sm md:text-base">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {items.map((shop, index) => (
          <motion.div
            key={shop.id || shop._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CoffeeShopCard shop={shop} showDistance={false} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
