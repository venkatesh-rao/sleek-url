
"use client"

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import useCopy from "@/hooks/use-copy";
import withApollo from "@/lib/withApollo";
import { GET_URLs_QUERY } from "@/queries";
import { URL, URLList as URLListResponse } from "@/types/urls";
import { useQuery } from "@apollo/client";
import { Copy, CopyCheck, MousePointerClick, Eye as View } from "lucide-react";

interface URLRowProps extends URL {
}

function URLRow(props: URLRowProps) {
  const [isCopied, copy] = useCopy();

  const clicks: number = props.url_analytics[0]?.clicks || 0;
  const visits: number = props.url_analytics[0]?.visits || 0;

  const createdOn = new Intl.DateTimeFormat('en-GB', {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(props.created_at));

  const shortURL = `${process.env.NEXT_PUBLIC_HOST_URL}/${props.short_slug}`;
  return (
    <TableRow key={props.id} className="text-slate-900">
      <TableCell className="font-medium">
        <div className="flex items-center gap-1" title={props.name}>
          <p>{props.name}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 group">
          <a title={shortURL} className="whitespace-nowrap underline underline-offset-2 text-blue-500" target="blank" rel="noopener noreferrer" href={shortURL}>{shortURL}</a>
          <Button variant="ghost" size="icon" className="rounded-full h-6 w-6" title="Copy" onClick={() => copy(shortURL)}>
            {isCopied ? <CopyCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <p className="break-words line-clamp-1 md:line-clamp-2" title={props.original_url}>{props.original_url}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <p className="whitespace-nowrap line-clamp-2" title={`${createdOn} at ${new Date(props.created_at).toLocaleTimeString('en-GB', { hour12: false })}`}>{createdOn}</p>
        </div>
      </TableCell>
      <TableCell title={`${clicks} clicks`}>
        <div className="flex items-center gap-1">
          <MousePointerClick className="h-5 w-5 text-slate-600" />
          <p className="whitespace-nowrap">{clicks || 0}</p>
        </div>
      </TableCell>
      <TableCell title={`${visits} visits`}>
        <div className="flex items-center gap-1">
          <View className="h-5 w-5 text-slate-600" />
          <p className="whitespace-nowrap">{visits}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

async function URLList() {
  const { error, data, loading } = useQuery<URLListResponse>(GET_URLs_QUERY)

  if (loading) {
    return <div className="flex-1 flex py-20 justify-center w-full">Loading URLs...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (!data) {
    return <div>No data found!</div>
  }

  return (
    <div className="flex flex-col justify-start w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead className="w-[350px]">Short URL</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead className="w-[150px]">Created on</TableHead>
            <TableHead className="w-[120px]">Clicks</TableHead>
            <TableHead className="w-[120px]">Visits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.shortened_urls.map((u) => {
            return <URLRow key={u.id} {...u} />
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withApollo(URLList)