import React from "react";

function AppContainer({ children }: React.PropsWithChildren) {
  return <div className="container mx-auto">{children}</div>;
}

export default AppContainer;
