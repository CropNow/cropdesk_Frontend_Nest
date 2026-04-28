import { DeviceData, DeviceType } from '../../constants/deviceConstants';
import { RadialDeviceLayout } from './RadialDeviceLayout';

interface RadialDeviceLayoutV2Props {
  device: DeviceData;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
  cycleDevice: (dir: 1 | -1) => void;
}

export function RadialDeviceLayoutV2(props: RadialDeviceLayoutV2Props) {
  return <RadialDeviceLayout {...props} showTitle={false} />;
}

export default RadialDeviceLayoutV2;
