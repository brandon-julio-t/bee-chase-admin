import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BinusImg from "../../public/binus.png";
import RibbonImg from "../../public/ribbon.png";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true);

    const response = await signIn("credentials", {
      redirect: false,
      username: email,
      password,
    });

    setIsLoading(false);

    if (response?.ok) {
      toast.success("Login success.");
      router.push("/games");
    } else {
      toast.error("Invalid credentials.");
    }
  });

  return (
    <main className="grid h-screen place-items-center">
      <div className="w-full">
        <section className="card mx-auto w-full  max-w-sm bg-base-100 shadow-xl">
          <div className="flex items-center gap-2 px-10">
            <Image src={RibbonImg} alt="ribbon" className="mr-2" />
            <Image src={BinusImg} alt="binus" />
          </div>

          <form
            onSubmit={onSubmit}
            className="card-body items-center text-center"
          >
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="input input-bordered w-full max-w-xs"
              required
            />

            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
              required
            />

            <div className="card-actions w-full">
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full ${isLoading && "loading"}`}
              >
                Login
              </button>
            </div>
          </form>
        </section>

        <footer className="footer footer-center mt-4 p-4 text-base-content">
          <div>
            <p>
              Copyright © {new Date().getFullYear()} <br />
              Research and Development Team (RnD) <br />
              Software Laboratory Center (SLC)
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default LoginPage;