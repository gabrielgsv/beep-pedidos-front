import api from "~/utils/api";

export function register(
  name: string,
  email: string,
  password: string,
  url?: string
) {
  const router = useRouter();
  const toast = useToast();

  return new Promise((resolve, reject) => {
    api()
      .post("/users", {
        name,
        email,
        password,
        url,
      })
      .then((res) => {
        router.push("/dashboard/login");
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.add({
          title: "Erro",
          description: "Erro ao cadastrar, tente novamente.",
          color: "red",
          timeout: 8000,
        });
        reject();
      });
  });
}
