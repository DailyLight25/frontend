"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

interface GroupCardProps {
  name: string;
  description: string;
  members: number;
  image: string;
}

export default function GroupCard({
  name,
  description,
  members,
  image,
}: GroupCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-44 object-cover object-center"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>

        <div className="flex items-center justify-between text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faUsers} />
            {members} members
          </span>
          <button className="bg-faith-blue text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-faith-purple transition-all flex items-center gap-2">
            <FontAwesomeIcon icon={faSignInAlt} />
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
