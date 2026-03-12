import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] ">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-sky-700 mb-4">
            Domisol Music Database
          </h1>
          <p className="text-xl text-sky-600">
            Play your own music in the browser.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/scores"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-sky-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View all Scores
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Frontend: localhost:3000 | API: localhost:3001</p>
        </div>
      </div>
    </div>
  );
}