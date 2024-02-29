import { Id } from "./common"

export interface URLAnalytics {
    id: Id;
    url_id: Id;
    visits: number;
    clicks: number;
    created_at: string;
    updated_at: string;
}
  

export interface URLAnalyticsList {
    url_analytics: Partial<URLAnalytics>[];
}

export interface UpdateURLAnalyticsResponse {
    update_url_analytics: {
        returning: Partial<URLAnalytics>[];
    }
}