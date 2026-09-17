export function imageProps(dimensions,source){
  const size=source ? dimensions?.[source] : null;
  return size ? {width:String(size.width),height:String(size.height)} : {};
}
