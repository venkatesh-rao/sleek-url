import { gql } from "@apollo/client";

export const GET_URLs_QUERY = gql`
    query URLs {
        shortened_urls {
            id
            name
            original_url
            short_slug
            created_at
            expires_at
            url_analytics {
                clicks
                visits
            }
        }
    }
`;

export const GENERATE_SHORT_URL_MUTATION = gql`
    mutation GenerateShortURL($original_url: String!) {
        generateShortURL(original_url: $original_url) {
            slug
        }
    }
`;

export const INSERT_SHORT_URL_MUTATION = gql`
    mutation InsertShortenedURL($data: shortened_urls_insert_input!) {
        insert_shortened_urls_one(object: $data) {
            id
            name
            short_slug
            original_url
            created_at
            expires_at
            url_analytics {
                clicks
                visits
            }
        }
    }
`;