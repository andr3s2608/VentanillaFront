import { RevisarSv } from 'app/aguasconsumo/Components/RevisarSv';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const RevisarSolicitudValidador: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<RevisarSv />}</Tabs>
    </div>
  );
};

export default RevisarSolicitudValidador;
