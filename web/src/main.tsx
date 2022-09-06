import { ApolloProvider } from '@apollo/client'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import App from './App'
import { GlobalState } from './components/GlobalState'
import { apolloClient } from './lib/apollo'

createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <ApolloProvider client={apolloClient}>
      <GlobalState>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalState>
    </ApolloProvider>
  </RecoilRoot>,
)
