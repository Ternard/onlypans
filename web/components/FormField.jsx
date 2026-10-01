export default function FormField({ label, as, children, ...props }) {
  const Tag = as || "input";
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
      {label}
      <Tag {...props} className="field">
        {children}
      </Tag>
    </label>
  );
}
