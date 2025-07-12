import SocialIcons from "./SocialIcons"
import Link from "next/link"
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-mona-bold text-[#5F4429] mb-4">Kapehan</h3>
            <p className="text-sm font-mona-medium text-gray-600 mb-4">
              We index the unique coffee shops in Metro Manila to help you find the best local spots for your caffeine
              fix.
            </p>
            <SocialIcons />
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-mona-bold text-[#5F4429] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Explore", path: "/explore" },
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-mona-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Popular Cities */}
          <div>
            <h3 className="text-lg font-mona-bold text-[#5F4429] mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              {["Makati", "BGC", "Quezon City", "Pasig", "Manila"].map((city) => (
                <li key={city}>
                  <Link
                    href={`/explore?city=${city}`}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-mona-medium"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-mona-bold text-[#5F4429] mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-600 mt-1 mr-2" />
                <span className="text-sm font-mona-medium text-gray-600">Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-amber-600 mr-2" />
                <a
                  href="mailto:hello@kapehan.com"
                  className="text-sm font-mona-medium text-gray-600 hover:text-amber-600 transition-colors"
                >
                  hello@kapehan.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-amber-600 mr-2" />
                <a
                  href="tel:+639123456789"
                  className="text-sm font-mona-medium text-gray-600 hover:text-amber-600 transition-colors"
                >
                  +63 912 345 6789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm font-mona-medium mb-4 md:mb-0">
              © {currentYear} Kapehan. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-amber-600 transition-colors text-sm font-mona-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
