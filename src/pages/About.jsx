import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import { STORE_CONFIG as S } from "../config/store";
export default function About() {
  usePageMeta("About", `About ${S.name}.`);
  return (
    <div className="wrap max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">About {S.name}</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-muted">
        <p>{S.name} started with a simple idea: a good watch should feel special without costing a fortune. Replace this text with your own story.</p>
        <p>We choose each watch for its finish, comfort and value. When you order, you speak to a real person on WhatsApp who confirms availability and arranges delivery.</p>
        <p>Whether you need a daily watch, a gift or a statement piece, we will help you choose.</p>
      </div>
      <Link to="/shop" className="btn btn-primary mt-10">Shop watches</Link>
    </div>
  );
}
