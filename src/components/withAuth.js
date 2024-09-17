import { useRouter } from "next/navigation";
import { useAuth } from "../app/contexts/AuthContext";

export function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      router.replace("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
