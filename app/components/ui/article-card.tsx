interface ArticleCardProps {
  image: string;
  title: string;
  description: string;
  likes?: number;
  dislikes?: number;
}

export function ArticleCard({
  image,
  title,
  description,
  likes = 0,
  dislikes = 0,
}: ArticleCardProps) {
  return (
    <div className="cursor-pointer overflow-hidden rounded-[20px] border border-neutral-300 bg-white p-2 transition-all duration-300 hover:border hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
      <img
        src={image}
        alt={title}
        className="h-48 w-full rounded-xl object-cover"
      />
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-neutral-800">{title}</h3>
        <p className="mb-4 line-clamp-3 text-sm tracking-wide text-neutral-600">
          {description}
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="font-mono text-sm text-neutral-500">
                {likes}
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span className="font-mono text-sm text-neutral-500">
                {dislikes}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
