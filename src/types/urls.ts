import { Id } from "./common"
import { URLAnalytics } from "./url-analytics";

export interface URL {
    id: Id;
    name: string;
    short_slug: string;
    original_url: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
    url_analytics: Partial<URLAnalytics>[];
}
  

export interface URLList {
    shortened_urls: URL[];
}

export interface GenerateShortURLResponse {
    generateShortURL: {
        slug: string;
    }
}

export interface InsertShortURLResponse {
    insert_shortened_urls_one: URL;
}