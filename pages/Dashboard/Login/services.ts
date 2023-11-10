import api from "~/utils/api";

export function login(email: string, password: string) {
  const router = useRouter();
  const toast = useToast();
  const user = useCookie("user");

  return new Promise((resolve, reject) => {
    api()
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        user.value = JSON.stringify(res.data);
        router.push("/dashboard");
        resolve();
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
