/** @type {import('next-sitemap').IConfig} */
const axios = require("axios");

module.exports = {
  siteUrl: "https://www.kapehan.ph",
  generateRobotsTxt: true,
  transform: async (config, url) => ({
    loc: url,
    changefreq: "daily",
    priority: url === "/" ? 1.0 : 0.8,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async (config) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/v1";

      // Fetch first 1000 coffee shops
      const res = await axios.get(`${apiUrl}/shops?limit=1000`);

      // Assuming your API returns { data: [ ... ] }
      const shops = (res.data?.data || []).map((shop) => ({
        loc: `/explore/${shop.slug}`,
        lastmod: new Date().toISOString(),
      }));

      console.log(
        "[next-sitemap] Coffee shop paths:",
        shops.map((s) => s.loc)
      );

      // Merge and return all paths
      return shops;
    } catch (err) {
      console.error("Error fetching paths for sitemap:", err);
      return [];
    }
  },
};
