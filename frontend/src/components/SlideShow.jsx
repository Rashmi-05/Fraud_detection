import { useState, useEffect } from 'react';
import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.JPG';
import slide3 from '../assets/slide3.JPG';

const slides = [slide1, slide2, slide3];

export default function SlideShow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000); // change every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full">
      <img
        src={slides[index]}
        alt="slide"
        className="w-full h-full object-cover rounded-l-xl"
      />
    </div>
  );
}
