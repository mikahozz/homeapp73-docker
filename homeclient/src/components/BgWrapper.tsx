import styles from "./BgWrapper.module.css";
import { useEffect, useRef, useState } from "react";
import { useDayTime } from "../hooks/useDayTime";
import { getTimeOfYear } from "../hooks/useTimeOfYear";

// Import all images from assets/img
const images = Object.values(
  import.meta.glob("../assets/img/*.jpeg", {
    eager: true,
    query: "?url",
    import: "default",
  })
) as string[];

function useBg(intervalMs: number = 8 * 60 * 60 * 1000) {
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
      const bgEl = document.querySelector(`.${styles.bg}`) as HTMLElement;
      if (bgEl) {
        console.log(
          "Swapping background to:",
          filteredImages[indexRef.current]
        );
        bgEl.style.backgroundImage = `url(${filteredImages[indexRef.current]})`;
      } else {
        console.warn("Background element not found", styles.bg);
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

interface BgProps {
  children: React.ReactNode;
}

export default function BgWrapper({ children }: BgProps) {
  useBg();
  const [dimmed, setDimmed] = useState(false);
  const bgReturnTimeout = 30000;

  const handleBgClick = () => {
    const updatedDimmedVal = !dimmed;
    console.log("Setting foreground dimmed to ", updatedDimmedVal);
    setDimmed(updatedDimmedVal);
    if (updatedDimmedVal) {
      const bringBack = setTimeout(() => {
        console.log("Returning foreground to normal");
        setDimmed(false);
      }, bgReturnTimeout);
      return () => clearTimeout(bringBack);
    }
  };

  return (
    <>
      <div className={styles.bg} onClick={handleBgClick}>
        <div className={styles.bgOverlay} onClick={handleBgClick}>
          <div
            className={styles.bgChildren}
            style={{
              opacity: dimmed ? 0.1 : 1,
              transition: "opacity 0.3s",
              pointerEvents: dimmed ? "none" : "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
