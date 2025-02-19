import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Layout() {
    return(
        <div className="flex flex-col px-4 sm:px-8 lg:px-16">
            <Header />
            <Outlet />
        </div>
    )
}