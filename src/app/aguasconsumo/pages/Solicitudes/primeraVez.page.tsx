import { PrimeraU } from 'app/aguasconsumo/Components/PrimeraU';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const PrimeraVez: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<PrimeraU />}</Tabs>
    </div>
  );
};

export default PrimeraVez;
