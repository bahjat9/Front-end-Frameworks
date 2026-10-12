import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="main-container text-page not-found-page">
      <p className="eyebrow">Nothing to see here</p>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Back to Home</Link>
    </main>
  );
}