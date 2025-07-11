import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PropertyCard = ({ property }: { property: any }) => (
  <Card className="rounded-xl overflow-hidden hover:shadow-lg transition-all">
    <Link href={`/properties/${property.id}`} className="block">
      <div className="relative h-32 w-full">
        <Image
          src={property.image_urls[0]}
          alt={property.title}
          fill
          className="rounded-t-xl object-cover"
        />
      </div>
      <CardContent className="p-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{property.location}</p>
          <p className="text-primary font-semibold text-sm">
            <span>{property.currency}</span>&nbsp;
            {property.price}
          </p>
        </div>
        <div className="flex gap-4 mt-3 text-gray-700 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />{" "}
            <span>
              {property.area}
              &nbsp;
              {property.area_unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Link>
  </Card>
);

export default PropertyCard;
