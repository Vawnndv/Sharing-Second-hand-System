interface Props {
  text: string;
}

export function InlineError({ text }: Props) {
  return (
    <div className="text-subMain w-full mt-2 text-xs font-medium">
      <p>{text}</p>
    </div>
  );
}
