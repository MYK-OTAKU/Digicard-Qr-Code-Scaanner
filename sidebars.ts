import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'System Documentation',
      items: [
        'system-docs/intro',
        'system-docs/product-requirements',
        'system-docs/ux-design',
        'system-docs/software-architecture',
        'system-docs/technical-design',
        'system-docs/source-code',
        'system-docs/quality-assurance',
        'system-docs/api',
      ],
    },
    {
      type: 'category',
      label: 'User Documentation',
      items: [
        'user-docs/intro',
        'user-docs/end-user',
        'user-docs/system-admin',
      ],
    },
  ],
};

export default sidebars;