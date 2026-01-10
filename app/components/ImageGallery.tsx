"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "./Icon";

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  propertyName: string;
}

export function ImageGallery({ images, propertyName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(images.map((img) => img.category)))];

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === filteredImages.length - 1 ? 0 : selectedIndex + 1);
  };

  const categoryLabels: Record<string, string> = {
    all: "All Photos",
    exterior: "Exterior",
    living: "Living Spaces",
    bedroom: "Bedrooms",
    kitchen: "Kitchen",
    bathroom: "Bathrooms",
    amenity: "Amenities",
    view: "Views",
  };

  return (
    <>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === category
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {categoryLabels[category] || category}
          </button>
        ))}
      </div>

      {/* Main Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredImages.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className={`relative cursor-pointer group overflow-hidden rounded-xl ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => openLightbox(index)}
          >
            <div className={`relative ${index === 0 ? "h-80" : "h-40"} w-full`}>
              <Image
                src={image.url}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-medium">{image.caption}</p>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon name="lucide:expand" size={14} className="text-slate-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => openLightbox(0)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Icon name="lucide:grid-3x3" size={16} />
          Show all {images.length} photos
        </button>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon name="lucide:x" size={20} className="text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon name="lucide:chevron-left" size={24} className="text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon name="lucide:chevron-right" size={24} className="text-white" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[selectedIndex].url}
              alt={filteredImages[selectedIndex].caption}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <p className="text-white text-center font-medium">
                {filteredImages[selectedIndex].caption}
              </p>
              <p className="text-white/60 text-center text-sm mt-1">
                {selectedIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 px-4">
            {filteredImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                  selectedIndex === index
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.caption}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
