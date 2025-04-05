import { AuthProvider } from '@/auth'
import CookieConsent from '@/components/cookie-consent'
import { HealthIndicatorProvider } from '@/components/providers/health-indicator-provider'
import { SiteConfig } from '@/lib/site-config'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: SiteConfig.title,
	description: SiteConfig.description,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<HealthIndicatorProvider pollingInterval={15000}>
						<AuthProvider>
							<TooltipProvider>
								<div className="relative flex min-h-screen flex-col justify-stretch">
									<div className="flex-1">{children}</div>
								</div>
							</TooltipProvider>
						</AuthProvider>
					</HealthIndicatorProvider>
				</ThemeProvider>
				<CookieConsent />
			</body>
		</html>
	)
}
