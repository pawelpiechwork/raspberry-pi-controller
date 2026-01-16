import { Layout, Typography } from 'antd'

const { Footer: AntFooter } = Layout
const { Text } = Typography

export function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', background: 'transparent' }}>
      <Text type="secondary">
        {`System sterowania oświetleniem — projekt opracowany w ${new Date().getFullYear()} roku w ramach kierunku Informatyka w Akademii Śląskiej.`}
      </Text>
    </AntFooter>
  )
}
