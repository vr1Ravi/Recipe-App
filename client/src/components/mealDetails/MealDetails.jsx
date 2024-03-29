import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToFav, removeFromFav, useFetchMealByIdQuery } from "../../api/api";
import Modal from "../Modal";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { MealTags } from "../Home/list";
import { toast } from "react-toastify";
const MealDetails = () => {
  const { id } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoId, setVideoId] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.user);
  const { isFetching, data: meal } = useFetchMealByIdQuery(id);
  console.log(meal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setLoading(true);
    if (meal) {
      const index = favorites.findIndex((fav) => fav.id === id);
      if (index !== -1) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      const ingredients = Object.keys(meal).filter(
        (key) =>
          key.includes("strIngredient") &&
          meal[key] !== "" &&
          meal[key] !== null,
      );
      setLoading(false);

      setIngredients(ingredients);
    }
  }, [meal, favorites, error]);

  const handleAddMeal = () => {
    const items = Math.floor(Math.random() * 3) + 1;
    const tags = [];
    for (let i = 0; i < items; i++) {
      tags.push(MealTags[Math.floor(Math.random() * 18)]);
    }
    const data = {
      id: id,
      name: meal.strMeal,
      img: meal.strMealThumb,
      tags: tags,
    };
    addToFav(dispatch, data);
  };
  const handleRemoveMeal = async () => {
    removeFromFav(dispatch, {
      id: id,
      name: meal.strMeal,
      img: meal.strMealThumb,
    });
  };
  const getVideoIdFromUrl = (url) => {
    const params = new URLSearchParams(new URL(url).search);
    setVideoId(params.get("v"));
  };
  console.log(videoId, showModal);
  return (
    <>
      <div className="relative grid grid-rows-2  place-items-center pt-4 md:grid-cols-2 md:grid-rows-1">
        {user && (
          <div className="absolute right-5 top-5">
            {!loading && !isFetching ? (
              isLiked ? (
                <FavoriteIcon
                  onClick={handleRemoveMeal}
                  className="cursor-pointer  text-red-700"
                  style={{ fontSize: "2rem" }}
                />
              ) : (
                <FavoriteBorderIcon
                  onClick={handleAddMeal}
                  className="cursor-pointer text-red-700"
                  style={{ fontSize: "2rem" }}
                />
              )
            ) : null}
          </div>
        )}

        <div className="animate-puls  h-full ">
          <div className="h-80 w-80 rounded-full bg-slate-200">
            {meal?.strMealThumb && (
              <>
                <img
                  src={meal.strMealThumb}
                  alt="meal-img"
                  className="h-full w-full rounded-full object-cover"
                />
                <h1 className="mt-2 text-center font-semibold">
                  {meal.strMeal}
                </h1>
                <button
                  onClick={() => {
                    getVideoIdFromUrl(meal.strYoutube);
                    setShowModal(true);
                  }}
                  className="mx-auto mt-4 w-full rounded-md bg-orange-500 p-3 text-white"
                >
                  Watch Now
                </button>
              </>
            )}
          </div>
        </div>
        <div className="animate-puls mt-12 flex h-full w-full flex-col items-start justify-start pt-8">
          {isFetching ? (
            <>
              <div className="mb-4 h-4 w-1/2 bg-slate-200"></div>
              <div className="grid w-4/5 grid-cols-2">
                <div className="mb-4 h-4 w-1/4 bg-slate-200"></div>
                <div className="mb-4 h-4 w-3/4 bg-slate-200"></div>
                <div className="mb-4 h-4 w-1/5 bg-slate-200"></div>
                <div className="mb-4 h-4 w-1/2 bg-slate-200"></div>
                <div className="mb-4 h-4 w-1/4 bg-slate-200"></div>
                <div className="mb-4 h-4 w-1/3 bg-slate-200"></div>
              </div>
            </>
          ) : meal ? (
            <div className="pl-4 md:pl-0">
              <h1 className=" mb-2 font-mono text-xl font-bold">Ingredients</h1>
              <div className="grid grid-cols-2 gap-2">
                {ingredients.map((ingredient, idx) => (
                  <div
                    key={ingredient}
                    className="mb-2 flex w-full items-center"
                  >
                    <span>
                      <FiberManualRecordIcon className="text-orange-500" />
                    </span>
                    <span className="mr-2 font-semibold">
                      {meal[`strMeasure${idx + 1}`]
                        ? meal[`strMeasure${idx + 1}`] + ","
                        : null}
                    </span>{" "}
                    <p> {meal[ingredient]}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-12">
        <div className="animate-puls">
          {meal?.strInstructions ? (
            <>
              <h1 className="mb-4 text-center text-2xl font-extrabold text-orange-500">
                INSTRUCTIONS
              </h1>
            </>
          ) : (
            <div className="mx-auto h-8  w-1/4 bg-slate-200"></div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 px-3">
          {meal?.strInstructions.split(".").map(
            (instruction, idx) =>
              instruction && (
                <div key={idx} className="flex  items-start">
                  <p className="">
                    <FiberManualRecordIcon className="text-orange-500" />
                  </p>
                  <p className="pl-2" key={instruction}>
                    {instruction.includes("STEP")
                      ? instruction.substring(6)
                      : instruction}
                  </p>
                </div>
              ),
          )}
        </div>
      </div>
      {showModal && (
        <Modal>
          <div className="">
            <button
              className=" float-end font-bold text-orange-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <iframe
              className=" h-[50vh] w-full md:h-[70vh]"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MealDetails;
