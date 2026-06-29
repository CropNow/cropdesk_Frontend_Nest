import * as React from "react";
import { cn } from "../../lib/utils";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "card-title"
  | "metric"
  | "button"
  | "label"
  | "nav"
  | "eyebrow"
  | "body"
  | "description"
  | "supporting"
  | "caption";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "muted"
  | "hint"
  | "heading"
  | "success"
  | "warning"
  | "danger"
  | "accent"
  | "inherit";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TypographyVariant;
  color?: TypographyColor;
}

const variantClassMap: Record<TypographyVariant, string> = {
  display: "t-display",
  h1: "t-h1",
  h2: "t-h2",
  h3: "t-h3",
  "card-title": "t-card-title",
  metric: "t-metric",
  button: "t-button",
  label: "t-label",
  nav: "t-nav",
  eyebrow: "t-eyebrow",
  body: "t-body",
  description: "t-description",
  supporting: "t-supporting",
  caption: "t-caption",
};

const colorClassMap: Record<TypographyColor, string> = {
  primary: "text-textPrimary",
  secondary: "text-textSecondary",
  muted: "text-textMuted",
  hint: "text-textHint",
  heading: "text-textHeading",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-[#00FF9C] dark:text-accentPrimary",
  inherit: "",
};

const defaultElementMap: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "card-title": "h4",
  metric: "div",
  button: "span",
  label: "label",
  nav: "span",
  eyebrow: "span",
  body: "p",
  description: "p",
  supporting: "p",
  caption: "span",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, variant = "body", color = "inherit", className, children, ...props }, ref) => {
    const Component = as || defaultElementMap[variant] || "span";

    return (
      <Component
        ref={ref as any}
        className={cn(variantClassMap[variant], colorClassMap[color], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

// Shortcut wrappers for clean and short JSX code:

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: TypographyColor;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, color = "heading", ...props }, ref) => {
    const variantMap: Record<number, TypographyVariant> = {
      1: "h1",
      2: "h2",
      3: "h3",
      4: "card-title",
      5: "card-title",
      6: "caption",
    };
    const variant = variantMap[level] || "h1";
    return (
      <Typography
        ref={ref as any}
        as={`h${level}`}
        variant={variant}
        color={color}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  variant?: "body" | "description" | "supporting" | "caption" | "eyebrow" | "metric";
  color?: TypographyColor;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ variant = "body", color = "primary", ...props }, ref) => {
    return <Typography ref={ref as any} variant={variant} color={color} {...props} />;
  }
);
Text.displayName = "Text";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  color?: TypographyColor;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ color = "secondary", className, ...props }, ref) => {
    return (
      <Typography
        ref={ref as any}
        as="label"
        variant="label"
        color={color}
        className={cn("block", className)}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";
