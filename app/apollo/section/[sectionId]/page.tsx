import SectionFullView from "../../components/SectionFullView";

export default function Page({ params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  return <SectionFullView sectionId={sectionId} />;
}
