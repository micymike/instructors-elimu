const OnlineClasses = () => {
  return (
    <div className="online-classes fade-in p-4 bg-blue-100 text-blue-900">
      <h2 className="text-2xl font-bold mb-4">Online Classes</h2>
      <p className="mb-6">Welcome to the online classes section. Here you can join live classes and access recorded sessions.</p>
      <div className="class-list space-y-4">
        {/* Example class items */}
        <div className="class-item p-4 bg-white shadow rounded">
          <h3 className="text-xl font-semibold">Math 101</h3>
          <div className="mt-2 space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Join Live</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Watch Recording</button>
          </div>
        </div>
        <div className="class-item p-4 bg-white shadow rounded">
          <h3 className="text-xl font-semibold">Science 202</h3>
          <div className="mt-2 space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Join Live</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Watch Recording</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineClasses;
