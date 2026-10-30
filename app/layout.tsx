import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'CTRL+GIRL — The Creative Marketing Playground',description:'Less scrolling. More creating. Practice marketing with creative briefs, thoughtful feedback, and portfolio projects.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
