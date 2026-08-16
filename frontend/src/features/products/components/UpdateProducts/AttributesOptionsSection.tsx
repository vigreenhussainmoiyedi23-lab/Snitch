import AttributeEditor from "../../../admin/components/CreateProduct/AttributeEditor";
import OptionsEditor from "../../../admin/components/CreateProduct/OptionsEditor";

const AttributesOptionsSection = () => {
  return (
    <section className="bg-text p-6 rounded-xl shadow-soft space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white eczar">
          Attributes & Options
        </h2>

        <p className="text-sm text-background-subtle mt-1">
          Manage product attributes and selectable options.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Product Attributes
        </h3>

        <AttributeEditor />
      </div>

      <div className="border-t border-border pt-8">
        <OptionsEditor />
      </div>
    </section>
  );
};

export default AttributesOptionsSection;