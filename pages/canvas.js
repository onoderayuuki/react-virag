import dynamic from "next/dynamic"
import { useRouter } from "next/router";

const importCanvas = () => {
  const DynamicComponentWithNoSSR = dynamic(() => import('../components/test'), {ssr: false,});
  return <DynamicComponentWithNoSSR />;
};

export default importCanvas;

