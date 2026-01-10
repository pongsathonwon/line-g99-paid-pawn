import React, { Suspense } from "react";

function AppContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="container mx-auto">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}

export default AppContainer;
