import React, {Component} from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const getConfigurableProps = () => ({
    showArrows: true,
    showStatus: false,
    showIndicators: true,
    infiniteLoop: true,
    showThumbs: false,
    useKeyboardArrows: true,
    autoPlay: true,
    stopOnHover: true,
    swipeable: true,
    dynamicHeight: false,
    emulateTouch: true,
    thumbWidth: 100,
    selectedItem: 0,
    interval: 3600,
    transitionTime: 150,
    swipeScrollTolerance: 5,
});


class HeroCarousel extends Component {
    render() {
        return (
            <Carousel {...getConfigurableProps()}>
                <div>
                    <img src={require("../../images/banner-4.jpg")} />
                    <p className="legend">Add to basket</p>
                </div>
                <div>
                    <img src={require("../../images/banner-3.png")} />
                    <p className="legend">View Featured</p>
                </div>
                <div>
                    <img src={require("../../images/banner-2.jpg")} />
                    <p className="legend">Shop Online</p>
                </div>
            </Carousel>
        );
    }
}

export default HeroCarousel;