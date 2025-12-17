import { apiClient } from "@/features/api/apiClient";

export async function articleDetailLoader({ params }) {
  const { id } = params;

  try {
    const res = await apiClient.get(`/api/articles/${id}`);

    return res.data.data;
  } catch (error) {
    //Loaders → throw Response on failure

    throw new Response("Article not found", {
      status: error.response?.status || 500,
    });
  }
}
