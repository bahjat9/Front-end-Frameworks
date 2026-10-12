import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="main-container text-page">
      <p className="eyebrow">The project</p>
      <h1>About CineGrid</h1>
      <p>A movie discovery app built with React and the TMDB API.</p>
      <Link to="/">Back to Home</Link>
    </main>
  );
}