import { cn, Radio } from "@heroui/react";
import React from "react";

const CustomRadioButton = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex  m-0 bg-default/50 hover:bg-default/75 items-center ",
          "flex-row max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadioButton;
