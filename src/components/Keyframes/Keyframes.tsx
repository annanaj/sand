import React, { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import Spinner from "../svg/spinner.svg";
import styles from "./Keyframes.module.scss";

export function Keyframes() {
  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth,
  );

  // useEffect for tracking window width and the follow-up logic
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    // add the event listener
    window.addEventListener("resize", handleResize);
    // cleanup function on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // empty dependency array, i.e. the effect runs only on the first render
  // updates are handled by the handleResize handler itself; if we put e.g. windowWidth
  // into deps, it would be an infinite loop

  return (
    <div className="card-container items-center">
      <h2 className="title">Keyframes</h2>
      <p className="pb-8">
        Window width with useEffect: {windowWidth}px
      </p>
      <div className="flex gap-3 mt-5">
        <div
          className={`${styles.floatingCircle} ${styles.first}`}
        ></div>
        <div
          className={`${styles.floatingCircle} ${styles.second}`}
        ></div>
        <div
          className={`${styles.floatingCircle} ${styles.third}`}
        ></div>
      </div>
      <Button className={styles.button}>Hey there</Button>
      <ImSpinner9 className={styles.spinner} />
      <div
        className={styles.wheel}
        aria-labelledby="loading..."
      >
        <Spinner />
      </div>
    </div>
  );
}
