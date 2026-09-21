import React from "react";

type MovieCardProps = {
  id: number;
  title: string;
};

const MovieCard: React.FC<MovieCardProps> = ({ id, title }) => {
  return (
    <article className="movie-card" data-id={id}>
      <h2>{title}</h2>
    </article>
  );
};

export default MovieCard;
