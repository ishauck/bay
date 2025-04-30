export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  metadata?: never;
  logo?: string | null | undefined;
}
