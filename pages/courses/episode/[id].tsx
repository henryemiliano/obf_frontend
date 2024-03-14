/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import styles from "../../../styles/episodePlayer.module.scss";
import Head from "next/head";
import HeaderGeneric from "@/src/components/common/headerGeneric";
import courseService, { CourseType } from "@/src/services/courseService";
import { useState, useEffect, useRef } from "react";
import SwrSpinner from "@/src/components/common/spinner";
import { Button, Container } from "reactstrap";
import ReactPlayer from "react-player";
import Footer from "@/src/components/common/footer";
import watchEpisodeService from "@/src/services/episodeService";

const EpisodePlayer = function () {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [course, setCourse] = useState<CourseType>();
  const episodeOrder = parseFloat(router.query.id?.toString() || "");
  const episodeId = parseFloat(router.query.episodeid?.toString() || "");
  const courseId = router.query.courseid?.toString() || "";

  const [loading, setLoading] = useState(true);
  const [getEpisodeTime, setGetEpisodeTime] = useState(0);
  const [episodeTime, setEpisodeTime] = useState(0);

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("onebitflix-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetEpisodeTime = async () => {
    const res = await watchEpisodeService.getWatchTime(episodeId);
    if (res.data !== null) {
      setGetEpisodeTime(res.data.seconds);
    }
  };

  const handleSetEpisodeTime = async () => {
    await watchEpisodeService.setWatchTime({
      episodeId: episodeId,
      seconds: Math.round(episodeTime),
    });
  };

  const handlePlayerTime = () => {
    playerRef.current?.seekTo(getEpisodeTime);
    setIsReady(true);
  };

  if (isReady === true) {
    setTimeout(() => {
      handleSetEpisodeTime();
    }, 1000 * 3);
  }

  useEffect(() => {
    handleGetEpisodeTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const getCourse = async function () {
    if (typeof courseId !== "string") return;

    const res = await courseService.getEpisodes(courseId);
    if (res.status === 200) {
      setCourse(res.data);
    }
  };

  useEffect(() => {
    getCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (course?.episodes === undefined) return <SwrSpinner />;

  const handleLastEpisode = () => {
    router.push(
      `/courses/episode/${episodeOrder - 1}?courseid=${course?.id}&episodeid=${
        episodeId - 1
      }`
    );
  };

  const handleNextEpisode = () => {
    router.push(
      `/courses/episode/${episodeOrder + 1}?courseid=${course?.id}&episodeid=${
        episodeId + 1
      }`
    );
  };

  if (episodeOrder + 1 < course?.episodes?.length) {
    if (Math.round(episodeTime) === course.episodes[episodeOrder].secondsLong) {
      handleNextEpisode();
    }
  }

  if (loading) {
    return <SwrSpinner />;
  }

  return (
    <>
      <Head>
        <title>Onebitflix - {course.episodes[episodeOrder].name}</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <main>
        <HeaderGeneric
          logoUrl="/home"
          btnContent={`Voltar para o curso`}
          btnUrl={`/courses/${course.id}`}
        />
        <Container className="d-flex flex-column align-items-center gap-3 pt-5">
          <p className={styles.episodeTitle}>
            {course.episodes[episodeOrder].name}
          </p>

          {typeof window == "undefined" ? null : (
            <ReactPlayer
              className={styles.player}
              url={`${
                process.env.NEXT_PUBLIC_BASEURL
              }/episodes/stream?videoUrl=${
                course.episodes[episodeOrder].videoUrl
              }&token=${sessionStorage.getItem("onebitflix-token")}`}
              controls
              ref={playerRef}
              onStart={handlePlayerTime}
              onProgress={(progress) => {
                setEpisodeTime(progress.playedSeconds);
              }}
            />
          )}

          <div className={styles.episodeButtonDiv}>
            <Button
              className={styles.episodeButton}
              disabled={episodeOrder === 0 ? true : false}
              onClick={handleLastEpisode}
            >
              <p>&#x2B05; Anterior</p>
            </Button>
            <Button
              className={styles.episodeButton}
              disabled={
                episodeOrder + 1 === course.episodes.length ? true : false
              }
              onClick={handleNextEpisode}
            >
              <p>Próximo &#x27A1;</p>
            </Button>
          </div>
          <p className="text-center pb-4 h5">
            {course.episodes[episodeOrder].synopsis}
          </p>
        </Container>

        <Footer />
      </main>
    </>
  );
};

export default EpisodePlayer;
