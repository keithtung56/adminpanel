import { PropsWithChildren, useEffect, memo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { AuthContext } from "../../context";

export const ProtectedPage = memo(({ children }: PropsWithChildren) => {
  //@ts-ignore
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(ROUTES.Login.path);
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <></>;
  }
  return <>{children}</>;
});
