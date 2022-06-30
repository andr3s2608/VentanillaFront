import { VisitaRu } from 'app/aguasconsumo/Components/VisitaRu';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const VistaRevision: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>
        <VisitaRu />
      </Tabs>
    </div>
  );
};

export default VistaRevision;
