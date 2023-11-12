export default defineNuxtRouteMiddleware((to, from) => {
  const userToken = useCookie("userToken");
  if (
    to.path.includes("/dashboard") &&
    to.path !== "/dashboard/login" &&
    (!userToken.value || userToken.value === "")
  ) {
    return navigateTo("/dashboard/login");
  }
});
