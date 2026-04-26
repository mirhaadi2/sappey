export type DrawerType = "description" | "benefits" | "nutrition" | null;

export interface DrawerButtonProps {
  label: string;
  onClick: () => void;
}

export interface BadgeProps {
  icon: React.ReactNode;
  text: React.ReactNode;
}

export interface ComingSoonPlaceholderProps {
  label: string;
}

export interface NotFoundStateProps {
  onBack: () => void;
}