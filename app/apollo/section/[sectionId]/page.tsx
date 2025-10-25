// app/apollo/section/[sectionId]/page.tsx
import SectionFullView from "@/app/apollo/components/SectionFullView";

export default async function Page({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  return <SectionFullView sectionId={sectionId} />;
}
