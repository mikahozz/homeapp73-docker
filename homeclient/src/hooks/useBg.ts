import { useEffect, useRef } from "react";
import { useDayTime } from "./useDayTime";
import { getTimeOfYear } from "./useTimeOfYear";

// Import all images from assets/img
const images = Object.values(
  import.meta.glob("../assets/img/*.jpeg", {
    eager: true,
    query: "?url",
    import: "default",
  })
) as string[];

export function useBg(intervalMs: number = 8 * 60 * 60 * 1000) {
  const indexRef = useRef(0);
  const { isDayTime } = useDayTime();

  useEffect(() => {
    if (images.length === 0) return;
    const filteredImages = images
      .filter((img) => img.includes(getTimeOfYear()))
      .filter((img) => {
        if (isDayTime(new Date())) {
          // Include images with "day" in the filename
          return img.includes("day");
        } else {
          // Include images with "night" in the filename
          return img.includes("night");
        }
      });
    console.log("Filtered images:", filteredImages);
    const setBg = () => {
      const bgEl = document.querySelector(".bg") as HTMLElement;
      if (bgEl) {
        console.log(
          "Swapping background to:",
          filteredImages[indexRef.current]
        );
        bgEl.style.backgroundImage = `url(${filteredImages[indexRef.current]})`;
      }
    };

    setBg();

    const interval = setInterval(() => {
      indexRef.current = Math.floor(Math.random() * filteredImages.length);
      setBg();
    }, intervalMs);

    return () => {
      clearInterval(interval);
      document.body.style.backgroundImage = "";
    };
  }, [intervalMs, isDayTime]);
}
