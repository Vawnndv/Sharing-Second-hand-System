import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

function ProtectedRouter() {
    const { userInfo } = useSelector((state: RootState) => state.userLogin);
    return userInfo?.accessToken ? <Outlet /> : <Navigate to="/login" />
}

// admin router protection
function AdminProtectedRouter() {
    const { userInfo } = useSelector((state: RootState) => state.userLogin);

    return userInfo?.accessToken ? (
        userInfo?.roleID === 3 ? (
            <Outlet />
        ) : (
            <Navigate to="/*" />
        )
    ) : (
        <Navigate to="/login" />
    )
}

export { ProtectedRouter, AdminProtectedRouter }
