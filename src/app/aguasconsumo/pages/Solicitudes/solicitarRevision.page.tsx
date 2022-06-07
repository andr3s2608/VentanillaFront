import { SegundaU } from 'app/aguasconsumo/Components/SegundaU';
import { RevisarSc } from 'app/aguasconsumo/Components/RevisarSc';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const SolicitarRevision: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<RevisarSc />}</Tabs>
    </div>
  );
};

export default SolicitarRevision;
