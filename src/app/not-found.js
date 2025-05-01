// src/app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Return to Home
      </a>
    </div>
  );
}