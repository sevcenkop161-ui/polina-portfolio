import { steps } from "@/data/site";
import SectionHead from "./SectionHead";
import ProcessSteps from "./ProcessSteps";

export default function Process() {
  return (
    <section id="process" className="panel scroll-mt-24">
      <SectionHead
        title="Этапы работы"
        text="Вы видите результат на каждом шаге и можете поправить направление до того, как всё готово."
      />
      <ProcessSteps steps={steps} />
    </section>
  );
}
