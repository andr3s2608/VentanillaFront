import React from 'react';
import { useHistory } from 'react-router';
import Helmet from 'react-helmet';

// Antd
import PageHeader, { PageHeaderProps } from 'antd/es/page-header';

// Utils
import { projectInfo } from 'app/shared/utils/constants.util';

// Iconos
import { ArrowLeftOutlined } from '@ant-design/icons';

export const PageHeaderComponent: React.FC<PageHeaderProps> = (props) => {
  const { goBack } = useHistory();
  const { title, subTitle, className, backIcon = ArrowLeftOutlined, onBack = goBack, ...headerProps } = props;

  return (
    <PageHeader className={`px-0 ${className}`} {...headerProps}>
      <Helmet>
        <title>
          {title} | {projectInfo.name}
        </title>
        <meta name='description' content={`${projectInfo.description}, ${subTitle}`} />
      </Helmet>
      <div className='d-flex'>
        {backIcon !== null &&
          React.createElement(backIcon as string, {
            className: 'text-muted py-2 pr-3',
            style: { fontSize: 18 },
            onClick: onBack
          })}
        <div>
          <h2>{title}</h2>
          <p className='text-muted' style={{ maxWidth: 650 }}>
            {subTitle}
          </p>
        </div>
      </div>
    </PageHeader>
  );
};
