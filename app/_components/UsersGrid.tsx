
import React from "react";

type UserCardProps = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  rating: number;
};

const UsersGrid = ({ users }: { users: UserCardProps[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {users.map((user) => (
        <div key={user.id} className="p-5 bg-white dark:bg-gray-900 rounded shadow">
          <div className="flex items-center space-x-4">
            <img
              src={user.image || "/default-avatar.png"}
              alt={user.name || "User"}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user.location}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{user.bio}</p>
          <p className="mt-2 text-sm text-blue-500">⭐ Rating: {user.rating}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGrid;
