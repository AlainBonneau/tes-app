"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import type { Post } from "@/app/types/post";

type Props = {
  params: {
    slug: string;
  };
};

export default function CategoryTopicsPage({ params }: Props) {
  const { slug } = params;
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/posts?categorySlug=${slug}`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div>Aucun sujet pour cette catégorie.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            {/* Lien vers le post */}
            <a href={`/tavern/topic/${post.id}`}>{post.title}</a>
          </div>
        ))
      )}
    </div>
  );
}
