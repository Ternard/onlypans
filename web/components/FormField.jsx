export default function FormField({ label, accent, as, ...props }) {
  const className =
    "rounded-lg border border-black/10 px-3 py-2 text-base font-normal outline-none focus:border-black/30";
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {label}
      {as === "textarea" ? (
        <textarea {...props} className={className} />
      ) : (
        <input {...props} className={className} />
      )}
    </label>
  );
}
