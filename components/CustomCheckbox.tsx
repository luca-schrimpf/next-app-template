import { Checkbox, cn } from "@heroui/react";

export const CustomCheckbox = ({ value }: { value: string }) => {
  return (
    <Checkbox
      aria-label={value}
      classNames={{
        base: cn(
          "inline-flex max-w-full w-full bg-default/50 hover:bg-default/75 m-0",
          " items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-2">{value}</div>
    </Checkbox>
  );
};
