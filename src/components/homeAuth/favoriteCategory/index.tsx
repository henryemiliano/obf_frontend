import courseService from "@/src/services/courseService";
import styles from "../../../../styles/slideCategory.module.scss";
import useSWR from "swr";
import SlideComponent from "../../common/slideComponent";
import SwrSpinner from "../../common/spinner";

const FavoriteCategory = function () {
  const { data, error } = useSWR("/favorites", courseService.getFavCourses);
  if (error) return error;
  if (!data) return <SwrSpinner />;

  return (
    <>
      <p className={styles.titleCategory}>MEUS FAVORITOS</p>
      {data.data.courses.length >= 1 ? (
        <SlideComponent course={data.data.courses} />
      ) : (
        <p className="text-center pt-4 h4">
          <strong>Seus favoritos aparecerão aqui :)</strong>
        </p>
      )}
    </>
  );
};

export default FavoriteCategory;
