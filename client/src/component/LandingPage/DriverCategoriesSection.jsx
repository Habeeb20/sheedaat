




































// // src/components/DriverCategories.jsx
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Car, Clock, Plane, Moon, Briefcase, Heart, Bus, Fuel, Calendar, PawPrint, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
// import Airport from "./../../assets/Edriver/Airport.jpg"
// import Exective from "./../../assets/Edriver/ex.jpg"
// import fulltime from "./../../assets/Edriver/full.jpg"
// import fulltimedriver from "./../../assets/Edriver/full-TimeDriver.jpg"
// import tanker from "./../../assets/Edriver/tanker.jpg"
// import parttime from "./../../assets/Edriver/parttime.jpg"
// import weekend from "./../../assets/Edriver/weekend.jpg"
// import short from "./../../assets/Edriver/short.jpg"


// const driverTypes = [

//   {
//     type: 'full-time',
//     title: 'Full-Time Driver',
//     description: 'Dedicated professional driver for daily commutes, office runs, and personal errands. Reliable, punctual, and always ready.',
//     icon: <Calendar className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5955?w=800&q=80',
//     gradient: 'from-blue-500 to-indigo-600',
//   },
//   {
//     type: 'part-time',
//     title: 'Part-Time Driver',
//     description: 'Flexible driver available for specific hours or days. Perfect for school runs, shopping trips, or occasional needs.',
//     icon: <Clock className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&q=80',
//     gradient: 'from-purple-500 to-pink-500',
//   },
//   {
//     type: 'weekend',
//     title: 'Weekend Driver',
//     description: 'Enjoy your weekends stress-free. Ideal for family outings, events, or weekend getaways with a trusted driver.',
//     icon: <Calendar className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
//     gradient: 'from-orange-500 to-red-500',
//   },
//   {
//     type: 'short-time',
//     title: 'Short-Time Driver',
//     description: 'Quick, on-demand rides for a few hours. Perfect for meetings, appointments, or short trips around town.',
//     icon: <Clock className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
//     gradient: 'from-teal-500 to-cyan-500',
//   },
//   {
//     type: 'airport-pickup',
//     title: 'Airport Transfer',
//     description: 'Punctual and comfortable airport pickups & drop-offs. Flight monitoring, meet & greet, and luggage assistance included.',
//     icon: <Plane className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
//     gradient: 'from-indigo-600 to-blue-600',
//   },
//   {
//     type: 'outstation-travel',
//     title: 'Outstation Travel',
//     description: 'Safe and comfortable long-distance travel. Experienced drivers for interstate journeys with overnight stays.',
//     icon: <MapPin className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
//     gradient: 'from-green-500 to-emerald-600',
//   },
//   {
//     type: 'night-out-designated',
//     title: 'Night Out Designated Driver',
//     description: 'Enjoy your night out responsibly. Professional designated driver to get you and your car home safely.',
//     icon: <Moon className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1519748771451-31e2f2c5cacd?w=800&q=80',
//     gradient: 'from-purple-600 to-indigo-700',
//   },
//   {
//     type: 'executive-chauffeur',
//     title: 'Executive Chauffeur',
//     description: 'Premium corporate chauffeur service. Discreet, professional drivers for executives and VIPs in luxury vehicles.',
//     icon: <Briefcase className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80',
//     gradient: 'from-gray-700 to-black',
//   },
//   {
//     type: 'family-child-friendly',
//     title: 'Family & Child-Friendly',
//     description: 'Safe drivers with child seats and family experience. Perfect for school runs and family outings.',
//     icon: <Heart className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1603584173870-7f483f2d2a9d?w=800&q=80',
//     gradient: 'from-pink-500 to-rose-500',
//   },
//   {
//     type: 'school-bus',
//     title: 'School Bus Driver',
//     description: 'Certified school bus drivers with clean records. Safe, punctual transport for students every day.',
//     icon: <Bus className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5955?w=800&q=80',
//     gradient: 'from-yellow-500 to-amber-600',
//   },
//   {
//     type: 'tanker-hazmat',
//     title: 'Tanker & Hazmat',
//     description: 'Specialized drivers certified for hazardous materials and tanker transport. Safety and compliance guaranteed.',
//     icon: <Fuel className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1622396636133-ba43f812bc35?w=800&q=80',
//     gradient: 'from-red-600 to-orange-600',
//   },
//   {
//     type: 'retained-monthly',
//     title: 'Retained Monthly Driver',
//     description: 'Long-term dedicated driver on monthly retainer. Cost-effective solution for regular driving needs.',
//     icon: <Calendar className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
//     gradient: 'from-emerald-500 to-green-600',
//   },
//   {
//     type: 'pet-friendly',
//     title: 'Pet-Friendly Driver',
//     description: 'Drivers who love animals. Safe and comfortable transport for you and your furry friends.',
//     icon: <PawPrint className="h-8 w-8" />,
//     image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
//     gradient: 'from-lime-500 to-green-500',
//   },
// ];

// const DriverCategories = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const cardsPerView = 2;

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + cardsPerView) % driverTypes.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => 
//       prev - cardsPerView < 0 
//         ? driverTypes.length - cardsPerView 
//         : prev - cardsPerView
//     );
//   };

//   const getVisibleCards = () => {
//     const cards = [];
//     for (let i = 0; i < driverTypes.length; i++) {
//       cards.push(driverTypes[(currentIndex + i) % driverTypes.length]);
//     }
//     return cards.slice(0, cardsPerView);
//   };

//   return (
//     <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-6">
//             Find the Perfect Driver for Your Needs
//           </h2>
//           <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
//             Choose from our specialized drivers — each trained and verified for their category
//           </p>
//         </motion.div>

//         {/* Carousel Container */}
//         <div className="relative">
//           <div className="overflow-hidden">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentIndex}
//                 initial={{ x: 300, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -300, opacity: 0 }}
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-10"
//               >
//                 {getVisibleCards().map((driver, index) => (
//                   <motion.div
//                     key={`${driver.type}-${index}`}
//                     whileHover={{ y: -12, scale: 1.03 }}
//                     className="group relative bg-white rounded-3xl shadow-xl overflow-hidden"
//                   >
//                     <div className="relative h-72 overflow-hidden">
//                       <img
//                         src={driver.image}
//                         alt={driver.title}
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
//                       <div className={`absolute top-6 left-6 p-4 rounded-2xl bg-gradient-to-br ${driver.gradient} text-white shadow-2xl`}>
//                         {driver.icon}
//                       </div>
//                     </div>

//                     <div className="p-8">
//                       <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                         {driver.title}
//                       </h3>
//                       <p className="text-gray-600 leading-relaxed mb-8">
//                         {driver.description}
//                       </p>

//                       <a
//                         href="/login"
//                         className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all transform hover:scale-105 bg-gradient-to-r ${driver.gradient}`}
//                       >
//                         Hire Now
//                         <ArrowRight className="h-5 w-5" />
//                       </a>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/80 backdrop-blur rounded-full shadow-xl hover:bg-white transition z-10"
//           >
//             <ArrowLeft className="h-8 w-8 text-gray-800" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/80 backdrop-blur rounded-full shadow-xl hover:bg-white transition z-10"
//           >
//             <ArrowRight className="h-8 w-8 text-gray-800" />
//           </button>

//           {/* Dots Indicator */}
//           <div className="flex justify-center gap-3 mt-12">
//             {Array(Math.ceil(driverTypes.length / cardsPerView)).fill(0).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentIndex(i * cardsPerView)}
//                 className={`w-4 h-4 rounded-full transition-all ${
//                   Math.floor(currentIndex / cardsPerView) === i
//                     ? 'bg-primary-600 w-12'
//                     : 'bg-gray-300 hover:bg-gray-400'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DriverCategories;


// src/components/DriverCategories.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import Airport from "../../assets/Airport.jpg"
import Exective from "../../assets/ex.jpg"
import short from "../../assets/short.jpg"
import tanker from "../../assets/tanker.jpg"
import parttime from "../../assets/parttime.jpg"
import weekend from "../../assets/weekend.jpg"
import fulltime from "../../assets/full.jpg"
import fulltimedriver from "../../assets/full-TimeDriver.jpg"
import { ChevronLeft, ChevronRight } from "lucide-react";
import {Link} from "react-router-dom"
const driverTypes = [
  {
    type: "full-time",
    title: "Full-Time Driver",
    description:
      "Dedicated professional driver for daily commutes, office runs, and personal errands.",
    image: fulltime,
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    type: "part-time",
    title: "Part-Time Driver",
    description:
      "Flexible driver available for specific hours or days. Perfect for occasional needs.",
    image: parttime,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    type: "weekend",
    title: "Weekend Driver",
    description:
      "Stress-free weekend rides for family outings, events, or short getaways.",
    image: weekend,
    gradient: "from-orange-500 to-red-600",
  },
  {
    type: "short-time",
    title: "Short-Time Driver",
    description:
      "Quick, on-demand rides for a few hours — ideal for meetings or errands.",
    image: short,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    type: "airport-pickup",
    title: "Airport Transfer",
    description:
      "Punctual airport pickups & drop-offs with flight monitoring and meet & greet.",
    image: Airport,
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    type: "executive-chauffeur",
    title: "Executive Chauffeur",
    description:
      "Premium corporate chauffeur service in luxury vehicles for VIPs and executives.",
    image: Exective,
    gradient: "from-gray-800 to-black",
  },
  {
    type: "tanker-hazmat",
    title: "Tanker & Hazmat",
    description:
      "Certified drivers for hazardous materials and tanker transport — safety first.",
    image: tanker,
    gradient: "from-red-600 to-orange-700",
  },
  // {
  //   type: "fulltimedriver",
  //   title: "Full-Time Professional",
  //   description:
  //     "Reliable long-term driver for consistent daily and weekly needs.",
  //   image: fulltimedriver,
  //   gradient: "from-emerald-600 to-green-700",
  // },
];

const DriverCategories = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const formatTitle = (text) =>
    text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight">
            Choose Your Perfect Driver
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized, verified drivers for every lifestyle and need
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows - visible always, styled beautifully */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-lg shadow-xl flex items-center justify-center text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-lg shadow-xl flex items-center justify-center text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 snap-x snap-mandatory"
          >
            {driverTypes.map((driver, index) => (
              <motion.div
                key={driver.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="
                  min-w-[85%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%] xl:min-w-[20%]
                  bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100
                  hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3
                  snap-center
                "
              >
                {/* Image Section */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={driver.image}
                    alt={driver.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Gradient Icon Badge */}
                  <div
                    className={`absolute top-4 left-4 p-3 md:p-4 rounded-2xl bg-gradient-to-br ${driver.gradient} text-white shadow-xl ring-2 ring-white/20`}
                  >
                    {/* <Car size={24} className="md:size-28" /> */}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                    {formatTitle(driver.type)}
                  </h3>

                  <p className="text-sm md:text-base text-gray-600 mb-6 line-clamp-3">
                    {driver.description}
                  </p>
<Link to='/login'>
 <button
                    onClick={() => navigate(`/login`)}
                    className={`
                      w-full py-3 md:py-4 rounded-2xl font-semibold text-white text-base md:text-lg
                      bg-gradient-to-r ${driver.gradient}
                      hover:shadow-xl hover:shadow-indigo-500/30
                      transition-all duration-300 active:scale-98
                    `}
                  >
                    Hire Now
                  </button>
</Link>
                 
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <p className="text-center text-sm text-gray-500 mt-6 md:hidden">
            Swipe left/right to explore all categories
          </p>
        </div>
      </div>
    </section>
  );
};

export default DriverCategories;