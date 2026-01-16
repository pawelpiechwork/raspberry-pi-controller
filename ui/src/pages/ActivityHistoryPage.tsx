import { Flex, Table, Tag, Typography, Space, Button, Card, Spin } from 'antd'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { useGetActivityQuery, type ActivityRecord } from './activityHistoryPage/useGetActivityQuery'
import { useClearActivityMutation } from './activityHistoryPage/useClearActivityMutation'

const { Text } = Typography

const sourceLabels: Record<ActivityRecord['source'], { label: string; color: string }> = {
  api: { label: 'API', color: 'purple' },
  button: { label: 'Przycisk', color: 'green' },
}

export function ActivityHistoryPage() {
  const activityQuery = useGetActivityQuery()
  const activityData = activityQuery.data ?? []
  const clearActivityMutation = useClearActivityMutation()

  const handleClearLogs = () => {
    clearActivityMutation.mutate()
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <Flex vertical gap={24}>
      <PageHeader 
        title="Historia aktywności"
        description="Przegląd zmian stanu oświetlenia w systemie. Tabela pokazuje kiedy i w jaki sposób (przez przycisk lub API) została zmieniona dioda oraz na jaki stan."
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Flex justify="flex-start">
          <Space>
            <Button
              size="small"
              onClick={() => activityQuery.refetch()}
              loading={activityQuery.isFetching}
              icon={<ReloadOutlined />}
            >
              Odśwież listę
            </Button>
            <Button 
              size="small"
              icon={<DeleteOutlined />} 
              onClick={handleClearLogs}
              loading={clearActivityMutation.isPending}
              disabled={activityData.length === 0}
            >
              Wyczyść logi
            </Button>
          </Space>
        </Flex>
      </Card>

      {activityQuery.isLoading ? (
        <Flex justify="center" align="center" style={{ padding: 48 }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <Table
          bordered
          size="small"
          dataSource={activityData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 600 }}
          columns={[
            {
              title: 'Data i czas',
              dataIndex: 'datetime',
              key: 'datetime',
              width: 180,
              render: (datetime: string) => (
                <Text code>{formatDateTime(datetime)}</Text>
              ),
            },
            {
              title: 'Pomieszczenie',
              dataIndex: 'roomName',
              key: 'roomName',
              width: 150,
            },
            {
              title: 'Nowy stan',
              dataIndex: 'newState',
              key: 'newState',
              width: 120,
              render: (state: number) => (
                <Space>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: state === 0 ? '#52c41a' : '#d9d9d9',
                    }}
                  />
                  <span>{state === 0 ? 'Włączone' : 'Wyłączone'}</span>
                </Space>
              ),
            },
            {
              title: 'Źródło zmiany',
              dataIndex: 'source',
              key: 'source',
              width: 130,
              render: (source: ActivityRecord['source']) => {
                const { label, color } = sourceLabels[source]
                return <Tag color={color}>{label}</Tag>
              },
            },
          ]}
        />
      )}
    </Flex>
  )
}
