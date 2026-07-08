export const siteConfig = {
  name: 'CCNU IoT Association',
  title: 'CCNU IoT - 华中师范大学物联网协会',
  description:
    '华中师范大学物联网协会官网。聚焦嵌入式硬件、机器学习算法、Web 与移动应用开发，用真实项目连接设备、数据与人。',
  liveUrl: 'https://ccnu-iot.github.io/site',
  contact: {
    applyLabel: '[ APPLY_PENDING ]',
    contactLabel: '[ CONTACT_PENDING ]',
    applyUrl: '',
    contactUrl: '',
    placeholder: '招新入口与联系方式待补充。建议填入 QQ 群、问卷星或协会邮箱。',
  },
  socialLinks: {
    github: '',
    bilibili: '',
  },
};

export const divisions = [
  {
    idx: '01',
    slug: 'hardware',
    href: '/groups/hardware',
    name: 'HARDWARE',
    nameEn: 'DIVISION_01',
    desc: '> 从电路设计到嵌入式开发。PCB 绘制、传感器调试、单片机编程。',
    tags: ['STM32', 'ESP32', 'PCB', 'SENSOR'],
    capabilities: ['原理图与 PCB', '传感器采集', '嵌入式驱动', '现场调试'],
  },
  {
    idx: '02',
    slug: 'algorithm',
    href: '/groups/algorithm',
    name: 'ALGORITHM',
    nameEn: 'DIVISION_02',
    desc: '> 机器学习、计算机视觉、数据分析。',
    tags: ['ML', 'CV', 'SIGNAL', 'PYTHON', 'PYTORCH'],
    capabilities: ['视觉识别', '数据建模', '边缘推理', '信号处理'],
  },
  {
    idx: '03',
    slug: 'application',
    href: '/groups/application',
    name: 'APPLICATION',
    nameEn: 'DIVISION_03',
    desc: '> 构建用户界面、开发移动应用、搭建后端服务。',
    tags: ['FLUTTER', 'VUE', 'BACKEND', 'UI', 'NODE'],
    capabilities: ['Web 控制台', '移动端应用', '后端服务', '交互设计'],
  },
] as const;

export const projects = [
  {
    idx: 'P-01',
    name: 'SENSOR NODE FIELD KIT',
    desc: '面向校园场景的传感器节点套件，预留硬件采集、无线通信与数据看板归档位。',
    badge: 'HW',
    badgeClass: 'badge-hw',
    year: 'ARCHIVE',
    status: '待归档',
    stack: ['PCB', 'MCU', 'SENSOR'],
  },
  {
    idx: 'P-02',
    name: 'VISION INFERENCE PIPELINE',
    desc: '图像识别与边缘推理方向项目位，用于承载模型训练、部署和评测记录。',
    badge: 'ALGO',
    badgeClass: 'badge-algo',
    year: 'ARCHIVE',
    status: '待归档',
    stack: ['PYTHON', 'CV', 'MODEL'],
  },
  {
    idx: 'P-03',
    name: 'DEVICE COMMAND CONSOLE',
    desc: '设备控制台方向项目位，用于展示 Web、移动端和后端服务协作能力。',
    badge: 'APP',
    badgeClass: 'badge-app',
    year: 'ARCHIVE',
    status: '待归档',
    stack: ['WEB', 'API', 'MOBILE'],
  },
] as const;
