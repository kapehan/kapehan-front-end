import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

const SocialIcons = () => {
  const socialLinks = [
    { icon: <FaFacebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <FaYoutube />, url: "https://youtube.com", label: "YouTube" },
  ]

  return (
    <div className="flex space-x-4 mt-4">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5F4429] text-white hover:bg-amber-600 transition-colors"
        >
          {social.icon}
        </a>
      ))}
    </div>
  )
}

export default SocialIcons
