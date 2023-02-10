interface IProps {
  onClick?: () => void;
  children: React.ReactNode;
  selected?: boolean;
  color?: LegalColors;
}

export default function PrimaryButton({
  onClick,
  children,
  selected,
  color,
}: IProps) {
  const bgColor = getBgColor(color);
  const textColor = getTextColor(color);
  return (
    <button
      onClick={onClick}
      className={`${
        selected
          ? `${bgColor} text-background`
          : `bg-transparent ${textColor} outline`
      } rounded-lg px-4 py-2`}
    >
      {children}
    </button>
  );
}

type LegalColors =
  | 'owSecondary'
  | 'event-bedpres'
  | 'event-kurs'
  | 'event-sosialt';

function getBgColor(color?: LegalColors): string {
  switch (color) {
    case 'owSecondary':
      return 'bg-owSecondary';
    case 'event-bedpres':
      return 'bg-event-bedpres';
    case 'event-kurs':
      return 'bg-event-kurs';
    case 'event-sosialt':
      return 'bg-event-sosialt';
    default:
      return 'bg-owSecondary';
  }
}

function getTextColor(color?: LegalColors): string {
  switch (color) {
    case 'owSecondary':
      return 'text-owSecondary';
    case 'event-bedpres':
      return 'text-event-bedpres';
    case 'event-kurs':
      return 'text-event-kurs';
    case 'event-sosialt':
      return 'text-event-sosialt';
    default:
      return 'text-owSecondary';
  }
}
