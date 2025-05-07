import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string[]; // Pode ser uma categoria ou permissão que o usuário precisa ter
  requiredCategory?: string[]; // Pode ser uma categoria ou permissão que o usuário precisa ter
}

const ProtectedRoute = ({ children, requiredRole,requiredCategory }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);

  // Verifica se o usuário está logado e se ele tem a atribuição necessária (caso haja)
  if (user === null) {
    console.log("Usuário não logado");
    return <Navigate to="/login" />;
  }

  // Verifica se o usuário possui o papel necessário
  if (requiredRole && !requiredRole.includes(user.className)) {
    alert( `Você não tem permissão para acessar essa página` );
    console.log(!requiredRole.includes(user.className))
    console.log("Usuário não tem permissão para acessar essa página");
    return <Navigate to="/rota-restrita" />; // Redireciona para uma página de "não autorizado"
  }

  // Verifica se o usuário possui o papel necessário
  if (user.className !== "OWNER" && requiredCategory && !requiredCategory.includes(user.className)) {
    console.log(!requiredCategory.includes(user.className))
    console.log("Usuário não tem permissão para acessar esse módulo");
    return <Navigate to="/rota-restrita" />; // Redireciona para uma página de "não autorizado"
  }

  return children; // Se tudo estiver ok, renderiza o conteúdo protegido
};

export default ProtectedRoute;