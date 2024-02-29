require('isomorphic-fetch');
import { PageProps } from '@/types/common';
import { URLList } from '@/types/urls';
import { RedirectType, redirect } from 'next/navigation';

const QSTASH_URL = 'https://qstash.upstash.io/v2/publish/';

const fetchData = async (shortSlug: string | null | undefined) => {
    if (!shortSlug) return { redirect: "/404" };

    const urlList: URLList = await fetch('https://shorten-url.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "x-hasura-role": "public",
        },
        body: JSON.stringify({
            query: `
                query GetShortenedURL($short_slug: String!) {
                    shortened_urls(where: {short_slug: {_eq: $short_slug}}) {
                        id
                        original_url
                        expires_at
                    }
                }
            `,
            variables: { short_slug: shortSlug }
        }),
    })
        .then(res => res.json())
        .then(res => res.data);

    const { original_url, expires_at, id } = urlList.shortened_urls[0] ?? {};

    const expired = new Date(expires_at).getTime() < new Date().getTime();
    if (expired) return { redirect: "/404" };

    const headers = new Headers([
        ['Authorization', `Bearer ${process.env.QSTASH_TOKEN || ''}`],
        ['content-type', 'application/json'],
        ['Upstash-Forward-x-hasura-role', 'public']
    ]);
    const processorURL = "https://shorten-url.hasura.app/api/rest/update-url-analytics";

    await fetch(`${QSTASH_URL}${processorURL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ shortened_url_id: id }),
    });

    return { redirect: original_url };
};

export default async function Home({ params }: PageProps) {
    const data = await fetchData(params.slug);
    redirect(data.redirect, RedirectType.replace);
}