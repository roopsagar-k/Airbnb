import "./App.css";

import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import Layout from "./Layout.jsx";
import Register from "./pages/Register.jsx";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import PlacesFormPage from "./pages/PlacesFormPage.jsx";
import PlacePage from "./pages/PlacePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import { SearchProvider } from "./SearchContext.jsx";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account/:subPage?" element={<AccountPage />} />
            <Route path="/account/:subPage?/new" element={<PlacesFormPage />} />
            <Route path="/account/:subPage/:id" element={<PlacesFormPage />} />
            <Route
              path="/account/bookings/:placeId"
              element={<BookingPage />}
            />
            <Route path="/place/:id" element={<PlacePage />} />
          </Route>
        </Routes>
      </SearchProvider>
    </UserContextProvider>
  );
}

export default App;
