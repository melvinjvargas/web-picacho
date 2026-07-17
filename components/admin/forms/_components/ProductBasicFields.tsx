import { Card, Field, inp } from "./FormHelpers";

interface ProductBasicFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  nameError?: string;
  descError?: string;
  categoryError?: string;
  categories: string[];
}

export function ProductBasicFields({ register, nameError, descError, categoryError, categories }: ProductBasicFieldsProps) {
  return (
    <Card title="Información general">
      <Field label="Nombre del producto" error={nameError}>
        <input {...register("name")} placeholder="Nombre del producto" className={inp()} />
      </Field>
      <Field label="Descripción del diseño" error={descError}>
        <textarea {...register("design_description")} placeholder="Breve historia del nombre y diseño..." className={`${inp()} h-[80px]`} />
      </Field>
      <Field label="Categoría" error={categoryError}>
        <select {...register("category")} className={inp()}>
          <option value="">Seleccionar...</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
    </Card>
  );
}
