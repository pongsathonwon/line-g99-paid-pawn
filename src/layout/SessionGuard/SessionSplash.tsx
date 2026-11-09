/** Full-screen splash shown while the session is loading. */
function SessionSplash() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center fixed inset-0"
      style={{ backgroundColor: "#981C14" }}
    >
      <div className="flex items-center justify-center p-8">
        <img
          src="/logo/logo.png"
          alt="logo"
          className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-md max-w-full h-auto object-contain"
        />
      </div>
      <div className="text-gold">
        version {import.meta.env.VITE_APP_VERSION}
      </div>
    </div>
  );
}

export default SessionSplash;
