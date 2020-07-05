import React from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const ProductCarousel = ({itemsLength, children}) => {
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6,
          slidesToSlide: 6 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 4,
          slidesToSlide: 4 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        }
      };

    return (
        <Carousel
            swipeable={true}
            draggable={true}
            showDots={false}
            responsive={responsive}
            infinite={true}
            keyBoardControl={true}
            customTransition="all 1s linear"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            >
            {children}
        </Carousel>
    )
}

export default ProductCarousel;