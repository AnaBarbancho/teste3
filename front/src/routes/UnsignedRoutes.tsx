import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages";

export default function UnsignedRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
        </BrowserRouter>
    )
}