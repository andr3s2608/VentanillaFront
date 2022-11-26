import { PrimeraU } from 'app/aguasconsumo/Components/PrimeraU';
import React, { useCallback, useEffect, useState } from 'react';
import Tabs from 'antd/es/tabs';


const CrearSolicitud: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<PrimeraU />}</Tabs>
    </div>
  );
};

export default CrearSolicitud;
