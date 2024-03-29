import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Categories, Areas } from "./list";
import Lists from "./Lists";
const Home = () => {
  const [randomMeal, setRandomMeal] = useState(null);
  const [calledOnce, setCalledOnce] = useState(false);
  useEffect(() => {
    const fetchRandomMeal = async () => {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php",
      );
      const data = await response.json();
      setRandomMeal(data.meals[0]);
    };
    if (!calledOnce) {
      fetchRandomMeal();
      setCalledOnce(true);
    }
    let interval = setInterval(() => fetchRandomMeal(), 2900);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative mt-4 h-[70vh] px-4">
        {randomMeal ? (
          <img
            src={randomMeal.strMealThumb}
            alt="randomMeal"
            className=" h-full w-full  rounded-md object-cover  shadow-lg"
          />
        ) : (
          <div className="flex h-full w-full animate-pulse shadow">
            <div className=" -mt-4 h-[105%] w-full bg-slate-200"></div>
          </div>
        )}

        <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/search">
            <input
              type="text"
              className="w-full cursor-default rounded-md p-4 shadow-lg outline-none"
              placeholder="Search for a recipe..."
            />
          </Link>
          <SearchIcon className="absolute right-4 top-1/3 text-2xl text-gray-300" />
        </div>
      </div>
      <Lists list={Categories} title="Categories" />
      <Lists list={Areas} title="Areas" />
    </>
  );
};

export default Home;
