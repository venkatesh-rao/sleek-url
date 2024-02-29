"use client"

import Header from "@/components/page/Header";
import URLList from "@/components/page/URLList";
import { Suspense } from 'react';
import dynamic from "next/dynamic";

function Home() {
    return (
        <main className="flex min-h-screen max-w-screen-2xl mx-auto flex-col items-start justify-start p-4">
            <Header />
            <Suspense fallback={<div className="flex-1 flex py-20 justify-center w-full">Loading URLs...</div>}>
                <URLList />
            </Suspense>
        </main>
    );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });