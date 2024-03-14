import useSWR from "swr";
import categoriesService, {
  CategoryType,
} from "../../../services/categoriesService";
import SlideComponent from "../../common/slideComponent";
import styles from "../../../../styles/slideCategory.module.scss";
import SwrSpinner from "../../common/spinner";

interface props {
  categoryId: number;
  categoryName: string;
}

const ListCategoriesSlide = function ({ categoryId, categoryName }: props) {
  const { data, error } = useSWR(`/categories/${categoryId}`, () =>
    categoriesService.getCourses(categoryId)
  );

  if (error) return error;
  if (!data) return <SwrSpinner />;

  return (
    <>
      <p className={styles.titleCategory}>{categoryName}</p>
      <SlideComponent course={data.data.courses} />
    </>
  );
};

export default ListCategoriesSlide;
