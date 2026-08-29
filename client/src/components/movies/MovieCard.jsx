import React from 'react'
import { useLocation } from '../../context/LocationContext';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({movie}) => {
  console.log(movie);
  const navigate = useNavigate();
  const { location } = useLocation();
  
  const handleNavigate = (movie) => {
      const originalTitle = movie.title;
      const cleanedTitle = originalTitle.includes(":") ? originalTitle.replace(/:/g, "") : originalTitle;
      const formattedTitle = cleanedTitle.replace(/\s+/g, "-").toLowerCase();
      navigate(`/movies/${location}/${formattedTitle}/${movie._id}/ticket`)
  }

  return (
    <div onClick={() =>handleNavigate(movie)} className='w-40 md:w-52 cursor-pointer'>
        <img src={movie.posterUrl} alt={movie.title} className='rounded-lg shadow-md' />
        <p className='mt-2 font-medium'>{movie.title}</p>
        <div className="flex items-center gap-2 text-sm">
  <span className="text-red-500 text-lg">★</span>
        <span className="text-gray-500">
          {movie.rating?.toFixed(1)}/10 | 
  
  
    {movie.votes >= 1000
      ? ` ${(movie.votes / 1000).toFixed(1)}K`
      : movie.votes} Votes
  </span>
</div>
        <p className='text-sm text-gray-600'>{movie.age}</p>
        <p className='text-sm text-gray-500 truncate'>{movie.languages.join(" | ")}</p>
    </div>
  )
}

export default MovieCard