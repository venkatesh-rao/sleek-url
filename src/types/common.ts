export type Id = number;

export interface PageProps {
    params: Record<string, string | undefined>;
    searchParams?: Record<string, string | undefined>;
}