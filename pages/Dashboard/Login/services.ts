import api from "~/utils/api";

export function login(email: string, password: string) {
  const router = useRouter();
  const toast = useToast();
  const userToken = useCookie("userToken");
  const userId = useCookie("userId");

  return new Promise((resolve, reject) => {
    api()
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        userToken.value = res.data.access_token;
        userId.value = res.data.userId;
        router.push("/dashboard");
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.add({
          title: "Erro",
          description: "Email ou senha inválidos",
          color: "red",
          timeout: 8000,
        });
        reject();
      });
  });
}
