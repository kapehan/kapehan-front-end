"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaImage, FaTrash, FaStar } from "react-icons/fa";
import { LuSearch } from "react-icons/lu"; // add search icon
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import { createCoffeeShop } from "../../services/coffeeShopService";
import {
  getCities,
  getVibes,
  getAmenities,
  autoComplete,
} from "../../services/commonService";

export default function ListCoffeeShopPage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    city: "",
    description: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    latitude: "",
    longitude: "",
    amenities: [],
    atmosphere: "",
    establishedDate: "",
    paymentMethods: [],
    address: "",
    openingHours: {
      monday: { open: "07:00", close: "18:00", closed: false },
      tuesday: { open: "07:00", close: "18:00", closed: false },
      wednesday: { open: "07:00", close: "18:00", closed: false },
      thursday: { open: "07:00", close: "18:00", closed: false },
      friday: { open: "07:00", close: "18:00", closed: false },
      saturday: { open: "08:00", close: "20:00", closed: false },
      sunday: { open: "08:00", close: "20:00", closed: false },
    },
  });

  const [menuSections, setMenuSections] = useState({
    coffee: {
      items: [],
      isAdding: false,
      form: {
        name: "",
        price: "",
        hasSizes: false,
        sizes: [{ size: "", price: "" }],
        bestseller: false,
      },
    },
    nonCoffee: {
      items: [],
      isAdding: false,
      form: {
        name: "",
        price: "",
        hasSizes: false,
        sizes: [{ size: "", price: "" }],
        bestseller: false,
      },
    },
    pastry: {
      items: [],
      isAdding: false,
      form: {
        name: "",
        price: "",
        hasSizes: false,
        sizes: [],
        bestseller: false,
      },
    },
    riceMeals: {
      items: [],
      isAdding: false,
      form: {
        name: "",
        price: "",
        hasSizes: false,
        sizes: [],
        bestseller: false,
      },
    },
  });

  const [cities, setCities] = useState([]);
  const [vibes, setVibes] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const acTimerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesData = await getCities();
        const vibesData = await getVibes();
        const amenitiesData = await getAmenities();

        setCities(citiesData);
        setVibes(vibesData);
        setAmenitiesList(amenitiesData);
      } catch (error) {
        console.error("[v0] Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const paymentOptions = ["CASH", "QR PAYMENT", "CARD PAYMENT"];
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: { ...formData.openingHours[day], [field]: value },
      },
    });
  };

  const handlePaymentToggle = (method) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.includes(method)
        ? formData.paymentMethods.filter((m) => m !== method)
        : [...formData.paymentMethods, method],
    });
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter((a) => a !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };

  const handleMenuItemAdd = (category) => {
    const section = menuSections[category];
    const { name, price, hasSizes, sizes, bestseller } = section.form;

    if (!name.trim() || (!hasSizes && !price)) return;

    const newItem = {
      name,
      price: hasSizes ? null : Number.parseFloat(price),
      bestselling: bestseller,
      sizes: hasSizes ? sizes.filter((s) => s.price && s.size) : [],
    };

    setMenuSections({
      ...menuSections,
      [category]: {
        ...section,
        items: [...section.items, newItem],
        isAdding: false,
        form: {
          name: "",
          price: "",
          hasSizes: false,
          sizes: [{ size: "", price: "" }],
          bestseller: false,
        },
      },
    });
  };

  const handleMenuItemRemove = (category, index) => {
    setMenuSections({
      ...menuSections,
      [category]: {
        ...menuSections[category],
        items: menuSections[category].items.filter((_, i) => i !== index),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 5) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);

    // Structure your menu properly
    const menu = {
      coffee: menuSections.coffee.items,
      nonCoffee: menuSections.nonCoffee.items,
      pastry: menuSections.pastry.items,
      riceMeals: menuSections.riceMeals.items,
    };

    // Create FormData for multipart upload (since image is included)
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("file", formData.image);
    submitData.append("city", formData.city);
    submitData.append("description", formData.description);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("latitude", formData.latitude);
    submitData.append("longitude", formData.longitude);
    submitData.append("facebook", formData.facebook);
    submitData.append("instagram", formData.instagram);

    submitData.append("amenities", JSON.stringify(formData.amenities));
    submitData.append("vibes", JSON.stringify(formData.atmosphere));
    submitData.append("founded", formData.establishedDate);
    submitData.append("payment", JSON.stringify(formData.paymentMethods));
    submitData.append("address", formData.address);
    submitData.append("openingHours", JSON.stringify(formData.openingHours));
    submitData.append("menu", JSON.stringify(menu));

    // Log the FormData contents
    console.log("Submitting the following data:");
    for (const [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      await createCoffeeShop(submitData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setStep(1);
        setImagePreview(null);
        resetFormStates();
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("[v0] Submission error:", error);
      setIsLoading(false);
      alert("Error submitting listing. Please try again.");
    }
  };
  const resetFormStates = () => {
    setFormData({
      name: "",
      image: null,
      city: "",
      description: "",
      email: "",
      phone: "",
      facebook: "",
      instagram: "",
      latitude: "",
      longitude: "",
      amenities: [],
      atmosphere: "",
      establishedDate: "",
      paymentMethods: [],
      address: "",
      openingHours: {
        monday: { open: "07:00", close: "18:00", closed: false },
        tuesday: { open: "07:00", close: "18:00", closed: false },
        wednesday: { open: "07:00", close: "18:00", closed: false },
        thursday: { open: "07:00", close: "18:00", closed: false },
        friday: { open: "07:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "20:00", closed: false },
        sunday: { open: "08:00", close: "20:00", closed: false },
      },
    });

    setMenuSections({
      coffee: {
        items: [],
        isAdding: false,
        form: {
          name: "",
          price: "",
          hasSizes: false,
          sizes: [{ size: "", price: "" }],
          bestseller: false,
        },
      },
      nonCoffee: {
        items: [],
        isAdding: false,
        form: {
          name: "",
          price: "",
          hasSizes: false,
          sizes: [{ size: "", price: "" }],
          bestseller: false,
        },
      },
      pastry: {
        items: [],
        isAdding: false,
        form: {
          name: "",
          price: "",
          hasSizes: false,
          sizes: [],
          bestseller: false,
        },
      },
      riceMeals: {
        items: [],
        isAdding: false,
        form: {
          name: "",
          price: "",
          hasSizes: false,
          sizes: [],
          bestseller: false,
        },
      },
    });
  };

  const handleSizeChange = (category, idx, field, value) => {
    const sizes = ["Small", "Medium", "Large"];
    const newSizes = [...menuSections[category].form.sizes];
    newSizes[idx] = { ...newSizes[idx], [field]: value };
    setMenuSections({
      ...menuSections,
      [category]: {
        ...menuSections[category],
        form: { ...menuSections[category].form, sizes: newSizes },
      },
    });
  };

  const handleAddSize = (category) => {
    const sizes = ["Small", "Medium", "Large"];
    const currentCount = menuSections[category].form.sizes.length;
    if (currentCount < sizes.length) {
      setMenuSections({
        ...menuSections,
        [category]: {
          ...menuSections[category],
          form: {
            ...menuSections[category].form,
            sizes: [
              ...menuSections[category].form.sizes,
              { size: sizes[currentCount], price: "" },
            ],
          },
        },
      });
    }
  };

  const handleMenuFormChange = (category, updates) => {
    setMenuSections({
      ...menuSections,
      [category]: {
        ...menuSections[category],
        form: { ...menuSections[category].form, ...updates },
      },
    });
  };

  const handleToggleMenuForm = (category) => {
    setMenuSections({
      ...menuSections,
      [category]: {
        ...menuSections[category],
        isAdding: !menuSections[category].isAdding,
      },
    });
  };

  // Debounced autocomplete for address
  const handleAddressChange = (value) => {
    setFormData({ ...formData, address: value });
    if (acTimerRef.current) clearTimeout(acTimerRef.current);
    acTimerRef.current = setTimeout(async () => {
      if (!value || value.length < 2) {
        setAddressSuggestions([]);
        return;
      }
      try {
        const res = await autoComplete({ search: value });
        const raw = res?.data ?? res;
        const list =
          Array.isArray(raw) || Array.isArray(raw?.items)
            ? raw.items ?? raw
            : [];
        const normalized = list
          .map((s) => ({
            address: s.address ?? s.label ?? s.value ?? s.display_name,
            lat: Number(s.lat ?? s.latitude),
            lon: Number(s.lon ?? s.lng ?? s.longitude),
          }))
          .filter(
            (s) => s.address && Number.isFinite(s.lat) && Number.isFinite(s.lon)
          );
        setAddressSuggestions(normalized.slice(0, 5));
      } catch {
        setAddressSuggestions([]);
      }
    }, 400);
  };

  const handleAddressSuggestionSelect = (sugg) => {
    setFormData({
      ...formData,
      address: sugg.address,
      latitude: String(sugg.lat),
      longitude: String(sugg.lon),
    });
    setAddressSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {/* Header */}
          <HeaderSection />

          {/* Progress Steps */}
          <ProgressSteps step={step} />

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-stone-200 p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <Step1ShopInfo
                  formData={formData}
                  imagePreview={imagePreview}
                  handleInputChange={handleInputChange}
                  handleImageChange={handleImageChange}
                  cities={cities}
                  onAddressChange={handleAddressChange}
                  addressSuggestions={addressSuggestions}
                  onAddressSuggestionSelect={handleAddressSuggestionSelect}
                />
              )}
              {step === 2 && (
                <Step2ContactHours
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleHoursChange={handleHoursChange}
                  handlePaymentToggle={handlePaymentToggle}
                  paymentOptions={paymentOptions}
                  days={days}
                />
              )}
              {step === 3 && (
                <Step3Menu
                  menuSections={menuSections}
                  handleToggleMenuForm={handleToggleMenuForm}
                  handleMenuFormChange={handleMenuFormChange}
                  handleMenuItemAdd={handleMenuItemAdd}
                  handleMenuItemRemove={handleMenuItemRemove}
                  handleSizeChange={handleSizeChange}
                  handleAddSize={handleAddSize}
                />
              )}
              {step === 4 && (
                <Step4Amenities
                  formData={formData}
                  amenitiesList={amenitiesList}
                  vibes={vibes}
                  handleAmenityToggle={handleAmenityToggle}
                  setFormData={setFormData}
                />
              )}
              {step === 5 && (
                <Step5Review
                  formData={formData}
                  menuSections={menuSections}
                  imagePreview={imagePreview}
                  days={days}
                />
              )}

              {/* Navigation Buttons - Added loading state to submit button */}
              <div className="flex gap-3 pt-8 border-t border-stone-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg font-whyte-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-amber-700 text-white px-6 py-3 rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isLoading
                    ? "Submitting..."
                    : step === 5
                    ? "Submit Listing"
                    : "Next Step"}
                </button>
              </div>

              <p className="text-xs text-stone-500 text-center">
                We will contact you in 2-3 days once your listing has been
                approved.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <FaCheckCircle className="text-5xl text-emerald-600 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-whyte-bold text-stone-900 mb-2">
              Listing Submitted!
            </h2>
            <p className="text-stone-600 mb-6">
              Thank you! We will contact you in 2-3 days once your listing has
              been approved.
            </p>
            <p className="text-sm text-stone-500">
              Check your email for updates.
            </p>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

// Header Component
function HeaderSection() {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-whyte-bold text-stone-900 mb-4">
          List Your Coffee Shop
        </h1>
        <p className="text-lg text-stone-600">
          Share your coffee shop with our community. No account needed.
        </p>
      </motion.div>
    </div>
  );
}

// Progress Steps Component
function ProgressSteps({ step }) {
  const steps = [
    { num: 1, label: "Info" },
    { num: 2, label: "Hours" },
    { num: 3, label: "Menu" },
    { num: 4, label: "Details" },
    { num: 5, label: "Review" },
  ];

  return (
    <div className="flex justify-between mb-12">
      {steps.map((s) => (
        <div key={s.num} className="flex-1 flex flex-col items-center">
          <div
            className={`h-2 rounded-full transition-all duration-300 mb-2 ${
              s.num <= step ? "bg-amber-700" : "bg-stone-200"
            }`}
            style={{ width: "85%" }}
          />
          <p
            className={`text-xs md:text-sm text-center transition-colors ${
              s.num <= step ? "font-whyte-bold text-amber-700" : "text-stone-400"
            }`}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// Step 1: Shop Information
function Step1ShopInfo({
  formData,
  imagePreview,
  handleInputChange,
  handleImageChange,
  cities,
  onAddressChange,
  addressSuggestions,
  onAddressSuggestionSelect,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-4">
          Coffee Shop Image
        </label>
        <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-stone-600">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-3">
              <FaImage className="mx-auto text-4xl text-stone-300" />
              <p className="text-stone-700 font-whyte-medium">
                Upload your coffee shop image
              </p>
              <p className="text-sm text-stone-500">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-3">
          Coffee Shop Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Brew Haven Coffee"
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-whyte-bold text-stone-900 mb-3">
            City <span className="text-red-600">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="">Select city</option>
            {cities.map(({ city_name, city_value }) => (
              <option key={city_value} value={city_value}>
                {city_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-whyte-bold text-stone-900 mb-3">
            Established Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="establishedDate"
            value={formData.establishedDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-3">
          Address <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          {/* search icon */}
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Full address"
            className="w-full px-4 py-3 pl-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          {/* Suggestions under address input (first 5) */}
          {Array.isArray(addressSuggestions) &&
            addressSuggestions.length > 0 && (
              <div className="mt-2 bg-white border border-stone-200 rounded-lg shadow-sm">
                <ul className="divide-y divide-stone-200">
                  {addressSuggestions.map((s, idx) => (
                    <li key={`${s.address}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => onAddressSuggestionSelect(s)}
                        className="w-full text-left px-3 sm:px-4 py-2.5 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors"
                      >
                        <span className="block text-sm sm:text-base text-stone-800">
                          {s.address}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-3">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Tell us about your coffee shop..."
          rows="4"
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </motion.div>
  );
}

// Step 2: Contact & Hours
function Step2ContactHours({
  formData,
  handleInputChange,
  handleHoursChange,
  handlePaymentToggle,
  paymentOptions,
  days,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div>
        <h3 className="font-whyte-bold text-stone-900 mb-4 text-lg">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-whyte-bold text-stone-900 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-whyte-bold text-stone-900 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-whyte-bold text-stone-900 mb-2">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-whyte-bold text-stone-900 mb-2">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-whyte-bold text-stone-900 mb-4 text-lg">
          Opening Hours
        </h3>
        <div className="space-y-3">
          {days.map((day) => (
            <div
              key={day}
              className="flex items-center gap-3 bg-stone-50 p-4 rounded-lg"
            >
              <span className="w-20 text-sm font-whyte-medium text-stone-700 capitalize">
                {day}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={formData.openingHours[day].open}
                  onChange={(e) =>
                    handleHoursChange(day, "open", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
                <span className="text-stone-600 text-sm">to</span>
                <input
                  type="time"
                  value={formData.openingHours[day].close}
                  onChange={(e) =>
                    handleHoursChange(day, "close", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
                <label className="flex items-center gap-2 text-sm whitespace-nowrap ml-2">
                  <input
                    type="checkbox"
                    checked={formData.openingHours[day].closed}
                    onChange={(e) =>
                      handleHoursChange(day, "closed", e.target.checked)
                    }
                    className="rounded accent-amber-600"
                  />
                  <span className="text-stone-600">Closed</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-whyte-bold text-stone-900 mb-4 text-lg">
          Payment Methods Accepted
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {paymentOptions.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handlePaymentToggle(method)}
              className={`p-3 rounded-lg border-2 transition-all font-whyte-medium text-sm ${
                formData.paymentMethods.includes(method)
                  ? "bg-amber-50 border-amber-600 text-amber-700"
                  : "bg-stone-50 border-stone-300 text-stone-700 hover:border-stone-400"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Step 3: Menu - Completely redesigned menu section with better UX
function Step3Menu({
  menuSections,
  handleToggleMenuForm,
  handleMenuFormChange,
  handleMenuItemAdd,
  handleMenuItemRemove,
  handleSizeChange,
  handleAddSize,
}) {
  const categories = [
    { key: "coffee", emoji: "☕", label: "Coffee", hasSizes: true },
    {
      key: "nonCoffee",
      emoji: "🥤",
      label: "Non-Coffee Drinks",
      hasSizes: true,
    },
    { key: "pastry", emoji: "🥐", label: "Pastries", hasSizes: false },
    { key: "riceMeals", emoji: "🍚", label: "Rice Meals", hasSizes: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {categories.map(({ key, emoji, label, hasSizes }) => (
        <MenuCategorySection
          key={key}
          category={key}
          emoji={emoji}
          title={label}
          section={menuSections[key]}
          hasSizes={hasSizes}
          onToggleForm={() => handleToggleMenuForm(key)}
          onFormChange={(updates) => handleMenuFormChange(key, updates)}
          onAdd={() => handleMenuItemAdd(key)}
          onRemove={(idx) => handleMenuItemRemove(key, idx)}
          onSizeChange={(idx, field, value) =>
            handleSizeChange(key, idx, field, value)
          }
          onAddSize={() => handleAddSize(key)}
        />
      ))}
    </motion.div>
  );
}

// Menu Category Component - Redesigned with cleaner card layout and better UX
function MenuCategorySection({
  category,
  emoji,
  title,
  section,
  hasSizes,
  onToggleForm,
  onFormChange,
  onAdd,
  onRemove,
  onSizeChange,
  onAddSize,
}) {
  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
        <h3 className="text-lg font-whyte-bold text-stone-900">
          {emoji} {title}
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          {section.items.length} items added
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Items Display */}
        {section.items.length > 0 && (
          <div className="space-y-2 pb-4 border-b border-stone-200">
            {section.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-amber-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-whyte-medium text-stone-900 text-sm">
                      {item.name}
                    </p>
                    {item.bestselling && (
                      <FaStar className="w-3 h-3 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {item.sizes && item.sizes.length > 0
                      ? item.sizes
                          .map((s) => `${s.size} ₱${s.price}`)
                          .join(" • ")
                      : `₱${item.price}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={onToggleForm}
          className={`w-full py-2 px-4 rounded-lg font-whyte-medium text-sm transition-all ${
            section.isAdding
              ? "bg-amber-100 text-amber-700 border border-amber-300"
              : "bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200"
          }`}
        >
          {section.isAdding ? "✕ Close Form" : "+ Add Item"}
        </button>

        {/* Form - Redesigned form with cleaner layout and better UX */}
        {section.isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-stone-200 space-y-4"
          >
            {/* Item Name */}
            <div>
              <label className="text-xs font-whyte-bold text-stone-700 mb-2 block">
                Item Name *
              </label>
              <input
                type="text"
                value={section.form.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="e.g., Cappuccino"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Size Toggle */}
            {hasSizes && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onFormChange({ hasSizes: false, sizes: [] })}
                  className={`py-2 px-3 rounded-lg text-xs font-whyte-bold transition-all ${
                    section.form.hasSizes
                      ? "bg-stone-100 text-stone-700 border border-stone-300"
                      : "bg-amber-600 text-white border border-amber-600"
                  }`}
                >
                  Single Price
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onFormChange({
                      hasSizes: true,
                      sizes: [{ size: "", price: "" }],
                    })
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-whyte-bold transition-all ${
                    section.form.hasSizes
                      ? "bg-amber-600 text-white border border-amber-600"
                      : "bg-stone-100 text-stone-700 border border-stone-300"
                  }`}
                >
                  Multiple Sizes
                </button>
              </div>
            )}

            {/* Single Price */}
            {!section.form.hasSizes && (
              <div>
                <label className="text-xs font-whyte-bold text-stone-700 mb-2 block">
                  Price (₱) *
                </label>
                <input
                  type="number"
                  value={section.form.price}
                  onChange={(e) => onFormChange({ price: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Multiple Sizes */}
            {section.form.hasSizes && (
              <div>
                <label className="text-xs font-whyte-bold text-stone-700 mb-2 block">
                  Sizes *
                </label>
                <div className="space-y-2">
                  {section.form.sizes.map((size, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) =>
                          onSizeChange(idx, "size", e.target.value)
                        }
                        placeholder="e.g., Small"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) =>
                          onSizeChange(idx, "price", e.target.value)
                        }
                        placeholder="₱"
                        step="0.01"
                        className="w-20 px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onAddSize}
                  className="text-amber-600 hover:text-amber-700 text-xs font-whyte-bold mt-2 py-1"
                >
                  + Add Another Size
                </button>
              </div>
            )}

            {/* Best Seller Checkbox */}
            <label className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={section.form.bestseller}
                onChange={(e) => onFormChange({ bestseller: e.target.checked })}
                className="rounded accent-amber-600"
              />
              <span className="text-xs font-whyte-medium text-stone-700">
                Mark as best seller ⭐
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onToggleForm}
                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-whyte-bold py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onAdd}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-whyte-bold py-2 rounded-lg text-sm transition-colors"
              >
                Add Item
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Step 4: Amenities & Atmosphere
function Step4Amenities({
  formData,
  amenitiesList,
  vibes,
  handleAmenityToggle,
  setFormData,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-4">
          Amenities (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {amenitiesList.length > 0 ? (
            amenitiesList.map(({ amenity_value, amenity_name }) => (
              <button
                key={amenity_value}
                type="button"
                onClick={() => handleAmenityToggle(amenity_value)}
                className={`p-4 rounded-lg border-2 transition-all text-sm font-whyte-medium ${
                  formData.amenities.includes(amenity_value)
                    ? "bg-amber-50 border-amber-600 text-amber-700"
                    : "bg-stone-50 border-stone-300 text-stone-700 hover:border-stone-400"
                }`}
              >
                {amenity_name}
              </button>
            ))
          ) : (
            <p className="text-stone-600">No amenities available</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-4">
          Vibes
        </label>
        <div className="grid grid-cols-2 gap-3">
          {vibes.length > 0 ? (
            vibes.map(({ vibe_value, vibe_name }) => (
              <button
                key={vibe_value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, atmosphere: vibe_value }) // Fix here
                }
                className={`p-4 rounded-lg border-2 transition-all text-sm font-whyte-medium ${
                  formData.atmosphere === vibe_value
                    ? "bg-amber-50 border-amber-600 text-amber-700"
                    : "bg-stone-50 border-stone-300 text-stone-700 hover:border-stone-400"
                }`}
              >
                {vibe_name}
              </button>
            ))
          ) : (
            <p className="text-stone-600">No vibes available</p>
          )}
        </div>
      </div>

      {/* Remove manual lat/lon inputs; show read-only preview of selected coords */}
      <div>
        <label className="block text-sm font-whyte-bold text-stone-900 mb-4">
          Location Coordinates
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.latitude || ""}
            readOnly
            placeholder="Latitude (auto-filled)"
            className="px-4 py-3 border border-stone-300 rounded-lg bg-stone-50 text-stone-700 cursor-not-allowed"
          />
          <input
            type="text"
            value={formData.longitude || ""}
            readOnly
            placeholder="Longitude (auto-filled)"
            className="px-4 py-3 border border-stone-300 rounded-lg bg-stone-50 text-stone-700 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-stone-500 mt-2">
          Coordinates are auto-filled when you pick an address suggestion.
        </p>
      </div>
    </motion.div>
  );
}

// Step 5: Review & Confirm
function Step5Review({ formData, menuSections, imagePreview, days }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        {/* Shop Information */}
        <ReviewSection title="Shop Information">
          {imagePreview && (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Shop preview"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}
          <ReviewRow label="Shop Name" value={formData.name} />
          <ReviewRow label="City" value={formData.city} />
          <ReviewRow
            label="Established Date"
            value={formData.establishedDate}
          />
          <ReviewRow label="Address" value={formData.address} />
          <div className="pt-3 border-t border-stone-200">
            <p className="text-xs font-whyte-bold text-stone-700 mb-1">
              Description
            </p>
            <p className="text-sm text-stone-600">
              {formData.description || "No description provided"}
            </p>
          </div>
        </ReviewSection>

        {/* Contact Information */}
        <ReviewSection title="Contact Information">
          <ReviewRow label="Email" value={formData.email} />
          <ReviewRow label="Phone" value={formData.phone || "Not provided"} />
          <ReviewRow
            label="Facebook"
            value={formData.facebook || "Not provided"}
          />
          <ReviewRow
            label="Instagram"
            value={formData.instagram || "Not provided"}
          />
        </ReviewSection>

        {/* Opening Hours */}
        <ReviewSection title="Opening Hours">
          {days.map((day) => (
            <ReviewRow
              key={day}
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              value={
                formData.openingHours[day].closed
                  ? "Closed"
                  : `${formData.openingHours[day].open} - ${formData.openingHours[day].close}`
              }
            />
          ))}
        </ReviewSection>

        {/* Payment Methods */}
        <ReviewSection title="Payment Methods">
          <div className="flex flex-wrap gap-2">
            {formData.paymentMethods.length > 0 ? (
              formData.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-whyte-medium"
                >
                  {method}
                </span>
              ))
            ) : (
              <span className="text-sm text-stone-600">
                No payment methods selected
              </span>
            )}
          </div>
        </ReviewSection>

        {/* Amenities & Atmosphere */}
        <div className="grid md:grid-cols-2 gap-4">
          <ReviewSection title="Amenities">
            <div className="space-y-1 text-sm">
              {formData.amenities.length > 0 ? (
                formData.amenities.map((amenity) => (
                  <p key={amenity} className="text-stone-700 capitalize">
                    {amenity.replace(/([A-Z])/g, " $1")}
                  </p>
                ))
              ) : (
                <p className="text-stone-600">No amenities selected</p>
              )}
            </div>
          </ReviewSection>

          <ReviewSection title="Atmosphere">
            <p className="text-stone-700 font-whyte-medium">
              {formData.atmosphere || "Not specified"}
            </p>
          </ReviewSection>
        </div>

        {/* Location Coordinates */}
        <ReviewSection title="Location Coordinates">
          <ReviewRow
            label="Latitude"
            value={formData.latitude || "Not provided"}
          />
          <ReviewRow
            label="Longitude"
            value={formData.longitude || "Not provided"}
          />
        </ReviewSection>

        {/* Menu Summary */}
        <ReviewSection title="Menu Items">
          <div className="space-y-3 text-sm">
            {["coffee", "nonCoffee", "pastry", "riceMeals"].map((category) => {
              const categoryLabel =
                category === "coffee"
                  ? "Coffee"
                  : category === "nonCoffee"
                  ? "Non-Coffee"
                  : category === "pastry"
                  ? "Pastries"
                  : "Rice Meals";
              const items = menuSections[category].items;

              return items.length > 0 ? (
                <div
                  key={category}
                  className="pb-3 border-b border-stone-200 last:border-b-0 last:pb-0"
                >
                  <p className="font-whyte-bold text-stone-800 mb-2">
                    {categoryLabel}
                  </p>
                  <div className="space-y-1 ml-2">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-stone-600 text-xs"
                      >
                        <span>{item.name}</span>
                        <span>
                          {item.sizes && item.sizes.length > 0
                            ? `${item.sizes
                                .map((s) => `₱${s.price}`)
                                .join(", ")}`
                            : `₱${item.price}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </ReviewSection>
      </div>

      <p className="text-sm text-stone-600 text-center">
        Everything looks good? Click submit to send your listing for approval!
      </p>
    </motion.div>
  );
}

// Review Section Component
function ReviewSection({ title, children }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
      <h3 className="font-whyte-bold text-stone-900 mb-4 text-lg">{title}</h3>
      {children}
    </div>
  );
}

// Review Row Component
function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between pb-3 border-b border-stone-100 last:border-b-0 last:pb-0">
      <span className="font-whyte-medium text-stone-700 text-sm">{label}</span>
      <span className="text-stone-600 text-sm">{value}</span>
    </div>
  );
}
