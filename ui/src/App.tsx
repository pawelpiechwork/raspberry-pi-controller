import { Flex, Layout } from 'antd'
import { Outlet } from 'react-router'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

const { Content } = Layout

export const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />
      <Content style={{ padding: '24px 16px' }}>
        <Flex vertical gap={24} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </Flex>
      </Content>
      <Footer />
    </Layout>
  )
}
