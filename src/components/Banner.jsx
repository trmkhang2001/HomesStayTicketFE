import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Banner({ banners = [] }) {
  return (
    <div className="px-6 py-4 mx-auto">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2} // 👈 hiện hơn 1 slide
        centeredSlides={true} // 👈 slide chính ở giữa
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="mx-auto"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={banner.image}
              alt={`Banner ${index}`}
              className=".screen1440\:px-6 h-auto object-fill shadow"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
