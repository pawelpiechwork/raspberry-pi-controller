import { useState } from 'react'
import { Flex, Table, Button, Modal, Form, Input, message, Card } from 'antd'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { useGetLightsQuery, type Light } from './lightsPage/useGetLightsQuery'
import { useUpdateLightConfigMutation, type LightConfigUpdate } from './settingsPage/useUpdateLightConfigMutation'
import { PageHeader } from '../components/PageHeader'

type EditFormValues = {
  name: string
}

export function SettingsPage() {
  const [editingLight, setEditingLight] = useState<Light | null>(null)
  const [form] = Form.useForm<EditFormValues>()
  const [messageApi, contextHolder] = message.useMessage()

  const lightsQuery = useGetLightsQuery()
  const updateMutation = useUpdateLightConfigMutation()

  const handleEdit = (light: Light) => {
    setEditingLight(light)
    form.setFieldsValue({
      name: light.name,
    })
  }

  const handleCancel = () => {
    setEditingLight(null)
    form.resetFields()
  }

  const handleSave = async () => {
    if (!editingLight) return

    try {
      const values = await form.validateFields()
      const config: LightConfigUpdate = {}

      if (values.name !== editingLight.name) config.name = values.name

      if (Object.keys(config).length === 0) {
        messageApi.info('Brak zmian do zapisania')
        handleCancel()
        return
      }

      await updateMutation.mutateAsync({ id: editingLight.id, config })
      messageApi.success('Konfiguracja zapisana pomyślnie')
      handleCancel()
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(`Błąd: ${error.message}`)
      }
    }
  }

  const columns = [
    {
      title: 'Nazwa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pin',
      dataIndex: 'pin',
      key: 'pin',

    },
    {
      title: 'Pin przycisku',
      dataIndex: 'buttonPin',
      key: 'buttonPin',

    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_: unknown, record: Light) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          size='small'
        >
          Edytuj
        </Button>
      ),

    },
  ]

  return (
    <Flex vertical gap={24}>
      {contextHolder}
      <PageHeader
        title="Ustawienia"
        description="Widok pozwala na edycję nazw pomieszczeń przypisanych do diod LED. Możesz zmienić wyświetlaną nazwę pokoju (np. „Salon”, „Kuchnia”) bez ingerencji w konfigurację sprzętową — zmiana dotyczy tylko etykiet widocznych w aplikacji i w historii aktywności."
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Flex justify="flex-start">
          <Button
            size="small"
            onClick={() => lightsQuery.refetch()}
            loading={lightsQuery.isFetching}
            icon={<ReloadOutlined />}
          >
            Odśwież listę
          </Button>
        </Flex>
      </Card>

      <Table
        bordered
        size="small"
        dataSource={lightsQuery.data}
        columns={columns}
        rowKey="id"
        loading={lightsQuery.isLoading}
        pagination={false}
      />

      <Modal
        title={`Edytuj: ${editingLight?.name}`}
        open={!!editingLight}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Zapisz"
        cancelText="Anuluj"
        confirmLoading={updateMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Nazwa"
            rules={[{ required: true, message: 'Nazwa jest wymagana' }]}
          >
            <Input placeholder="np. Salon" />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}
