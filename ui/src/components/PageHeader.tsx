import { Flex, Typography } from 'antd'

const { Title, Paragraph } = Typography

type PageHeaderProps = {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Flex vertical justify="center" style={{ height: "200px" }}>
      <Title level={3} style={{ marginBottom: "8px" }}>
        {title}
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: "560px" }}>
        {description}
      </Paragraph>
    </Flex>
  )
}
