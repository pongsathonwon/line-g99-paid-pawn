import { useLocation } from "react-router-dom";

/** Shows where the router ended up, for redirect assertions. */
function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{`${location.pathname}${location.search}`}</div>
  );
}

export default LocationProbe;
