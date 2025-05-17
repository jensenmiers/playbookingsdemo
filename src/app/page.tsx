import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Find Your Perfect</span>
              <span className="block text-primary">Indoor Basketball Court</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Book indoor basketball courts by the hour. Perfect for teams, leagues, or casual play.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Find a Court Near You</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter location"
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="date"
                className="p-2 border rounded-md"
              />
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Join our community of basketball enthusiasts and facility owners.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/auth/register?role=renter"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Find a Court
              </Link>
              <Link
                href="/auth/register?role=owner"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                List Your Court
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
