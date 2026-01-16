import { Card, Button, Space, Flex, Tag } from 'antd'
import { ApiOutlined, ReloadOutlined } from '@ant-design/icons'
import type { UseQueryResult } from '@tanstack/react-query'

type ActionBarProps = {
  healthQuery: UseQueryResult<unknown, Error>
  lightsQuery: UseQueryResult<unknown, Error>
}

export function ActionBar({ healthQuery, lightsQuery }: ActionBarProps) {
  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Flex justify="space-between">
        <Space>
          <Button
            size="small"
            onClick={() => healthQuery.refetch()}
            loading={healthQuery.isFetching}
            icon={<ApiOutlined />}
          >
            Sprawdź stan API
          </Button>
          <Button
            size="small"
            onClick={() => lightsQuery.refetch()}
            loading={lightsQuery.isFetching}
            icon={<ReloadOutlined />}
          >
            Odśwież listę
          </Button>
        </Space>

        {healthQuery.data ? (
          <Tag color="green">Połączono</Tag>
        ) : healthQuery.isError ? (
          <Tag color="red">Brak połączenia</Tag>
        ) : (
          <Tag>Nieznany</Tag>
        )}
      </Flex>
    </Card>
  )
}
