import { Servicios } from 'app/aguasconsumo/Components/Servicios';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const SolicitarRevision: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<Servicios />}</Tabs>
    </div>
  );
};

export default SolicitarRevision;
