import { UserProvider } from "./contexts";
import UnsignedRoutes from "./routes/UnsignedRoutes";

function App() {
  return (
    <UserProvider>
      <UnsignedRoutes />
    </UserProvider>
  );
}

export default App;
