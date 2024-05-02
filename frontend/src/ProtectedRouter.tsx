import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouter() {
    const { userInfo } = useSelector((state: RootState) => state.userLogin);

    return userInfo?.Authorization ? <Outlet /> : <Navigate to="/" />
}

// admin router protection
function AdminProtectedRouter() {
    const { userInfo } = useSelector((state: RootState) => state.userLogin);

    return userInfo?.Authorization ? (
        userInfo?.roleId === 3 ? (
            <Outlet />
        ) : (
            <Navigate to="/*" />
        )
    ) : (
        <Navigate to="/" />
    )
}

export { ProtectedRouter, AdminProtectedRouter }
