import React from "react";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/schemas";
import { getActiveProducts } from "@/lib/server-actions";
import ActiveProducts from "@/app/_components/active-products";

const Home = async () => {
  const user = (await currentUser()) as ExtendedUser;
  console.log(user);
  const activeProducts = await getActiveProducts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      <div className="md:w-3/5 mx-auto py-10 px-6">
    <ActiveProducts
    activeProducts={activeProducts}
    
    />
   </div>
    </div>
  );
};

export default Home;



// import React from "react";
// import { currentUser } from "@/lib/auth";
// import { ExtendedUser } from "@/schemas";
// import { getUsersWithRatings } from "@/lib/server-actions"; // use new function
// import UsersGrid from "@/app/_components/UsersGrid";

// const Home = async () => {
//   const user = (await currentUser()) as ExtendedUser;
//   const users = await getUsersWithRatings();

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
//       <div className="md:w-3/5 mx-auto py-10 px-6">
//         <UsersGrid users={users} />
//       </div>
//     </div>
//   );
// };

// export default Home;
