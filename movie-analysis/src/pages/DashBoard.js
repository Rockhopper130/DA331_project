import React, { useState, useEffect } from "react";
import MoviesReviews from "../components/sampleReviews";

function DashBord() {
  const [Poster, setPoster] = useState(
    "https://m.media-amazon.com/images/M/MV5BZWQ0OTQ3ODctMmE0MS00ODc2LTg0ZTEtZWIwNTUxOGExZTQ4XkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg"
  );
  const [Title, settitle] = useState("Batman");
  const [Year, setYear] = useState("1982");
  const [Genre, setGenre] = useState("Action, Drama, Sci-Fi");
  const [Rating, setRating] = useState("8.1");
  const [Rating_count, setRating_count] = useState("804,421");
  const [searchedmovie, setsearchedmovie] = useState("batman");
  const [error, seterror] = useState(false);
  const [Movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("Action");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inferenceVal, setInferenceVal] = useState({0:3,1:3});
  const [fetchStatus, setFetchStatus] = useState("idle"); 

  useEffect(() => {
    const fetchMovieReviews = (array, count) => {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const fetchReviews = fetchMovieReviews(MoviesReviews, 2);
    setReviews(fetchReviews);
  }, [loading]);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  async function search() {
    try {
      var url = `http://www.omdbapi.com/?t=${searchedmovie}&apikey=62cc7ab5`;
      let responce = await fetch(url);
      let data = await responce.json();
      if (data.Response === "False") {
        seterror(true);
      } else {
        if (data.Poster !== "N/A") {
          setPoster(data.Poster);
        } else {
          setPoster("/nopreview.png");
        }
        const updatedGenre = data.Genre;
        setSelectedGenre(updatedGenre.split(",")[0].trim());
        settitle(data.Title);
        setYear(data.Year);
        setGenre(data.Genre);
        setRating(data.imdbRating);
        setRating_count(data.imdbVotes);
        seterror(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const url = `http://www.omdbapi.com/?s=${selectedGenre}&apikey=62cc7ab5&type=movie`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
          const slicedMovies = data.Search.slice(0, 10);
          setMovies(slicedMovies);
          console.log(Movies);
        } else {
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  const handleSuggestionClick = async (movieTitle) => {
    try {
      setLoading(true);
      setSuggestions([]);
      const url = `http://www.omdbapi.com/?t=${movieTitle}&apikey=62cc7ab5`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "False") {
        seterror(true);
      } else {
        if (data.Poster !== "N/A") {
          setPoster(data.Poster);
        } else {
          setPoster("/nopreview.png");
        }

        const updatedGenre = data.Genre;
        setSelectedGenre(updatedGenre.split(",")[0].trim());
        settitle(data.Title);
        setYear(data.Year);
        setGenre(data.Genre);
        setRating(data.imdbRating);
        setRating_count(data.imdbVotes);
        seterror(false);
        setInferenceVal({0:3,1:3});
        setFetchStatus("idle");

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      seterror(true);
    } finally {
      setLoading(false);
      setsearchedmovie("");
    }
  };
  async function fetchSuggestions() {
    try {
      var suggestionUrl = `http://www.omdbapi.com/?s=${searchedmovie}&apikey=62cc7ab5`;
      let suggestionResponse = await fetch(suggestionUrl);
      let suggestionData = await suggestionResponse.json();
      if (suggestionData.Response === "True") {
        // Extract movie titles from the suggestions
        const suggestionTitles = suggestionData.Search.map(
          (movie) => movie.Title
        );
        setSuggestions(suggestionTitles);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.log(err);
      setSuggestions([]);
    }
  }
  useEffect(() => {
    if (searchedmovie !== "batman" && searchedmovie.length > 1) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchedmovie]);

  const dataToSend = reviews;

// ...

const fetchData = () => {
  if (fetchStatus !== "idle") {
    // Fetch is already in progress or completed, do nothing
    return;
  }

  // Set fetch status to "loading"
  setFetchStatus("loading");

  fetch("http://127.0.0.1:5000/receive_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update state with the fetched data
      var temp = data.inference_result;
      setInferenceVal(temp);
      // Set fetch status to "success"
      setFetchStatus("success");
    })
    .catch((error) => {
      // Log the error
      console.error("Error:", error);
      // Set fetch status to "error"
      setFetchStatus("error");
    });
};


  // if(typeof(inferenceVal) === "undefined"){
  //   inferenceVal = [0,1];
  // }
  // console.log(Object.values(inferenceVal || {})[0]);

  // co0sole.log(dataToSend[0]?.comment);
  console.log("inferenceVal:", inferenceVal);

  return (
    <div className=" flex flex-col bg-white dark:bg-black dark:text-white ">
      <nav className="flex flex-col lg:flex lg:flex-row  p-4 justify-between ">
        <h1 className=" text-3xl font-bold text-amber-400">Movie-Analysis</h1>
        <div className="flex flex-col relative">
          <div className="flex w-[100%]  -mr-10 ml-64 relative items-center">
            <input
              onChange={(e) => {
                const updatedValue = e.target.value.replace(/\s+/g, "+");
                setsearchedmovie(updatedValue);
              }}
              className="flex-1 px-3 text-black  border-2 rounded-xl border-grey py-2 mr-5 outline-none w-[40%]"
              placeholder="Search Movies..."
            />
            <img
              onClick={search}
              className="ml-[85%] absolute cursor-pointer"
              src="/Search Icon.svg"
              alt="Search Icon"
            />
          </div>
          <ul className="absolute mt-10 ml-64 ">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="border px-3 dark:bg-black cursor-pointer rounded-md bg-[#F7F7F7] py-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>


        <div className="flex  flex-col justify-center items-center cursor-pointer">
          <div className="flex justify-center items-center">
            <span className="">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </span>
            {/* Switch Container */}
            <div
              className={`w-14 h-7 flex items-center bg-gray-300 rounded-full mx-3 px-1 ${
                isDarkMode ? "bg-cyan-700" : ""
              }`}
              onClick={toggleDarkMode}
            >
              {/* Switch */}
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                  isDarkMode ? "translate-x-7" : ""
                }`}
              ></div>
            </div>{" "}
            <span className="">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </span>
          </div>
        </div>
      </nav>
      <div className=" flex justify-end -pt-5 pr-[18%]">
        {error && (
          <div className=" text-red-700">Please enter the correct name...</div>
          )}
      </div>
      <div className=" mx-[15%] ">
        <div className=" flex justify-around gap-8 border m-2 p-4  ">
          {loading ? (
            <div className="animate-pulse">
              <div className="bg-gray-400 h-[450px] rounded-md w-[300px] "></div>
            </div>
          ) : (
            <img src={Poster} className="rounded-md" width="300px" />
            )}
          <div>
            <div class="flex flex-row justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold">{Title}</h1>
            <h2 className=" text-[#161513] dark:text-white items-center text-sm">
              {Year} | {Genre}
            </h2>
            <h2 className=" text-[#3C9014] flex font-semibold items-center">
              <img src="/star.png" className=" w-4 h-4" /> {Rating} (
              {Rating_count})
            </h2>
            </div>
            <div>
            <button class="h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={fetchData}>Analyse</button>
            <p class="text-xs">(*takes 60 to 90sec)</p>
            </div>
            </div>
            <div className="flex gap-[60%] ml-5 mt-4 mb-2">
              <h2 className=" dark:text-white font-bold text-[#161513]  text-sm ">
                Top Reviews
              </h2>

              {/* {!isDarkMode ? (
                <img className=" cursor-pointer" src="/right-arrow.svg" />
              ) : (
                <img className=" cursor-pointer" src="/right-arrow-white.svg" />
              )} */}
            </div>
            <div className=" bg-[#F7F7F7] p-4 dark:bg-black mt-3 flex flex-col gap-4 w-100 border border-blue-900 border-t-1">
              {dataToSend.map((data, index) => (
                <div className="">
                  {isDarkMode ? (
                    <img src="/inverted-white.svg" />
                  ) : (
                    <img src="/inverted.svg" />
                  )}
                  <div className="w-[100%] pl-4 pt-2">{data.comment}</div>
                  <div className="w-[100%]  flex justify-between mt-4">
                    <div className="ml-5 text-[#3C9014] flex items-center">
                      {" "}
                      <img src="/star.png" className=" w-4 h-4" />
                      {data.rating}/5
                    </div>
                    {/* {sendCommentToModel(data.comment)} */}
                    <div className="flex gap-2 mr-9">
                      {" "}

                      {(Object.values(inferenceVal || {})[index] === 3.0) && (
                        <div className="text-[#36454F] text-sm bg-[#E5E4E2] px-2 py-[3px] font-semibold rounded-md">
                          calculating
                        </div>
                      )}
                      {(Object.values(inferenceVal || {})[index] === 1.0) && (
                        <div className="text-[#097969] text-sm bg-[#D2FFD6] px-2 py-[3px] font-semibold rounded-md">
                          Positive
                        </div>
                      )}
                      {(Object.values(inferenceVal || {})[index] === 0.0) && (
                        <div className="text-[#C41E3A] text-sm bg-[#FAA0A0] px-2 py-[3px] font-semibold rounded-md">
                          Negative
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h1 className="ml-[15%] my-2 font-bold">Similar recommendations</h1>
      <div className=" flex flex-col justify-evenly   mx-16   transition">
        {Movies.map((data) => (
          <div
            onClick={() => handleSuggestionClick(data.Title)}
            className="mx-5 cursor-pointer bg-[#F7F7F7]"
          >
            <div className="flex dark:bg-black  gap-2 px-10 py-2 border">
              {loading ? (
                <div className="animate-pulse">
                  <div className="bg-gray-400 h-56 w-40 rounded-md mb-4"></div>
                </div>
              ) : (
                <img
                  src={data.Poster}
                  width="160px"
                  className=" cursor-pointer rounded-md"
                  alt={data.Title}
                />
              )}
              <div className=" flex flex-col justify-between">
                <div>
                  {" "}
                  <h1 className="whitespace-nowrap text-sm font-bold">
                    {data.Title}
                  </h1>
                  <h2 className="whitespace-nowrap dark:text-white text-[#161513] items-center text-xs">
                    {data.Year}
                  </h2>
                </div>
                <div className="flex gap-2 mr-9 mb-5">
                  {" "}
                  <div className="text-[#4DA8EA] text-sm bg-[#E0F2FF] px-2 py-[3px] font-semibold rounded-md">
                    imdb id : {data.imdbID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBord;
