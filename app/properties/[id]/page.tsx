"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Square,
  Mail,
  Phone,
  Wifi,
  Snowflake,
  Car,
  Dumbbell,
  Tv,
  Coffee,
  PawPrint,
  ParkingCircle,
  Fan,
  Droplet,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  ArrowDownUp,
  Zap,
  Sofa,
  Warehouse,
  BrickWall,
  Fence,
  ZoomIn,
} from "lucide-react";
import Header from "@/components/header";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import ImageGalleryModal from "@/components/ImageGalleryModal";

const amenities = [
  { icon: Wifi, label: "Wi-Fi" },
  { icon: Snowflake, label: "Air Conditioning" },
  { icon: Car, label: "Free Parking" },
  { icon: Dumbbell, label: "Gym" },
  { icon: Tv, label: "TV" },
  { icon: Coffee, label: "Coffee Maker" },
  { icon: PawPrint, label: "Pet Friendly" },
  { icon: ParkingCircle, label: "Private Garage" },
  { icon: Fan, label: "Ceiling Fan" },
  { icon: Droplet, label: "Washer" },
  { icon: Droplet, label: "Dryer" },
  { icon: ShieldCheck, label: "Security System" },
];

interface PropertyAmenity {
  amenity_id: number | string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  phone_call?: string;
  phone_whatsapp?: string;
  title?: string;
  bio?: string;
  experience?: string;
  slug?: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_unit: string;
  image_urls: string[];
  region: string;
  description: string;
  property_amenities: PropertyAmenity[];
  agents?: Agent;
}

const amenitiesMap: Record<number, { name: string; icon: JSX.Element }> = {
  2: { name: "Pool", icon: <Droplet size={18} /> },
  3: { name: "Gym", icon: <Dumbbell size={18} /> },
  4: { name: "Parking", icon: <ParkingCircle size={18} /> },
  5: { name: "Security", icon: <ShieldCheck size={18} /> },
  6: { name: "Garden", icon: <Fence size={18} /> },
  7: { name: "Elevator", icon: <ArrowDownUp size={18} /> },
  8: { name: "Wifi", icon: <Wifi size={18} /> },
  9: { name: "Air Conditioning", icon: <Snowflake size={18} /> },
  10: { name: "Gated Community", icon: <BrickWall size={18} /> },
  11: { name: "Balcony", icon: <Warehouse size={18} /> },
  12: { name: "Furnished", icon: <Sofa size={18} /> },
  13: { name: "Pet Friendly", icon: <PawPrint size={18} /> },
  14: { name: "Backup Generator", icon: <Zap size={18} /> },
  15: { name: "Water Supply", icon: <Droplet size={18} /> },
  16: { name: "Laundry", icon: <Droplet size={18} /> },
};

export default function PropertyPage() {
  const { id } = useParams();
  const mapUrl = "https://maps.google.com/?cid=589853634268389156";
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProperty() {
      try {
        const res = await fetch(
          `https://dwello-backend-express.onrender.com/api/properties/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        console.log(data);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={property?.image_urls || []}
        initialIndex={selectedImageIndex}
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        propertyTitle={property?.title}
      />

      {/* Page Content */}
      <div className="max-w-screen-xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Image and Thumbnails */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden cursor-pointer relative" onClick={() => openImageModal(0)}>
            <Image
              src={property?.image_urls[0] || "/placeholder-image.webp"}
              alt="Main Property"
              width={1200}
              height={600}
              className="w-full object-cover aspect-video hover:opacity-95 transition-opacity"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
              <ZoomIn className="h-4 w-4" />
              Zoom
            </div>
          </div>

          {/* Thumbnails */}
          <motion.div
            className="flex gap-3 overflow-x-auto pb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {property?.image_urls.map((src, i) => (
              <motion.div
                key={i}
                className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow cursor-pointer relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => openImageModal(i)}
              >
                <img
                  src={src}
                  alt={`Thumb ${i + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Title & Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-semibold leading-snug">
                  {property?.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {property?.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">{property?.region}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-700 text-left">Price</p>
                <p className="text-3xl font-bold text-primary">
                  {property?.price ? formatCurrency(property.price, property.currency) : ''}
                </p>
              </div>
            </div>

            <div className="flex gap-12 text-gray-700">
              {[
                { label: "Bathroom", Icon: Bath, value: property?.bathrooms },
                { label: "Bedroom", Icon: Bed, value: property?.bedrooms },
                {
                  label: "Area Space",
                  Icon: Square,
                  value: `${property?.area} ${property?.area_unit}`,
                },
              ].map(({ label, Icon, value }, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Icon className="h-4 w-4" /> <span>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {property?.description}
                </p>
              </div>
              {/* <div>
                <h3 className="text-lg font-semibold">Home Details</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A corner sofa and a refrigerator are included in each room at Hyatt Place New York. A work desk along with coffee making facilities is also included.
                </p>
              </div> */}
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  {property?.property_amenities.map((pa) => {
                    const amenity = amenitiesMap[Number(pa.amenity_id)];
                    if (!amenity) return null;

                    return (
                      <div
                        key={pa.amenity_id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="h-4 w-4 text-gray-500">
                          {amenity.icon}
                        </span>
                        <span>{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Location
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Agent Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="rounded-full overflow-hidden w-16 h-16 relative">
                  <Image
                    src={property?.agents?.profile_picture || "/placeholder-avatar.avif"}
                    alt={property?.agents?.name || "Agent"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{property?.agents?.name || "Property Agent"}</h4>
                  <p className="text-sm text-gray-500">
                    {property?.agents?.title || "Real Estate Agent"}
                  </p>
                  {property?.agents?.slug && (
                    <Link href={`/agents/${property.agents.slug}`} className="text-blue-500 text-sm hover:underline">
                      View profile
                    </Link>
                  )}
                </div>
                {property?.agents?.experience && (
                  <div className="ml-auto text-sm text-gray-600">
                    <span>⭐</span> {property.agents.experience} years exp.
                  </div>
                )}
              </div>
              {property?.agents?.bio && (
                <p className="text-sm text-gray-600">
                  {property.agents.bio}
                </p>
              )}
              <div className="text-sm text-gray-700 space-y-1">
                {property?.agents?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{property.agents.email}</span>
                  </p>
                )}
                {property?.agents?.phone_call && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{property.agents.phone_call}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                {/* WhatsApp Button */}
                {property?.agents?.phone_whatsapp && (
                  <Button
                    asChild
                    className="flex-1 flex items-center justify-center gap-2 text-white hover:bg-green-600"
                  >
                    <a
                      href={`https://wa.me/${property.agents.phone_whatsapp}?text=Hello, I'm interested in the property: ${property?.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 32 32" fill="white" className="h-5 w-5">
                        <path
                          d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                      WhatsApp
                    </a>
                  </Button>
                )}
                {property?.agents?.phone_call && (
                  <Button
                    asChild
                    variant={"outline"}
                    className="flex-1 flex items-center justify-center gap-2 text-primary border-primary hover:bg-primary/10"
                  >
                    <a
                      href={`tel:${property.agents.phone_call}`}
                      className="w-full h-full flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  </Button>
                )}
              </div>
              {/* Social Sharing Buttons */}
              <div className="mt-6 text-center">
                {" "}
                {/* Added text-center class */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Share this Property
                </h3>
                <div className="flex justify-center gap-4">
                  {" "}
                  {/* Added justify-center to center the icons */}
                  <a
                    href="#"
                    aria-label="Share on Facebook"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    aria-label="Share on Twitter"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    aria-label="Share on Instagram"
                    className="text-gray-400 hover:text-pink-500"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  {/* <a href="#" aria-label="Share on WhatsApp" className="text-gray-400 hover:text-green-500">
                      <WhatsApp className="h-6 w-6" />
                    </a> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Properties */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Properties Nearby</h3>
            {[
              {
                imageUrl: "/nearby-1.avif",
                price: 1500000,
                currency: "USD",
                address: "100 West, 15th Street, San Francisco",
                bathrooms: 2,
                bedrooms: 2,
                area: "2500 ft²",
              },
              {
                imageUrl: "/nearby-2.avif",
                price: 1500000,
                currency: "USD",
                address: "100 West, 18th Street, San Francisco",
                bathrooms: 1,
                bedrooms: 2,
                area: "2500 ft²",
              },
              {
                imageUrl: "/nearby-3.avif",
                price: 1500000,
                currency: "USD",
                address: "Another Address, San Francisco",
                bathrooms: 2,
                bedrooms: 3,
                area: "3500 ft²",
              },
            ].map((property, i) => (
              <Card key={i} className="rounded-xl overflow-hidden">
                <div className="flex gap-4 items-center">
                  <div className="w-32 h-24 relative flex-shrink-0">
                    <Image
                      src={property.imageUrl}
                      alt={`Nearby Property ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="py-2 px-2 text-sm">
                    <p className="font-semibold">{formatCurrency(property.price, property.currency)}</p>
                    <p className="text-gray-500 text-xs mb-1">
                      {property.address}
                    </p>
                    <p className="text-xs flex items-center gap-2 text-gray-700">
                      <Bath className="h-4 w-4" /> {property.bathrooms}
                      <Bed className="h-4 w-4" /> {property.bedrooms}
                      <Square className="h-4 w-4" /> {property.area}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
