export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user");
  if (
    to.path.includes("/dashboard") &&
    to.path !== "/dashboard/login" &&
    (!user.value || user.value === "")
  ) {
    return navigateTo("/dashboard/login");
  }
});
