"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

interface BlogCardProps {
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  likes: number;
  comments: number;
}

export default function BlogCard({
  title,
  author,
  date,
  image,
  excerpt,
  likes,
  comments,
}: BlogCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover object-center transition-transform duration-300 hover:scale-105"
       />


      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {author}</span>
          <span>{date}</span>
        </div>

        <div className="flex items-center justify-between mt-4 text-faith-blue">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faHeart} /> {likes}
            </span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faComment} /> {comments}
            </span>
          </div>
          <button className="text-faith-purple hover:text-faith-blue transition">
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>
    </div>
  );
}
