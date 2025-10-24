"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface CommentCardProps {
  author: string;
  comment: string;
  date: string;
  likes: number;
}

export default function CommentCard({
  author,
  comment,
  date,
  likes,
}: CommentCardProps) {
  return (
    <div className="bg-faith-cream rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-800">{author}</span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-gray-700 text-sm mb-3">{comment}</p>

      <div className="text-faith-blue text-sm flex items-center gap-2 cursor-pointer hover:text-faith-purple">
        <FontAwesomeIcon icon={faHeart} />
        {likes}
      </div>
    </div>
  );
}
