import { Menu, Layout, Tooltip, Flex } from 'antd'
import { HomeFilled, BarChartOutlined, ScheduleOutlined, SettingOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router'

const { Header } = Layout

const disabledTooltip = "Funkcja niedostępna w wersji demonstracyjnej."

const navItems = [
  {
    key: '/',
    icon: <HomeFilled />,
    label: <Link to="/">Sterowanie oświetleniem</Link>,
  },
  {
    key: '/history',
    icon: <BarChartOutlined />,
    label: <Link to="/history">Historia aktywności</Link>,
  },
  {
    key: 'schedules',
    icon: <ScheduleOutlined />,
    label: <Tooltip title={disabledTooltip}>Harmonogramy</Tooltip>,
    disabled: true,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">Ustawienia</Link>,
  },
]

export function Navbar() {
  const location = useLocation()

  return (
    <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 16px' }}>
      <Flex justify="space-between" align='center' style={{ width: "100%", maxWidth: 1200, margin: '0 auto' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{ borderBottom: 'none', width: "100%" }}
        />
      </Flex>

    </Header>
  )
}
