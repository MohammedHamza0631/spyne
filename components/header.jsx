import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon
} from 'lucide-react'
const Header = () => {
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/'>
          <Image
            src={'/vercel.svg'}
            alt='Sensai Logo'
            width={100}
            height={60}
            className='h-12 py-1 w-auto object-contain'
          />
        </Link>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <SignedIn>
            <Link href='/dashboard'>
              <Button
                variant='outline'
                className='hidden md:inline-flex items-center gap-2'
              >
                <LayoutDashboard className='h-4 w-4' />
                Industry Insights
              </Button>
              <Button variant='ghost' className='md:hidden w-10 h-10 p-0'>
                <LayoutDashboard className='h-4 w-4' />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <Button className='flex w-fit items-center gap-2'>
              <Link href={`/create`}>
                
                <span className='hidden md:block'>Create Car</span>
              </Link>
            </Button>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant='outline'>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                  userButtonPopoverCard: 'shadow-xl',
                  userPreviewMainIdentifier: 'font-semibold'
                }
              }}
              afterSignOutUrl='/'
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header
