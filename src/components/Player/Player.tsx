import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

import Audio from "/short_adventure.mp3";
import Video from "/short_video.mp4";

import styles from "./Player.module.scss";

export function Player() {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] =
    useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] =
    useState<boolean>(false);

  const handleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.controls = true;
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.controls = false;
    }
  };

  return (
    <>
      <div className="card-container items-center">
        <h2 className="title">{t("Player.title")}</h2>
        <audio
          ref={audioRef}
          className={styles.media}
          controls
        >
          <source src={Audio} type="audio/mpeg" />
          {t("Player.audioNotSupported")}
        </audio>
        <Button onClick={handleAudioPlayPause}>
          {isAudioPlaying
            ? t("Player.pauseAudio")
            : t("Player.playAudio")}
        </Button>
        <video
          width="auto"
          height="auto"
          autoPlay
          muted
          ref={videoRef}
          className={styles.media}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <source src={Video} type="video/mp4" />
          {t("Player.videoNotSupported")}
        </video>
        <Button onClick={handleVideoPlayPause}>
          {isVideoPlaying
            ? t("Player.pauseVideo")
            : t("Player.playVideo")}
        </Button>
      </div>
    </>
  );
}
