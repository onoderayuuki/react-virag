import dynamic from "next/dynamic"

const importPackage = () => {
  const DynamicComponentWithNoSSR = dynamic(() => import('../components/test'), {ssr: false,});
  return <DynamicComponentWithNoSSR />;
};

export default importPackage;

