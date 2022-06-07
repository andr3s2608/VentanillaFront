import { RenovarP } from 'app/aguasconsumo/Components/RenovarP';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const RenovarPrimeraVez: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return <RenovarP />;
};

export default RenovarPrimeraVez;
