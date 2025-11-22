import { FaWifi, FaParking, FaLeaf, FaAccessibleIcon, FaBaby } from "react-icons/fa"
import { MdOutdoorGrill, MdPets, MdLocalDining } from "react-icons/md"
import { SiSocketdotio } from "react-icons/si"
import { LuCoffee } from "react-icons/lu"

export default function ShopAmenities({ amenities = {} }) {
  if (!amenities || Object.keys(amenities).filter((key) => amenities[key]).length === 0) {
    return <div className="text-gray-500">No amenities information available</div>
  }

  // Map of amenity keys to their display info
  const amenityMap = {
    wifi: { name: "WiFi", icon: FaWifi },
    parking: { name: "Parking", icon: FaParking },
    powerOutlets: { name: "Power Outlets", icon: SiSocketdotio },
    outdoorSeating: { name: "Outdoor Seating", icon: MdOutdoorGrill },
    petFriendly: { name: "Pet Friendly", icon: MdPets },
    accessible: { name: "Accessible", icon: FaAccessibleIcon },
    familyFriendly: { name: "Family Friendly", icon: FaBaby },
    veganOptions: { name: "Vegan Options", icon: FaLeaf },
    dineIn: { name: "Dine-In", icon: MdLocalDining },
    specialtyCoffee: { name: "Specialty Coffee", icon: LuCoffee },
  }

  // Filter only available amenities
  const availableAmenities = Object.keys(amenities)
    .filter((key) => amenities[key] && amenityMap[key])
    .map((key) => amenityMap[key])

  return (
    <div className="grid grid-cols-2 gap-2">
      {availableAmenities.map((amenity, index) => (
        <div key={index} className="flex items-center p-3 bg-green-50 text-green-800 rounded-lg h-12">
          <amenity.icon className="text-green-600 mr-2 flex-shrink-0" />
          <span className="font-medium text-sm truncate">{amenity.name}</span>
        </div>
      ))}
    </div>
  )
}
