import React, { useState, useEffect } from "react";
import MoviesReviews from "../components/sampleReviews";
function DashBord() {
  const [Poster, setPoster] = useState(
    "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
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

  useEffect(() => {
    const getRandomReviews = (array, count) => {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const twoRandomReviews = getRandomReviews(MoviesReviews, 2);
    setReviews(twoRandomReviews);
  }, [loading]);

  async function search() {
    try {
      var url = `http://www.omdbapi.com/?t=${searchedmovie}&apikey=62cc7ab5`;
      let responce = await fetch(url);
      let data = await responce.json();
      if (data.Response === "False") {
        seterror(true);
      } else {
        if (data.Poster != "N/A") {
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
        setLoading(true)
        const url = `http://www.omdbapi.com/?s=${selectedGenre}&apikey=62cc7ab5&type=movie`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
          const slicedMovies = data.Search.slice(0, 10);
          setMovies(slicedMovies);
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
      setLoading(true)
      setSuggestions([])
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

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      seterror(true);
    } finally {
      setLoading(false);
      setsearchedmovie('')
      

    }
  };
  async function fetchSuggestions() {
    try {
      var suggestionUrl = `http://www.omdbapi.com/?s=${searchedmovie}&apikey=62cc7ab5`;
      let suggestionResponse = await fetch(suggestionUrl);
      let suggestionData = await suggestionResponse.json();
      if (suggestionData.Response === "True") {
        // Extract movie titles from the suggestions
        const suggestionTitles = suggestionData.Search.map((movie) => movie.Title);
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
    if (searchedmovie !== "batman"&& searchedmovie.length > 1) {
      fetchSuggestions();
    } 
     else{
      setSuggestions([]);
    }
  }, [searchedmovie]);
  // console.log(data)
  return (
    <div className=" flex flex-col ">
      <nav className="flex flex-col lg:flex lg:flex-row  p-4 justify-between ">
        <h1 className=" text-3xl font-bold text-amber-400">Movie-Analysis</h1>
        <div className="flex flex-col relative">
  <div className="flex w-[100%] mr-64 relative items-center">
    <input
      onChange={(e) => {
        const updatedValue = e.target.value.replace(/\s+/g, "+");
        setsearchedmovie(updatedValue);
        if(searchedmovie===''){e.value=''}
      }}
      className="flex-1 px-3 border-2 rounded-xl border-grey py-2 mr-5 outline-none w-[40%]"
      placeholder="Search Movies..."
    />
    <img
      onClick={search}
      className="ml-[85%] absolute cursor-pointer"
      src="/Search Icon.svg"
      alt="Search Icon"
    />
  </div>
  <ul className="absolute mt-10 ">
    {suggestions.map((suggestion, index) => (
      <li key={index} className="border px-3 rounded-md bg-[#F7F7F7] py-2" onClick={() => handleSuggestionClick(suggestion)}>
        {suggestion}
      </li>
    ))}
  </ul>
</div>

      </nav>
      <div className=" flex justify-end -pt-5 pr-[18%]">
        {error && (
          <div className=" text-red-700">Please enter the correct name...</div>
        )}
      </div>
      <div className=" mx-[15%] ">
        <div className=" flex justify-center gap-4 border m-2 p-4  ">
          {loading ? (
            <div className="animate-pulse">
              <div className="bg-gray-400 h-[450px] rounded-md w-[300px] "></div>
            </div>
          ) : (
            <img src={Poster} className="rounded-md" width="300px" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{Title}</h1>
            <h2 className=" text-[#161513] items-center text-sm">
              {Year} | {Genre}
            </h2>
            <h2 className=" text-[#3C9014] flex font-semibold items-center">
              <img src="/star.png" className=" w-4 h-4" /> {Rating} (
              {Rating_count})
            </h2>
            <div className="flex gap-[60%] ml-5 mt-4 mb-2">
              <h2 className=" font-bold text-[#161513]  text-sm ">
                Top Reviews
              </h2>

              <img className=" cursor-pointer" src="/right-arrow.svg" />
            </div>
            <div className=" bg-[#F7F7F7] mt-3 flex flex-col gap-4">
              {reviews.map((data) => (
                <div className="">
                  <img src="/inverted.svg" />
                  <div className="w-[100%] pl-4 pt-2">{data.comment}</div>
                  <div className="w-[100%]  flex justify-between">
                    <div className="ml-5 text-[#3C9014] flex items-center">
                      {" "}
                      <img src="/star.png" className=" w-4 h-4" />
                      {data.rating}/5
                    </div>
                    <div className="text-[#4DA8EA] bg-[#E0F2FF] px-2 py-1 font-bold rounded-md">
                      Happy
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
            <div className="flex gap-2 px-10 py-2 border">
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
              <div className="overflow-hidden">
                <h1 className="whitespace-nowrap text-sm font-bold">
                  {data.Title}
                </h1>
                <h2 className="whitespace-nowrap text-[#161513] items-center text-xs">
                  {data.Year}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBord;
