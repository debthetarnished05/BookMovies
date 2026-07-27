import React from "react";
import ReactSlick from "react-slick";


import { banners } from "../../utils/constants";


// Extract the actual component from the module object
const Slider = ReactSlick.default || ReactSlick;


const BannerSlider = () => {
  const settings = {
    centerMode: true,
    centerPadding: "400px", // side preview space
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    arrows: true,
    dots: true,
  };

  return (
    <div className="w-full bg-[181510] py-6">
      <div className="mx-auto px-4">
        <Slider {...settings} >
          {banners.map((banner, i) => (
            <div key={i} className="px-2">
              <img
                src={banner}
                alt={`banner-${banner.id}`}
                className="w-full h-[300px] rounded-xl object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;