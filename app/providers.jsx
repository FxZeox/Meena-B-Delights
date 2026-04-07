'use client'

import { BakeryStoreProvider } from '../context/StoreContext'

export default function Providers({ children }) {
  return <BakeryStoreProvider>{children}</BakeryStoreProvider>
}
