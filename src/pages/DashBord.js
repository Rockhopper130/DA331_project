import React, { useState ,useEffect} from 'react';

function DashBord() {
  const poster = "  "
  const movies=[
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },
   { id:"1",
    poster:"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    title:"Blade Runner",
    year:'1982',
    genre:'Action, Drama, Sci-Fi',
    rating:'8.1',
    rating_count:'804,421',
    mood:'happy'
  },

  ]
  const [Poster,setPoster]=useState('https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg');
  const [Title,settitle]=useState('Batman');
  const [Year,setYear]=useState('1982');
  const [Genre,setGenre]=useState('Action, Drama, Sci-Fi');
  const [Rating,setRating]=useState('8.1');
  const [Rating_count,setRating_count]=useState('804,421');
  const [searchedmovie, setsearchedmovie] = useState('batman');
  const [error,seterror]=useState(false)
  const [Movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('Action'); 
  
  
  async function search() {
    {var url = `http://www.omdbapi.com/?t=${searchedmovie}&apikey=62cc7ab5`;
    let responce = await fetch(url);
    let data = await responce.json();
    if (data.Response === 'False') {
      seterror(true);
    } else {
      if(data.Poster!='N/A') {setPoster(data.Poster);
      }
      else{
        setPoster('/nopreview.png')
      }
      const updatedGenre=data.Genre;
      setSelectedGenre(updatedGenre.replace(/\s+/g, '+'))
      settitle(data.Title);
      setYear(data.Year);
      setGenre(data.Genre);
      setRating(data.imdbRating);
      setRating_count(data.imdbVotes);
      seterror(false);

    }
    
  }
    
   
  }


 console.log(Movies)
 useEffect(() => {
  const fetchMovies = async () => {
    try {
      const url = `http://www.omdbapi.com/?s=${selectedGenre}&apikey=62cc7ab5&type=movie`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        const slicedMovies = data.Search.slice(0, 5);
        setMovies(slicedMovies);
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchMovies();
}, [selectedGenre]);
function suggestionshandller(movie){
search(movie);
}
 
  // console.log(data)
  return (
    <div className=" flex flex-col ">
      <nav className="flex flex-col lg:flex lg:flex-row  p-4 justify-between ">
        <h1 className=" text-3xl font-bold text-amber-400">Movie-Analysis</h1>
       
          <div className="flex w-[35%] relative items-center ">
            <input
              onChange={(e) => { const updatedValue = e.target.value.replace(/\s+/g, '+'); 
              setsearchedmovie(updatedValue);
              }}
              className="flex-1  px-3 border-2 rounded-xl border-grey py-2 mr-5 outline-none w-[40%]"
              placeholder="Search Movies..."
            />
            <img
              onClick={search}
              className="ml-[85%] absolute cursor-pointer"
              src="/Search Icon.svg"
              alt="Search Icon"
            />
          </div>
      
        
      </nav>
      <div className=' flex justify-end -pt-5 pr-[18%]'>
        {error&&<div className=' text-red-700'>Please enter the correct name...</div>}</div>
      <div className=" mx-[15%] ">
      <div className=" flex justify-center gap-4 border m-2 p-4  ">
        <img src={Poster} className='rounded-md' width="300px" />
        <div>
          <h1 className="text-2xl font-bold">{Title}</h1>
          <h2 className=" text-[#161513] items-center text-sm">{Year} | {Genre}</h2>
          <h2 className=" text-[#3C9014] font-semibold">{Rating} ({Rating_count})</h2>
          <div className="flex gap-[50%] ml-5 mt-4 mb-2">
            <h2 className=" font-bold text-[#161513]  text-sm ">Top Reviews</h2>
          
          <img  className=" cursor-pointer" src="/right-arrow.svg"/></div>
          <div className=" bg-[#F7F7F7] mt-3">
           
            <div className="">
              <img src="/inverted.svg"/>
              <div className="w-[100%] pl-4 pt-2">
              Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet 
              </div>
              <div className="w-[100%]  flex justify-end">
                  <div className="text-[#4DA8EA] bg-[#E0F2FF] px-2 py-1 font-bold rounded-md">Happy</div>
              </div></div>
            <div className="">
              <img src="/inverted.svg"/>
              <div className="w-[100%] pl-4 pt-2">
              Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet Lorem Ipsum dolor sit amet 
              </div>
              <div className="w-[100%]  flex justify-end">
                  <div className="text-[#4DA8EA] bg-[#E0F2FF] px-2 py-1 font-bold rounded-md">Happy</div>
              </div></div>

          </div>
        </div>

      </div>
      </div>
      <h1 className='ml-[15%] my-2 font-bold'>Similar recommendations</h1>
      <div className=" flex flex-col justify-evenly   mx-16   transition">
  {Movies.map((data) => (
    <div  className="mx-5">
      <div className="flex gap-2 px-10 py-2 border">
        <img src={data.Poster} className=' rounded-md' alt={data.Title} />
        <div className="overflow-hidden">
          <h1 className="whitespace-nowrap text-sm font-bold">{data.Title}</h1>
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
