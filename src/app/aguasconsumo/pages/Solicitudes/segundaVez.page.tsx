import { SegundaU } from 'app/aguasconsumo/Components/SegundaU';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const SegundaVez: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<SegundaU />}</Tabs>
    </div>
  );
};

export default SegundaVez;
