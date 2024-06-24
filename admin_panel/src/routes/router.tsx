import { createHashRouter } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import {
  BasePage,
  LoginPage,
  NotFoundPage,
  OrdersPage,
  ProductsPage,
  HomePage,
  MarketingPage,
  ProtectedPage,
  UsersPage,
  CategoriesPage,
} from "../pages";
import { ROUTES } from "../constants";

export const routes: RouteObject[] = [
  {
    path: ROUTES.Login.path,
    element: <LoginPage />,
  },
  {
    path: ROUTES.Home.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <HomePage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.Orders.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <OrdersPage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.Products.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <ProductsPage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.Categories.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <CategoriesPage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.Users.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <UsersPage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.Marketing.path,
    element: (
      <ProtectedPage>
        <BasePage>
          <MarketingPage />
        </BasePage>
      </ProtectedPage>
    ),
  },
  {
    path: ROUTES.NotFound.path,
    element: <NotFoundPage />,
  },
];

export const router = createHashRouter(routes);
