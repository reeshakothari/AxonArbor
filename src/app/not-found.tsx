import { getContent } from "@/lib/content";
import { NotFoundView } from "@/views/NotFoundView";
import { SiteChrome } from "@/views/SiteChrome";

export default async function NotFound() {
  const site = await getContent("site");
  return (
    <SiteChrome site={site}>
      <NotFoundView site={site} />
    </SiteChrome>
  );
}
