"use client"
import React from 'react'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { exportAuditPDF } from '@/libs/utils/export-pdf'
import Link from 'next/link'
import { Share } from 'lucide-react'
import { toast } from 'sonner'

const Header = () => {
    const router = useRouter();
    const pathname = usePathname()

    const copyReportLink = async () => {
        try {
            const url = window.location.href;

            await navigator.clipboard.writeText(url);

            // optional toast
            toast.success("Report link copied!");
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    };
    return (
        <div className='h-16 flex items-center justify-between w-full border-b shadow-sm border-gray-primary px-6 bg-white-primary!'>
            <Link href="/"><h1 className='text-black font-bold text-2xl p-2'>Credex</h1></Link>
            {pathname.includes("report") && <div className='flex items-center gap-4'>
                <Button
                    className="rounded-full px-4 py-2 bg-gray-900"
                    onClick={copyReportLink}
                >
                    <Share />
                </Button>
                <Button className='rounded-full px-4 py-2 bg-gray-900' onClick={() => { exportAuditPDF() }}>Export PDF</Button></div>}
        </div>
    )
}

export default Header