export interface TextInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value?: string;
  change: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}