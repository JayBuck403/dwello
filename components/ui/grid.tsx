import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?:
    | number
    | {
        base?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
  children: ReactNode;
}

export const Grid = ({ cols, className, children, ...props }: GridProps) => {
  const colClasses = () => {
    if (typeof cols === "number") {
      return `grid-cols-${cols}`;
    } else if (typeof cols === "object") {
      const classes = [];
      if (cols.base) classes.push(`grid-cols-${cols.base}`);
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
      return classes.join(" ");
    }
    return "";
  };

  return (
    <div className={cn("grid", colClasses(), className)} {...props}>
      {children}
    </div>
  );
};