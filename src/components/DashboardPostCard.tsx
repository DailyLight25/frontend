"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface DashboardPostCardProps {
  title: string;
  date: string;
  likes: number;
  comments: number;
}

export default function DashboardPostCard({
  title,
  date,
  likes,
  comments,
}: DashboardPostCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      <div className="flex justify-between items-center text-gray-500 mt-3">
        <div className="flex items-center gap-5 text-faith-blue text-sm">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faHeart} />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faComment} />
            {comments}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button className="text-faith-blue hover:text-faith-purple transition">
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
          <button className="text-red-500 hover:text-red-700 transition">
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
