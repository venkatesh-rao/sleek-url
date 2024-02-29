"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCopy from "@/hooks/use-copy";
import withApollo from "@/lib/withApollo";
import { GENERATE_SHORT_URL_MUTATION, GET_URLs_QUERY, INSERT_SHORT_URL_MUTATION } from "@/queries";
import { URLAnalytics } from "@/types/url-analytics";
import { GenerateShortURLResponse, InsertShortURLResponse, URL } from "@/types/urls";
import { useApolloClient } from "@apollo/client";
import { Copy, CopyCheck, Loader2, PlusIcon, RefreshCcw } from 'lucide-react';
import { MouseEventHandler, useState } from "react";
import { toast } from "sonner";

interface GenerateShortURLVariables {
    original_url: string
}

interface InsertShortURLVariablesData extends Omit<URL, "id" | "created_at" | "updated_at" | "url_analytics"> {
    url_analytics: { data: Partial<URLAnalytics>[] }
}

interface InsertShortURLVariables {
    data: InsertShortURLVariablesData;
}

const getExpiresAt = () => {
    const [yyyy, mm, dd] = new Date().toISOString().split("T")[0].split("-").map(d => Number(d));
    const expiresAt = new Date(`${yyyy + 1}-${mm}-${dd}`).toISOString();
    return expiresAt;
}


function Header() {
    const [isLoading, setLoading] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);
    const [url, setUrl] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [isCopied, copy] = useCopy();

    const client = useApolloClient();

    const generateShortURL: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const shortURLresponse = await client.mutate<GenerateShortURLResponse, GenerateShortURLVariables>({
                mutation: GENERATE_SHORT_URL_MUTATION,
                variables: { original_url: url }
            });
            if (shortURLresponse.errors) throw new Error(shortURLresponse.errors.map(e => e.message).join(", "));
            const slug = shortURLresponse.data?.generateShortURL.slug;
            if (!slug) throw new Error("Error while shortening your URL! Please try after sometime.")

            const insertShortURLresponse = await client.mutate<InsertShortURLResponse, InsertShortURLVariables>({
                mutation: INSERT_SHORT_URL_MUTATION,
                variables: {
                    data: {
                        name,
                        short_slug: slug,
                        original_url: url,
                        expires_at: getExpiresAt(),
                        url_analytics: {
                            data: [
                                { clicks: 0, visits: 0 }
                            ]
                        }
                    }
                },
                refetchQueries: () => [{ query: GET_URLs_QUERY }],
                awaitRefetchQueries: true
            });
            if (insertShortURLresponse.errors) throw new Error(insertShortURLresponse.errors.map(e => e.message).join(", "));
            const data = insertShortURLresponse.data?.insert_shortened_urls_one;
            if (!data?.id) throw new Error("Error while shortening your URL! Please try after sometime.")

            setSlug(data.short_slug);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false)
        }
    }

    const copyShortURL = async (URL: string) => {
        await copy(URL);
        toast.success("Copied to clipboard!");
    }

    const refresh = async () => {
        await client.refetchQueries({ include: [GET_URLs_QUERY] });
        toast.success("Refreshed!");
    }

    const shortURL = `${process.env.NEXT_PUBLIC_HOST_URL}/${slug}`;
    return (
        <div className="flex flex-row justify-start w-full gap-2 sticky top-0 bg-white py-8">
            <div className="flex flex-1 items-center gap-2">
                <h2 className="text-3xl font-semibold tracking-tight">
                    My URLs
                </h2>
                <Button variant="ghost" size="icon" title="Refresh" onClick={refresh} type="button">
                    <RefreshCcw className="h-5 w-5 text-slate-800" />
                </Button>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create a new URL</DialogTitle>
                        <DialogDescription>
                            Make your URL short and sweet
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        id="original_url"
                        placeholder="https://my-app.com/example"
                        className="col-span-3"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <Input
                        id="name"
                        placeholder="Ex: Blog link"
                        className="col-span-3"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    {slug != null ? (
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-green-700">
                                <span className="text-sm mr-2">
                                    Your short url is
                                </span>
                                {shortURL}
                            </p>
                            <Button variant="ghost" size="icon" title="Copy" className="rounded-full" onClick={() => copyShortURL(shortURL)}>
                                {isCopied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    ) : null}
                    <DialogFooter className="col-span-3">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isLoading} type="button">{slug == null ? "Cancel" : "Close"}</Button>
                        </DialogClose>
                        {slug == null ? (
                            <Button type="button" disabled={isLoading} onClick={generateShortURL}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isLoading ? "Shortening..." : "Shorten"}
                            </Button>
                        ) : null}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default withApollo(Header)
