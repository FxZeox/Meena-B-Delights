import './globals.css'
import { Pacifico, Poppins } from 'next/font/google'
import Providers from './providers'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const headingFont = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
})

const bodyFont = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Meena B Delights',
  description:
    'Order fresh cakes, cupcakes, donuts, pastries, cookies, brownies, and desserts online with easy tracking.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <Providers>
          <SiteHeader />
          <main className="page-shell">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
