import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/schemas";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import NavBar from "@/app/_components/navbar";





const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // get the user from the server
//   const user = (await currentUser()) as ExtendedUser;


  return (
    <html 
    suppressHydrationWarning={true}
    
    lang="en">
      <body>
        {/* <Suspense fallback={<Spinner />}>
          <NavBar
          /> */}
          <NavBar/>

          {children}
        {/* </Suspense> */}
      </body>
    </html>
  );
};

export default HomeLayout;
