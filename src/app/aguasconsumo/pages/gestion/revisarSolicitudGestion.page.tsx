import { RevisarSg } from 'app/aguasconsumo/Components/RevisarSg';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const RevisarSolicitudGestion: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{<RevisarSg />}</Tabs>
    </div>
  );
};

export default RevisarSolicitudGestion;
