import { Suspense } from "react";
import NewTopicPage from "./NewTopicPage";
import Loader from "@/app/components/Loader";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <NewTopicPage />
    </Suspense>
  );
}
