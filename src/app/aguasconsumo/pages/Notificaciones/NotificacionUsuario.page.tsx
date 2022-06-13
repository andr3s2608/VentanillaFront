import { Notificar } from 'app/aguasconsumo/Components/Notificar';

import Tabs from 'antd/es/tabs';

import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const NotificarUsuario: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  return <Notificar />;
};

export default NotificarUsuario;
