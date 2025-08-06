const routeConstants = [
  {
    name: "overview",
    roles: ["admin", "user"],
  },
  {
    name: "user",
    roles: ["admin"],
  },
  {
    name: "admin",
    roles: ["admin", "user", ],
  },
];

export const hasAccess = (routeName, userRole) => {
  const route = routeConstants.find((r) => r.name === routeName);
  if (!route) return false;
  return route.roles.includes(userRole);
};
