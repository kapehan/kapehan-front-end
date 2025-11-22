"use client"
import { useState } from "react"
import { FaUtensils } from "react-icons/fa"
import { LuCoffee, LuCupSoda } from "react-icons/lu"
import { MdOutlineRestaurantMenu } from "react-icons/md"

export default function MenuSection({ menu }) {
  const [activeTab, setActiveTab] = useState("coffee")

  if (!menu) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-[#5F4429] mb-6 flex items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
            <MdOutlineRestaurantMenu className="text-amber-600 text-xl" />
          </div>
          Our Menu
        </h2>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-8">
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "coffee"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("coffee")}
            >
              <div className="flex items-center">
                <LuCoffee className="mr-2" />
                Coffee
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "food"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("food")}
            >
              <div className="flex items-center">
                <FaUtensils className="mr-2" />
                Food
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "drinks"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("drinks")}
            >
              <div className="flex items-center">
                <LuCupSoda className="mr-2" />
                Other Drinks
              </div>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {menu[activeTab] &&
            menu[activeTab].map((item, index) => (
              <div
                key={index}
                className={`${
                  item.popular ? "bg-amber-50 border-amber-200" : "bg-white"
                } p-4 rounded-lg shadow-sm border`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    {item.popular && (
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Popular</span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{item.price}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
